# Stage 2 — User + Auth (Backend)

**Status:** done
**Owner:** backend
**Depends on:** 1

## Goal
JWT authentication: register, login (access + refresh tokens), refresh, and current-user
lookup. Passwords bcrypt‑hashed; tokens signed with HS256.

## Data model — `users`
| column | type | notes |
|--------|------|-------|
| id | int PK | |
| email | str | unique, indexed |
| hashed_password | str | bcrypt, via `core/security.py` |
| created_at | datetime | server_default now |

Alembic migration: `8422390404d4_create_users_table`.

## API surface (all under `/api/v1`)
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/auth/register` | none | Create user. 201 on success, **409** if email exists. Body: `{email, password}` → `UserRead`. |
| POST | `/auth/login` | none | Form (`username`, `password`) → `Token`. 401 on bad creds. |
| POST | `/auth/refresh` | none | Query `refresh_token` → new `Token`. 401 on invalid. |
| GET | `/auth/me` | **bearer** | Current user → `UserRead`. 401 if invalid/missing token. |

### Response shapes
```
UserRead    { id, email, created_at }
Token       { access_token, refresh_token, token_type: "bearer" }
```
`UserRead` never includes `hashed_password`. Access token TTL 30 min, refresh 7 days.

## Security / errors
- Password hashing + JWT helpers in `core/security.py`.
- `get_current_user` dependency raises `401 {"detail":"Could not validate credentials"}`
  with header `WWW-Authenticate: Bearer`.
- Failed auth everywhere returns `401 {"detail": ...}`.

## Acceptance criteria
- Register→login→/me roundtrip works; duplicate email → 409; wrong password → 401.
- `/me` without/with invalid token → 401.
- Refresh returns a fresh `Token`.
- `pytest` green (`tests/test_auth.py`); `ruff` clean.
