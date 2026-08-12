# AGENTS.md

## Status
Active codebase. Monorepo with `backend/` (FastAPI) and `frontend/` (React + Vite),
plus `contracts/` (shared spec + generated `openapi.json`). Unless told otherwise, do
frontend work only in `frontend/`.

## Stack (actual)
- **Backend:** FastAPI, Python 3.11+, SQLAlchemy 2.0 (async), Pydantic v2, SQLite (`sqlite+aiosqlite`), PyJWT. Passwords hashed with **bcrypt** (via passlib).
- **Frontend:** Vite 8, React 19, TypeScript strict (`strict` + `noUncheckedIndexedAccess`), Tailwind CSS **v4**, shadcn/ui **`base-nova`** (Base UI, not Radix), lucide icons, TanStack Query, React Router 7, `@tanstack/react-virtual`. Linter: **oxlint**.
- **Tooling:** `uv` (Python), `npm` (frontend).

## Backend conventions (non-obvious)
- 100% typed signatures; endpoints `async def` with `AsyncSession`, always `await` DB calls.
- Pydantic v2 response schemas: `model_config = ConfigDict(from_attributes=True)`.
- Layout: `api/v1/endpoints/*`, `core/` (config + `security.py`), `crud/`, `db/`, `models/`, `schemas/`, `services/`, `main.py`.
- **Auth (dual token):** access 15-30 min; refresh 7 days used only on refresh endpoint. `api/deps.py` `get_current_user` returns `401 "Could not validate credentials"` with `WWW-Authenticate: Bearer` header. Real endpoints: `POST /api/v1/auth/register`, `POST /api/v1/auth/login` (URL-encoded form), `POST /api/v1/auth/refresh?refresh_token=...`, `GET /api/v1/auth/me`. Tasks: `GET/POST /api/v1/tasks`, `GET/PATCH/DELETE /api/v1/tasks/{task_id}` with filters `date`/`from`/`to`/`tag`/`done`/`overdue`.

## Frontend conventions (non-obvious)
- **No direct `fetch`/`axios` in JSX.** Use TanStack Query (`useQuery`/`useMutation`) in custom hooks under `features/<feature>/`.
- Token handling: access token in memory (store, XSS-safe); `src/lib/api-client.ts` (`apiFetch`) injects `Bearer` and auto-refreshes once on 401, else logout + `queryClient.clear()` + event `auth:unauthorized`. `ProtectedRoute` wraps private pages, redirects `/login?redirect=<path>`.
- Feature-driven layout: `components/`, `features/<feature>/{api,components,hooks,types}`, `lib/`, `pages/`, `router/`, `types/`.
- **Tasks query key is flat:** `["tasks", filters]`; invalidate/update with `["tasks"]`. Never nest the key inside another array (caused stale-list bug).
- Performance: debounce inputs >= 300ms; animate only GPU props (`transform`/`opacity`); `@tanstack/react-virtual` for lists > 100 items.

## Commands
- Backend dev: `cd backend && uv run uvicorn app.main:app --port 8000`
- Frontend dev: `cd frontend && npm run dev` (port 5173)
- Backend lint/tests: `cd backend && uv run ruff check . && uv run pytest -q`
- Frontend checks: `cd frontend && npm run build` (tsc strict) ; `npm run lint` (oxlint)
- DB after model change: `uv run alembic revision --autogenerate -m "msg"` then `uv run alembic upgrade head`
- Add shadcn component: `cd frontend && npx shadcn@latest add <name>`

## Test account
- `demo@test.dev` / `demo-pass-123`

## Hard rules
1. Any ORM model create/modify must ship the matching Alembic migration.
2. Do not add dependencies (`npm install` / `uv add`) without asking first.
3. No `any` in TypeScript; use `unknown` or a typed interface.
4. Never delete existing comments, types, or utility functions without explicit reason.
5. When presenting modified files, give full code (no `// ...` truncation).
