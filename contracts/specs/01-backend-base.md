# Stage 1 — Backend Base

**Status:** done
**Owner:** backend
**Depends on:** —

## Goal
A runnable FastAPI backend skeleton with a health check and Alembic wired to an
async SQLite engine, ready to receive the auth and task layers.

## Requirements
- FastAPI app in `app/main.py` with CORS for the Vite dev origin and a `/health` endpoint.
- Pydantic‑settings based `Settings` loaded from `.env` (`core/config.py`).
- Async SQLAlchemy engine + `AsyncSession` + `get_db` dependency (`db/session.py`),
  `DeclarativeBase` in `db/base.py`.
- Alembic configured for the async engine, targeting `Base.metadata`.

## API surface
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/health` | none | Liveness probe → `{"status": "ok"}` |

## Text fixtures / tools
- Run server: `uv run uvicorn app.main:app --reload --port 8000` (from `backend/`).
- Migrations: `uv run alembic revision --autogenerate -m "msg"` then `uv run alembic upgrade head`.
- Lint: `uv run ruff check . --fix`; Test: `uv run pytest -q`.

## Acceptance criteria
- `GET /health` returns `200 {"status":"ok"}`.
- `alembic upgrade head` runs against SQLite with the async engine.
- `ruff` is clean.
