export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "" : "http://localhost:8000")

export const API_V1_PREFIX = "/api/v1"
