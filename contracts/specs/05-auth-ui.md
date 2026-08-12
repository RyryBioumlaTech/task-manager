# Stage 5 — Auth UI

**Status:** pending
**Owner:** frontend
**Depends on:** 4, 2
**Contract to consume:** `contracts/openapi.json` (auth paths) + `02-auth.md`.

## Goal
Login and register pages wired to the backend auth API, protected routes, and the
auto-refresh token flow.

## Features / components (`features/auth/`)
- `api/` — typed calls to register/login/refresh/me.
- `hooks/` — `useLogin`, `useRegister`, `useLogout`, `useMe` (TanStack Query + mutations).
- `components/` — `LoginForm`, `RegisterForm`, `ProtectedRoute`.
- `types/` — `User`, `AuthTokens`, `LoginCredentials` (from OpenAPI `UserRead`/`Token`).

## Token flow (must match backend)
- Keep **access token in memory** via store/context (`lib/auth-store`).
- `lib/api-client.ts` interceptor: attach Bearer; on 401 → refresh once, replay, else logout + clear query cache + redirect `/login?redirect=<path>`.
- `ProtectedRoute` redirects unauthenticated users.

## Pages / routing
- `/login`, `/register` — public.
- App shell + task tabs — private behind `ProtectedRoute`.

## Acceptance criteria
- Register creates an account (409 shown on duplicate email).
- Login stores tokens and redirects to the intended page (honors `?redirect=`).
- `/me` loads the user; invalid/expired access token triggers a silent refresh; failed refresh logs out and redirects.
- Doing these actions on the private shell is impossible while logged out (redirect to login).

## Visual
- Same phone-frame shell; forms centered, mobile-first, shadcn inputs/buttons, loading + error states.
