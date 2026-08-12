# Stage 7 — Polish & Harden

**Status:** pending
**Owner:** shared (frontend + backend)
**Depends on:** 6

## Goal
Final pass: consistent polish, empty/loading/error states, and a clean verify of the
whole stack before handoff.

## Backend polish
- Final `uv run ruff check .` and `uv run pytest -q` green.
- Regenerate `contracts/openapi.json`; confirm it matches the running server.
- Confirm Alembic is up to date (`alembic upgrade head`).

## Frontend polish
- Empty states for each tab; loading skeletons; inline error + retry.
- Consistent mobile/phone-frame styling across all screens.
- `npm run build` typechecks + builds with strict TS; lint green.
- Confirmed auth auto-refresh and protected-route redirect end to end.

## Cross-cutting
- Accessibility: labels, focus states, contrast, touch targets (44px).
- Dark mode if configured.
- Review AGENTS.md against actual repo; update anything stale.

## Definition of done
- Backend: tests + ruff + migrations clean; API matches `openapi.json`.
- Frontend: build + lint clean; all four tabs functional; auth flow solid.
- Shared contract is current and any orchestrator can build from it.
