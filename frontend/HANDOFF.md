# Handoff Frontend — Fin de session n°3

> Fichier **temporaire** de résumé pour la prochaine session.
> Objectif : repartir sans perdre le contexte de ce qui a été fait et de ce qui reste.

## Contexte projet

- App multi-utilisateurs de gestion de tâches, découpée en **stages** (voir `contracts/specs/00-overview.md`).
- Toute la logique produit est dans `contracts/specs/*.md` + `contracts/openapi.json` (contrat généré depuis le backend).
- Backend : FastAPI + SQLAlchemy async + SQLite + Auth JWT, dans `backend/`.
- Nous travaillons **uniquement sur le frontend** (`frontend/`).

## État des stages

| # | Stage | Status |
|---|-------|--------|
| 0 | Contrat partagé | done |
| 1 | Backend base | done |
| 2 | Auth (backend) | done |
| 3 | Tasks (backend) | done — `/tasks` dans `openapi.json`, CRUD vérifié |
| 4 | Frontend base (shell) | done |
| 5 | Auth UI (frontend) | done |
| 6 | Tasks UI (frontend) | done — incl. FAB et bug du refresh de liste corrigés |
| 7 | Polish | **pending** (seul reste) |

## Stack frontend

- Vite 8 + React 19 + TypeScript **strict** (`strict` + `noUncheckedIndexedAccess`).
- Tailwind CSS **v4**, shadcn/ui **`base-nova`** (Base UI, pas Radix), icônes **lucide**.
- TanStack Query (`@tanstack/react-query`), React Router 7 (`react-router-dom`).
- `@tanstack/react-virtual` (virtualisation >100 items).
- Linter : `oxlint`.

## Ce qui a été fait (Session 3)

1. **Bug FAB résolu** — le bouton « + » flotte désormais juste au-dessus de la nav, style WhatsApp :
   - `src/index.css` : variable `--nav-height: 56px` ajoutée dans `:root` et `.dark`.
   - `src/components/layout/bottom-nav.tsx` : nav en `h-[var(--nav-height)]`.
   - `src/features/tasks/components/TasksView.tsx` : FAB passé de `sticky` (dans `<main>`, borné au bord du scroll) à un wrapper `fixed inset-x-0 bottom-0` plein écran (`pointer-events-none`) avec inner `mx-auto max-w-[420px] px-4 flex justify-end` et `pb-[calc(var(--nav-height)+0.75rem)]` ; le `Button` reste `pointer-events-auto`. Le FAB échappe au scroll et reste aligné sur la colonne centrée.
2. **Formulaires auth sans fond/ombre** — `src/pages/LoginPage.tsx` et `src/pages/RegisterPage.tsx` : le wrapper `Card` (= bg + ring) est remplacé par un `div` transparent (`flex flex-col gap-6`, `max-w-sm` centré, titre `h1` + description + lien). Le style des `Input`/Button est inchangé.
3. **Padding vertical +5px** — boutons « Sign in » / « Create account » et les 5 champs (email + password + confirm, login & register) passés à `py-[5px] h-[2.625rem]` (hauteur 42px, +10px pour que le padding soit effectif).
4. **Bug « liste figée après CRUD » résolu** (root cause : nested query key) :
   - `src/features/tasks/hooks.ts` : `TASKS_KEY` était `["tasks"]` (array), et `tasksQueryKey` le renvoyait dans un autre array → key réelle `[["tasks"], filters]`. Tous les `invalidateQueries`/`setQueriesData` utilisaient le plat `["tasks"]` qui ne matchait **jamais** (`partialMatchKey` = `false`, vérifié contre la source de `@tanstack/query-core`).
   - Fix : `TASKS_KEY = "tasks"` (string) → key plate `["tasks", filters]`, et les 6 appels passés à `{ queryKey: [TASKS_KEY] }`. Désormais create/update/delete/toggle se reflètent immédiatement, sans reload. Répare aussi l'optimiste du toggle.

## Détails d'implémentation à connaître (pièges)

- **`api-client.ts`** (`src/lib/api-client.ts`) : 401 → refresh unique (single-flight), sinon logout + `queryClient.clear()` + event `auth:unauthorized`. Ne pas réécrire.
- **Login backend** = formulaire URL-encodé (`username`/`password`, username = email), PAS JSON.
- **Refresh backend** = query param `?refresh_token=...`, pas de body JSON.
- **CORS** : uniquement `localhost:5173` / `127.0.0.1:5173` → rester sur 5173.
- **shadcn `base-nova`** : `Button` via `render={<Link/>}` (pas `asChild`), champs `Field`/`FieldGroup`/`FieldLabel`, `Empty`/`EmptyTitle`, `Spinner`, `Dialog`/`AlertDialog`/`Badge`/`Checkbox`.
- **Checkbox Base UI** : props `checked` / `onCheckedChange` (pas l'événement natif).
- **Query keys tasks** : clé plate `["tasks", filters]` ; invalider avec `["tasks"]` (ne jamais imbriquer la clé dans un array).
- **Warnings lint restants (à ignorer, fast-refresh shadcn)** : `ui/button.tsx`, `ui/badge.tsx` (export de `buttonVariants`/`badgeVariants`).

## Commandes

- Backend dev : `cd backend && uv run uvicorn app.main:app --port 8000`
- Frontend dev : `cd frontend && npm run dev` (port 5173)
- Vérifs frontend : `npm run build` (tsc strict) ; `npm run lint` (oxlint)
- Ajouter un composant shadcn : `cd frontend && npx shadcn@latest add <nom>`

## Compte de test

- `demo@test.dev` / `demo-pass-123` (créé via `POST /api/v1/auth/register`).

## Incidents rencontrés

- **"attempt to write a readonly database"** (backend, session 1) : 2 instances uvicorn partageant `task_manager.db`. Tuer toutes les instances et n'en relancer qu'une : `ps aux | grep uvicorn` (1 backend + 1 vite en dev).
- **playwright-cli** installé globalement (`npm install -g @playwright/cli@latest`) mais **non utilisé** cette session (utilisateur sur Zen browser). Nécessite `npx playwright install chromium` avant tout `open` si on veux le réutiliser.

## Ce qu'il reste à faire (prochaine session)

1. **Stage 7 — Polish** (seul reste) : états empty/loading/error finis (déjà des skeletons/empty dans TasksView), a11y (touch targets 44px), revue style si l'utilisateur veut (design-system ui-ux-pro-max suggérait Inter/bleu, on a gardé Geist/neutral).
2. **Cleanup** : mettre à jour `AGENTS.md` à la racine (toujours obsolète : dit « no source code yet », stack frontend réelle = React 19/Tailwind v4/base-nova/oxlint ; backend = bcrypt pas argon2, endpoints réels `/auth/register` `/login` `/refresh` `/me`).
3. Le fichier temporaire `frontend/HANDOFF.md` peut être supprimé une fois la nouvelle session démarrée.

## Auteur / moment
- Fin de session n°3 (frontend). FAB, formes auth, padding et bug de refresh liste — tout implémenté et fonctionnel. Résumé rédigé pour reprise.
