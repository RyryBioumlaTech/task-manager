import { Navigate, Outlet, useLocation } from "react-router-dom"

import { useAuth } from "@/features/auth/auth-context"

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?redirect=${redirect}`} replace />
  }

  return <Outlet />
}
