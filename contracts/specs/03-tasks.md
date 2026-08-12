# Stage 3 — Task Model + CRUD (Backend)

**Status:** done
**Owner:** backend
**Depends on:** 2
**Contract:** regenerate `contracts/openapi.json` on API change (done for `GET/POST /tasks`, `GET/PATCH/DELETE /tasks/{id}`).

## Goal
User-scoped task CRUD with date, tag, and done filtering. This stage defines the
contract the frontend builds against; it is the spec for the next backend step.

## Data model — `tasks`
| column | type | notes |
|--------|------|-------|
| id | int PK | |
| owner_id | int FK → users.id | required; every query scoped to it |
| title | str | required |
| description | str | optional |
| due_date | date | optional; drives date bucketing |
| done | bool | default false |
| tags | JSON list[str] | stored as JSON on the row |

Alembic migration: one new revision, `tasks` table plus index on `(owner_id)`.

## API surface (all under `/api/v1/tasks`, **bearer** required)
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/tasks` | List own tasks with filters (below) |
| POST | `/tasks` | Create → 201 + `TaskRead` |
| GET | `/tasks/{id}` | Single task (own only) → 404 if not found/not own |
| PATCH | `/tasks/{id}` | Partial update → `TaskRead` |
| DELETE | `/tasks/{id}` | Delete → 204 |

### `GET /tasks` query filters (all optional, combinable)
| param | type | meaning |
|-------|------|---------|
| `date` | date | tasks with `due_date == date` |
| `from` | date | `due_date >= from` |
| `to` | date | `due_date <= to` |
| `tag` | str | tasks whose `tags` contains this value |
| `done` | bool | filter by completion state |
| `overdue` | bool | `due_date < today` and not done (true/false) |

### Task shape
```
TaskRead  {
  id, owner_id, title, description (nullable),
  due_date (nullable), done, tags: string[],
  created_at, updated_at
}
```
`POST /tasks` body: `{title, description?, due_date?, tags?}`. `PATCH` accepts any subset.

## Errors
- Missing/invalid token → `401`.
- Non-existent or non-owned task → `404 {"detail":"Task not found"}`.

## Acceptance criteria
- CRUD roundtrip as the owning user; other users cannot read/modify/delete the task (404).
- Each filter (`date`, `from`/`to`, `tag`, `done`, `overdue`) returns the correct subset.
- `pytest` green; `ruff` clean; `openapi.json` regenerated with `/tasks` paths.
