import { API_BASE_URL, API_V1_PREFIX } from "@/config/env"
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/lib/auth-store"

/**
 * Emitted when a refresh attempt fails and the session must end.
 * The auth provider listens for this to clear state and redirect to /login.
 */
export const UNAUTHORIZED_EVENT = "auth:unauthorized"

export interface ApiErrorBody {
  detail?: string | unknown
}

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
  query?: Record<string, string | number | boolean | undefined>
  json?: unknown
  form?: Record<string, string>
  auth?: boolean
}

async function readErrorBody(response: Response): Promise<string> {
  try {
    const json: ApiErrorBody = (await response.json()) as ApiErrorBody
    if (typeof json.detail === "string") {
      return json.detail
    }
  } catch {
    // fall through to status text
  }
  return response.statusText || `Request failed with status ${response.status}`
}

class RefreshGuard {
  private inFlight: Promise<string | null> | null = null

  get token(): Promise<string | null> {
    if (this.inFlight) {
      return this.inFlight
    }
    this.inFlight = this.run()
    return this.inFlight
  }

  private async run(): Promise<string | null> {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      return null
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_V1_PREFIX}/auth/refresh?refresh_token=${encodeURIComponent(refreshToken)}`,
        { method: "POST" },
      )
      if (!response.ok) {
        return null
      }
      const body: { access_token?: string; refresh_token?: string } =
        (await response.json()) as { access_token?: string; refresh_token?: string }
      if (!body.access_token || !body.refresh_token) {
        return null
      }
      setTokens({
        accessToken: body.access_token,
        refreshToken: body.refresh_token,
      })
      return body.access_token
    } catch {
      return null
    } finally {
      this.inFlight = null
    }
  }
}

const refreshGuard = new RefreshGuard()

function emitUnauthorized(): void {
  clearTokens()
  window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
}

export async function apiFetch<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    query,
    json,
    form,
    auth = true,
  } = options

  let url = `${API_BASE_URL}${API_V1_PREFIX}${path}`
  if (query) {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        params.set(key, String(value))
      }
    }
    const qs = params.toString()
    if (qs) {
      url += `?${qs}`
    }
  }

  const headers = new Headers()
  if (auth) {
    const token = getAccessToken()
    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }
  }

  let body: BodyInit | undefined
  if (json !== undefined) {
    headers.set("Content-Type", "application/json")
    body = JSON.stringify(json)
  } else if (form) {
    const formData = new URLSearchParams()
    for (const [key, value] of Object.entries(form)) {
      formData.set(key, value)
    }
    headers.set("Content-Type", "application/x-www-form-urlencoded")
    body = formData.toString()
  }

  const execute = async (retried: boolean): Promise<T> => {
    const response = await fetch(url, {
      method,
      headers,
      body,
    })

    if (response.status === 401 && auth && !retried) {
      const newAccess = await refreshGuard.token
      if (newAccess) {
        headers.set("Authorization", `Bearer ${newAccess}`)
        return execute(true)
      }
      emitUnauthorized()
    }

    if (!response.ok) {
      const message = await readErrorBody(response)
      throw new ApiError(response.status, message)
    }

    if (response.status === 204) {
      return undefined as T
    }

    return (await response.json()) as T
  }

  return execute(false)
}
