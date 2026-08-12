import { createBrowserRouter, Navigate } from "react-router-dom"

import { ProtectedRoute } from "@/components/ProtectedRoute"
import { AppShell } from "@/components/layout/app-shell"
import { LoginPage } from "@/pages/LoginPage"
import { RegisterPage } from "@/pages/RegisterPage"
import { AllPage } from "@/pages/tasks/AllPage"
import { OverduePage } from "@/pages/tasks/OverduePage"
import { TodayPage } from "@/pages/tasks/TodayPage"
import { UpcomingPage } from "@/pages/tasks/UpcomingPage"

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="/tasks/today" replace /> },
          { path: "tasks/today", element: <TodayPage /> },
          { path: "tasks/upcoming", element: <UpcomingPage /> },
          { path: "tasks/overdue", element: <OverduePage /> },
          { path: "tasks/all", element: <AllPage /> },
        ],
      },
    ],
  },
])
