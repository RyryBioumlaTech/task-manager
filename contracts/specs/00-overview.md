# Project Overview — Task Manager

This folder is the **shared contract** between the backend and frontend development
sessions. It lets the two sessions work in parallel on the same codebase without a
shared live server.

## Vision
A **multi-user task manager** web app:
- **Backend:** FastAPI, SQLAlchemy 2.0 (async), Pydantic v2, SQLite, Alembic, JWT auth.
- **Frontend:** React 18, Vite, TypeScript (strict), Tailwind CSS, shadcn/ui, TanStack Query.
- **Design:** mobile-like UI, centered phone-frame column on desktop, bottom-nav tabs.

## The contract mechanism
- **`openapi.json`** (this folder) is the single source of truth for the API.
  It is machine-generated from the FastAPI app via `backend/scripts/export_openapi.py`
  and regenerated each time an API stage is completed.
  The frontend session consumes it to derive types and endpoints — no need to run the backend.
- **`specs/*.md`** add the non-obvious intent, sequence, and acceptance criteria that
  the OpenAPI file cannot express.

## Stages & ownership
| # | Stage | Owner | Depends on |
|---|-------|-------|------------|
| 0 | Shared contract (this folder) | backend | — |
| 1 | Backend base (server + /health + alembic) | backend | — |
| 2 | User + auth (backend) | backend | 1 |
| 3 | Task model + CRUD (backend) | backend | 2 |
| 4 | Frontend base (scaffold + shell) | frontend | 0, 1 |
| 5 | Auth UI | frontend | 4, 2 |
| 6 | Tasks UI | frontend | 5, 3 |
| 7 | Polish / harden | shared | 6 |

Only one stage is `in_progress` at a time. When a backend stage ships, regenerate
`openapi.json` and mark the stage `done` so the frontend session can pick it up.

## Shared conventions (summary)
- **Auth (dual token):** access 30 min, refresh 7 days. Passwords bcrypt‑hashed.
  Frontend keeps access token in memory; `lib/api-client.ts` auto-refreshes on 401.
- **Backend errors:** JSON `{"detail": "..."}`; auth failures return `401` with
  `WWW-Authenticate: Bearer`.
- **Frontend:** no raw `fetch`/`axios` in JSX — TanStack Query via feature hooks only.
- **Tasks are user-owned:** every task query is scoped to the authenticated user.

## Status legend
Each stage spec declares its status: `pending` → `in_progress` → `done`.
