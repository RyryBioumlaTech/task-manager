import { LogOutIcon } from "lucide-react"
import { Outlet } from "react-router-dom"

import { Button } from "@/components/ui/button"

import { useLogout, useMe } from "@/features/auth/hooks"

import { BottomNav } from "./bottom-nav"

function AppHeader() {
  const logout = useLogout()
  const { data: user } = useMe()

  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold">Tasks</p>
        <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
      </div>
      <Button variant="ghost" size="icon-lg" onClick={logout} aria-label="Sign out">
        <LogOutIcon />
      </Button>
    </header>
  )
}

export function AppShell() {
  return (
    <div className="mx-auto flex h-dvh w-full max-w-[420px] flex-col bg-background shadow-2xl sm:border-x sm:border-border">
      <AppHeader />
      <main className="flex-1 overflow-y-auto px-4 py-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
