# Support Ticket Management System

Core support-ticket app built for the JS AI Capability Exercise: React (Vite) + Node.js/Express + SQLite/Prisma.

**Scope:** Mandatory Core only. Stretch (auth, pagination, OpenAPI, Docker, CI, user CRUD) is deferred — see [Future work](#future-work-stretch).

## Prerequisites

- **Node.js** 18+ (Prisma 5.x and React Router 6 are pinned for Node 18)
- **npm** 9+ (workspaces)

## Quick start

```bash
npm install
cp .env.example .env
npm run db:setup
npm run test
npm run dev
```

| Service  | URL                   | Notes |
| -------- | --------------------- | ----- |
| Backend  | http://localhost:3001 | Full Core read/write API |
| Frontend | http://localhost:5173 | List, create, edit, status, comments |

Vite proxies `/api` to the backend, so the UI can call `/api/*` without CORS issues in local dev.

### Verify

1. Open http://localhost:5173 — seeded tickets appear on the list.
2. Create a ticket, edit fields, change status via allowed buttons, add a comment.
3. Search by keyword and filter by status.
4. Restart `npm run dev` — data is still present (SQLite file).
5. `npm test` — state-machine integration tests pass (no UI required).

## Scripts

| Script                 | Description |
| ---------------------- | ----------- |
| `npm run dev`          | Backend + frontend concurrently |
| `npm run dev:backend`  | API only on port **3001** |
| `npm run dev:frontend` | Vite only on port **5173** |
| `npm test`             | State-machine integration tests (Jest + Supertest) |
| `npm run db:setup`     | Generate client → migrate → seed |
| `npm run db:migrate`   | Apply pending migrations |
| `npm run db:seed`      | Seed users/tickets (safe to re-run) |
| `npm run db:generate`  | Generate Prisma Client |
| `npm run lint`         | ESLint for backend and frontend |

Database details: [database/setup-notes.md](./database/setup-notes.md).

## Environment

Copy `.env.example` to `.env`. **Do not commit** `.env` or `*.db` files.

```env
PORT=3001
DATABASE_URL="file:../database/dev.db"
```

`DATABASE_URL` is resolved relative to `src/backend/prisma/` → `src/backend/database/dev.db`.  
`npm run db:*` syncs the root `.env` into `src/backend/.env` for the Prisma CLI.

## API (manual smoke)

```bash
npm run db:setup
npm run dev:backend

curl http://localhost:3001/api/health
curl http://localhost:3001/api/users
curl "http://localhost:3001/api/tickets?status=OPEN"
curl "http://localhost:3001/api/tickets?q=password"
```

Write examples (replace `<user-id>` / `<id>` from the list responses):

```bash
curl -X POST http://localhost:3001/api/tickets \
  -H 'Content-Type: application/json' \
  -d '{"title":"New issue","description":"Details","priority":"MEDIUM","createdBy":"<user-id>"}'

curl -X PATCH http://localhost:3001/api/tickets/<id> \
  -H 'Content-Type: application/json' \
  -d '{"priority":"HIGH"}'

curl -X POST http://localhost:3001/api/tickets/<id>/status \
  -H 'Content-Type: application/json' \
  -d '{"status":"IN_PROGRESS"}'

curl -X POST http://localhost:3001/api/tickets/<id>/comments \
  -H 'Content-Type: application/json' \
  -d '{"message":"Looking into it.","createdBy":"<user-id>"}'
```

Error codes of note: `VALIDATION_ERROR`, `TICKET_NOT_FOUND`, `USER_NOT_FOUND`, `INVALID_TRANSITION`, `TICKET_TERMINAL`. Full contract: [api-contract.md](./api-contract.md).

## Frontend routes

| Path | Purpose |
| ---- | ------- |
| `/` | Ticket list (search + status filter) |
| `/tickets/new` | Create ticket |
| `/tickets/:id` | Detail, edit, status actions, comments |

Acting-user picker (header) persists selection in `localStorage` (no auth in Core).

## Project layout

```
README.md                 # This file
candidate-info.md         # Assessment identity
tool-workflow.md          # Part A — AI workflow
requirements-analysis.md  # Requirements understanding
acceptance-criteria.md    # Core checklist
implementation-plan.md    # Milestone plan (see also docs/)
design-notes.md           # Architecture decisions
api-contract.md           # REST contract
data-model.md             # Entities
ui-flow.md                # User flows
test-strategy.md          # Test approach
test-results.md           # Latest SM test run notes
debugging-notes.md        # Debug incidents
code-review-notes.md      # Review observations
review-fixes.md           # Fixes after review
pr-description.md         # PR / handoff summary
reflection.md             # Reflection
final-ai-usage-summary.md # AI usage across lifecycle
src/backend/              # Express API + Prisma + tests/
src/frontend/             # React + Vite SPA
database/                 # Setup notes (+ pointers to Prisma)
tests/                    # Assessment layout stub
ai-prompts/               # Grouped prompt history
tool-specific/cursor-workflow/  # Cursor context, spec, rules
docs/                     # Detailed planning docs used during build
```

## Tests

```bash
npm test
```

Jest + Supertest against the Express app factory. Isolated SQLite (`src/backend/database/test.db`); never touches `dev.db`. See [test-strategy.md](./test-strategy.md) and [test-results.md](./test-results.md).

## Future work (Stretch)

Explicitly **out of scope** for this Core submission:

- Authentication / RBAC / protected routes
- User CRUD and role management
- Priority/assignee filters, sorting, pagination
- OpenAPI / Swagger
- Docker and CI workflows
- Extra unit/component/edge-case test tiers beyond state-machine integration

## Assessment artifacts

Lifecycle docs live at the repo root (and under `ai-prompts/`, `tool-specific/`). Detailed analysis during planning is also under [`docs/`](./docs/).
