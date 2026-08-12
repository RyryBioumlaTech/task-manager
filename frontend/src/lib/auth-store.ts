export interface StoredTokens {
  accessToken: string
  refreshToken: string
}

let accessToken: string | null = null
let refreshToken: string | null = null

const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) {
    listener()
  }
}

export function getAccessToken(): string | null {
  return accessToken
}

export function getRefreshToken(): string | null {
  return refreshToken
}

export function setTokens(tokens: StoredTokens): void {
  accessToken = tokens.accessToken
  refreshToken = tokens.refreshToken
  emit()
}

export function clearTokens(): void {
  accessToken = null
  refreshToken = null
  emit()
}

export function subscribeAuth(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
