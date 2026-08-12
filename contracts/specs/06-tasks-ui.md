# Stage 6 — Tasks UI

**Status:** pending
**Owner:** frontend
**Depends on:** 5, 3
**Contract to consume:** `contracts/openapi.json` (tasks paths) + `03-tasks.md`.

## Goal
Full task management over the CRUD API: list tasks bucketed by due date, filter by tag
and completion, create/edit/delete, toggle done. Backend returns tasks; the frontend
**buckets by date** client-side.

## Features / components (`features/tasks/`)
- `api/` — typed calls to list/create/update/delete.
- `hooks/` — `useTasks(filters)`, `useTask`, `useCreateTask`, `useUpdateTask`, `useDeleteTask`, `useToggleDone` (TanStack Query + invalidate-on-mutation).
- `components/` — `TaskList`, `TaskItem` (checkbox, title, due date, tags), `TaskFormDialog`, `TagFilterChips`, `DateBucketSection`, `TaskEmptyState`.
- `types/` — `Task`, `TaskInput`, `TaskFilters` (from OpenAPI `TaskRead`).

## Views (bottom tabs)
- **Today** — tasks due today (and overdue marked).
- **Upcoming** — future-dated tasks.
- **Overdue** — `due_date < today`, not done.
- **All** — every task, grouped by date, newest/relevant first.

## Interactions
- Tag filter chips row above the list (multi-select; client-side filter or `tag` query).
- Floating action button (**+**) opens create dialog; editing reuses the dialog.
- Checkbox toggles `done` (optimistic update, rollback on error).
- Delete with confirmation.
- Fields: title, description, due date, tags.

## Performance
- Debounce any search/input ≥ 300ms.
- Virtualize (`@tanstack/react-virtual`) lists > 100 items.
- Animate only `transform`/`opacity`.

## Acceptance criteria
- Today/Upcoming/Overdue/All render the correct tasks per the backend data.
- Create/edit/delete/toggle done update the list immediately and persist (verify against `openapi.json` shapes).
- Tag filtering works; empty states shown when a bucket is empty.
- Strict TS + lint pass.
