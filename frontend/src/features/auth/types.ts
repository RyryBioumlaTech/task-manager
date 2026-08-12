export interface User {
  id: number
  email: string
  created_at: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
}
