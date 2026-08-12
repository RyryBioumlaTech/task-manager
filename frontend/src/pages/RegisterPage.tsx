import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

import { RegisterForm } from "@/features/auth/components/RegisterForm"

export function RegisterPage() {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center p-6">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-xl font-medium">Create your account</h1>
          <p className="text-sm text-muted-foreground">Get started with the task manager.</p>
        </div>
        <RegisterForm />
        <p className="text-center">
          <Button render={<Link to="/login" />} variant="link">
            Already have an account? Sign in
          </Button>
        </p>
      </div>
    </div>
  )
}
