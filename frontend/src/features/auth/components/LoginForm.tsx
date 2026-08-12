import { useNavigate, useSearchParams } from "react-router-dom"
import { useState, type FormEvent } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

import { useLogin } from "../hooks"

export function LoginForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const login = useLogin()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await login.mutateAsync({ username: email, password })
    const redirect = searchParams.get("redirect") || "/"
    navigate(redirect, { replace: true })
  }

  const error = login.error instanceof Error ? login.error.message : null

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Login failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="login-email">Email</FieldLabel>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="py-[5px] h-[2.625rem]"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="login-password">Password</FieldLabel>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="py-[5px] h-[2.625rem]"
          />
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={login.isPending} className="w-full py-[5px] h-[2.625rem]">
        {login.isPending && <Spinner data-icon="inline-start" />}
        {login.isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )
}
