# Design Notes

## Architecture overview

```
React (Vite)  --HTTP JSON-->  Express (/api)  -->  Zod validation
                                    |                  |
                                    v                  v
                              stateMachine (pure)   Prisma --> SQLite
                                    ^
                                    |
                         Jest + Supertest (integration)
```

Monorepo: `src/frontend`, `src/backend` (npm workspaces). Detailed diagram: [docs/proposed-architecture.md](./docs/proposed-architecture.md).

## Frontend design

- React Router routes: `/`, `/tickets/new`, `/tickets/:id`.
- Acting-user picker loads `GET /api/users`; selection in `localStorage`.
- List: debounced `q` + `status` query params.
- Detail: edit form disabled when status is terminal; status buttons only from `allowedTransitions`; comment form always available.
- Client helpers under `src/frontend/src/api/` map HTTP + error codes to UI banners.

## Backend design

- Express app factory (`createApp`) for production listen and tests.
- Modules: routes, `validation.js` (Zod), `stateMachine.js` (pure), `errors.js` (`sendError`).
- Status changes **only** via `POST /api/tickets/:id/status` using `canTransition`.
- `PATCH /api/tickets/:id` is strict and does not accept `status`.
- Terminal statuses (`CLOSED`, `CANCELLED`): block field PATCH (`TICKET_TERMINAL`); allow comments.

## Database design

- Prisma models: User, Ticket, Comment (FKs for creator, assignee, comment author).
- SQLite file at `src/backend/database/dev.db` (gitignored).
- Migrations under `src/backend/prisma/migrations/`; seed upserts users and skips sample tickets by title.
- See [data-model.md](./data-model.md) and [database/setup-notes.md](./database/setup-notes.md).

## Validation strategy

- Backend is source of truth: Zod schemas for query + write bodies.
- Frontend provides UX validation and surfaces API `VALIDATION_ERROR` / field details when present.

## Error handling strategy

Envelope:

```json
{ "error": { "code": "INVALID_TRANSITION", "message": "...", "details": { } } }
```

Notable codes: `VALIDATION_ERROR`, `TICKET_NOT_FOUND`, `USER_NOT_FOUND`, `INVALID_TRANSITION`, `TICKET_TERMINAL`.

## Major decisions

| Decision | Why |
| --- | --- |
| Pure `stateMachine` module | Same rules for API + tests; easy to reason about |
| Separate status endpoint | Prevents SM bypass via generic PATCH |
| `allowedTransitions` on detail | UI only offers legal actions |
| Case-insensitive search via SQL `lower(...) LIKE` | Prisma `contains` on SQLite is case-sensitive |
| Prisma 5.22 + RR 6 | Node 18 constraint (Prisma 7 / RR 7 need Node 20+) |
| No auth in Core | Assessment allows seed + picker; auth is Stretch |

## Testing strategy link

See [test-strategy.md](./test-strategy.md).
