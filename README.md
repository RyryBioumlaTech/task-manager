# Task Manager

Task manager monorepo with a FastAPI backend, a React + Vite frontend, and shared API contracts.

## Structure

- `backend/` — FastAPI (Python 3.11+), SQLAlchemy 2.0 async, SQLite, JWT auth (access + refresh tokens), Alembic migrations.
- `frontend/` — React 19 + Vite, TanStack Query, shadcn/ui (Base UI), Tailwind CSS v4, TypeScript strict.
- `contracts/` — shared spec and generated `openapi.json`.

## Quickstart

### Backend

```sh
cd backend
uv sync
uv run uvicorn app.main:app --port 8000
```

Run checks:

```sh
uv run ruff check . && uv run pytest -q
```

### Frontend

```sh
cd frontend
npm install
npm run dev
```

In dev, Vite serves on `http://localhost:5173` and proxies `/api/*` to the backend (`server.host` is enabled for LAN access). Local checks:

```sh
npm run build   # tsc strict + vite build
npm run lint    # oxlint
```

## Test account

- `demo@test.dev` / `demo-pass-123`

## Auth

Dual-token JWT: access token (30 min) + refresh token (7 days, used only on the refresh endpoint). Endpoints: `POST /api/v1/auth/register`, `POST /api/v1/auth/login` (URL-encoded form), `POST /api/v1/auth/refresh`, `GET /api/v1/auth/me`.

Tasks API: `GET/POST /api/v1/tasks`, `GET/PATCH/DELETE /api/v1/tasks/{task_id}` with filters `date`/`from`/`to`/`tag`/`done`/`overdue`.