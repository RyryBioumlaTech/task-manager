import { useNavigate } from "react-router-dom"
import { useState, type FormEvent } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

import { useRegister } from "../hooks"

export function RegisterForm() {
  const navigate = useNavigate()
  const register = useRegister()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [mismatch, setMismatch] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (password !== confirmPassword) {
      setMismatch(true)
      return
    }
    setMismatch(false)
    await register.mutateAsync({ email, password })
    navigate("/login", { replace: true })
  }

  const error = register.error instanceof Error ? register.error.message : null

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Registration failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {mismatch && (
        <Alert variant="destructive">
          <AlertTitle>Passwords do not match</AlertTitle>
          <AlertDescription>Please re-enter your password.</AlertDescription>
        </Alert>
      )}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="register-email">Email</FieldLabel>
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="py-[5px] h-[2.625rem]"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="register-password">Password</FieldLabel>
          <Input
            id="register-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="py-[5px] h-[2.625rem]"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="register-confirm">Confirm password</FieldLabel>
          <Input
            id="register-confirm"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="py-[5px] h-[2.625rem]"
          />
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={register.isPending} className="w-full py-[5px] h-[2.625rem]">
        {register.isPending && <Spinner data-icon="inline-start" />}
        {register.isPending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  )
}
