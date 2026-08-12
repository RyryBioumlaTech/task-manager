import {
  useCallback,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react"

import { UNAUTHORIZED_EVENT } from "@/lib/api-client"
import {
  clearTokens,
  getAccessToken,
  setTokens,
  subscribeAuth,
} from "@/lib/auth-store"
import { queryClient } from "@/lib/query-client"

import { loginUser, registerUser } from "./api"
import { AuthContext } from "./auth-context"
import type { LoginCredentials, RegisterCredentials } from "./types"

const AUTH_SERVER_SNAPSHOT = false

export function AuthProvider({ children }: { children: ReactNode }) {
  const isAuthenticated = useSyncExternalStore(
    subscribeAuth,
    () => getAccessToken() !== null,
    () => AUTH_SERVER_SNAPSHOT,
  )

  useEffect(() => {
    function handleUnauthorized() {
      queryClient.clear()
    }
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
    }
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const tokens = await loginUser(credentials)
    setTokens({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    })
  }, [])

  const register = useCallback(async (credentials: RegisterCredentials) => {
    await registerUser(credentials)
  }, [])

  const logout = useCallback(() => {
    clearTokens()
    queryClient.clear()
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
