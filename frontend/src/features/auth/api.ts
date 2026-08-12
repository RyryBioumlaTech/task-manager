import { apiFetch } from "@/lib/api-client"

import type { AuthTokens, LoginCredentials, RegisterCredentials, User } from "./types"

export function registerUser(data: RegisterCredentials): Promise<User> {
  return apiFetch<User>("/auth/register", { method: "POST", json: data })
}

export function loginUser(data: LoginCredentials): Promise<AuthTokens> {
  return apiFetch<AuthTokens>("/auth/login", {
    method: "POST",
    form: { username: data.username, password: data.password },
  })
}

export function fetchMe(): Promise<User> {
  return apiFetch<User>("/auth/me")
}
