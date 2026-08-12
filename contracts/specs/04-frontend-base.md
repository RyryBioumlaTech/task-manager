# Stage 4 — Frontend Base

**Status:** pending
**Owner:** frontend
**Depends on:** 0, 1

## Goal
A runnable React + Vite app in `frontend/` with the phone-frame shell, bottom-nav
tabs, Tailwind/shadcn, TanStack Query, router, and the API client with automatic token
refresh. No real data flows yet — shells only.

## Scaffold
- Vite + React 18 + TypeScript (**strict**), Tailwind CSS, shadcn/ui, Lucide React, `@tanstack/react-query`.
- Verified running: `npm run dev`.

## Non-negotiables (from AGENTS.md)
- **No raw `fetch`/`axios` in JSX.** All server calls go through TanStack Query hooks under `features/<feature>/hooks`.
- `lib/api-client.ts`: injects `Authorization: Bearer <access>`; on `401` tries refresh once, else logs out, clears the query cache, redirects `/login`.
- `lib/query-client.ts`: singleton TanStack Query client.
- Token held **in memory** (store/context) — XSS-safe, never in localStorage.
- `ProtectedRoute` wraps private pages → redirects to `/login?redirect=<path>`.
- No `any`: use `unknown` or a typed interface.

## Layout
```
frontend/
├── src/
│   ├── components/
│   ├── config/
│   ├── features/
│   ├── hooks/
│   ├── lib/             # api-client.ts, query-client.ts
│   ├── pages/
│   ├── router/
│   ├── styles/
│   └── types/
```

## Phone-frame shell
- App constrained to a centered column (`max-w` ~420px) on desktop; full width on small screens.
- Bottom navigation tab bar with placeholders: **Today, Upcoming, Overdue, All**.
- Stub pages for each tab render an empty state; no API calls yet.

## Acceptance criteria
- `npm run dev` serves the phone-frame shell with bottom tabs and a route per tab.
- Strict TypeScript typechecks; lint passes.
- API client + auth store exist and compile even with no endpoints wired.
