import { useMutation, useQuery } from "@tanstack/react-query"
import { useCallback } from "react"

import { useAuth } from "./auth-context"
import { fetchMe } from "./api"
import type { LoginCredentials, RegisterCredentials, User } from "./types"

export function useMe() {
  const { isAuthenticated } = useAuth()
  return useQuery<User>({
    queryKey: ["auth", "me"],
    queryFn: fetchMe,
    enabled: isAuthenticated,
  })
}

export function useLogin() {
  const { login } = useAuth()
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
  })
}

export function useRegister() {
  const { register } = useAuth()
  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => register(credentials),
  })
}

export function useLogout() {
  const { logout } = useAuth()
  return useCallback(() => logout(), [logout])
}
