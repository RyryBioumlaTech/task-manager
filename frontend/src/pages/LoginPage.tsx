import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

import { LoginForm } from "@/features/auth/components/LoginForm"

export function LoginPage() {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center p-6">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-xl font-medium">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to continue to your tasks.</p>
        </div>
        <LoginForm />
        <p className="text-center">
          <Button render={<Link to="/register" />} variant="link">
            Don&apos;t have an account? Create one
          </Button>
        </p>
      </div>
    </div>
  )
}
