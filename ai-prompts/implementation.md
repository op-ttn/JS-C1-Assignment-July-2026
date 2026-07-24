# AI prompts — implementation

## 2026-07-23 — Milestone 0

Scaffolded:

- npm workspaces (`src/backend`, `src/frontend`)
- Express app factory + `GET /api/health` on port 3001
- Vite + React API status page with `/api` proxy to backend
- Root scripts: `dev`, `dev:backend`, `dev:frontend`
- Baseline ESLint for both packages
- `.gitignore`, `.env.example`, project `.npmrc` (public registry), stub folders, draft README

Notes:

- Backend `dev` uses plain `node` (not `node --watch`) after EMFILE on this machine.
- Verified: `GET /api/health` → `{ "status": "ok" }`; Vite proxy and frontend HTTP 200.

## 2026-07-23 — Milestone 1

Database + seed only (no domain API):

- Prisma schema: User, Ticket, Comment (`src/backend/prisma/schema.prisma`)
- Initial migration under `src/backend/prisma/migrations/`
- Idempotent seed: 4 users (upsert by email), 3 tickets (skip by title), sample comments
- Scripts: `db:generate`, `db:migrate`, `db:seed`, `db:setup` (+ `db:env` syncs root `.env` → `src/backend/.env`)
- `database/setup-notes.md`; README updated for M1

Notes:

- Pinned `prisma` / `@prisma/client` to **5.22.0** (Node 18; Prisma 7 requires Node 20+)
- Priority/status stored as strings (SQLite); API Zod validation comes in M2+
- Verified: `npm run db:setup`; re-seed skips existing tickets; health still `ok` after DB setup

## 2026-07-23 — Milestone 2

API read path only (no mutations):

- Shared `sendError` helper (`{ error: { code, message, details? } }`)
- Pure `stateMachine` module (`getAllowedTransitions`, `canTransition`) for detail responses
- Zod validation for `GET /api/tickets` query (`q`, `status`)
- Endpoints: `GET /api/users`, `GET /api/tickets`, `GET /api/tickets/:id`
- Case-insensitive keyword search via SQLite `lower(...) LIKE` (Prisma `contains` is case-sensitive on SQLite)
- Detail includes comments (asc) + `allowedTransitions`; comment authors mapped as `author`

Notes:

- Added approved dependency `zod` to backend workspace
- Verified with curl: list/filter/search (incl. casing), detail, `404 TICKET_NOT_FOUND`, `400 VALIDATION_ERROR` for bad status

## 2026-07-23 — Milestone 3

API write path + state machine enforcement (no automated tests yet):

- Zod write schemas: create ticket, patch fields (`.strict` rejects `status`), status transition, create comment
- Endpoints: `POST /api/tickets`, `PATCH /api/tickets/:id`, `POST /api/tickets/:id/status`, `POST /api/tickets/:id/comments`
- Create defaults to `OPEN`; creator/assignee existence checked (`USER_NOT_FOUND`)
- Status changes only via SM (`canTransition`); invalid → `INVALID_TRANSITION` with allowed list
- Terminal tickets (`CLOSED`/`CANCELLED`): field PATCH blocked (`TICKET_TERMINAL`); comments still allowed

Notes:

- Manual curl matrix: valid edges + invalid (e.g. `OPEN→CLOSED`); create → patch → status → comment; data persists after restart

## 2026-07-23 — Milestone 4

State-machine integration tests only (no frontend):

- Jest (ESM via `--experimental-vm-modules`) + Supertest against `createApp()`
- Isolated test DB: `DATABASE_URL=file:../database/test.db` in `tests/setupEnv.js` (never `dev.db`)
- Suite: all valid edges succeed; listed invalid edges → `400 INVALID_TRANSITION`; smoke for not-found + validation
- Root `npm test`; draft `test-strategy.md`; README updated

Notes:

- Fixture tickets created via API then status forced with Prisma so each edge is tested in isolation
- `beforeAll` migrate deploy on test DB; `beforeEach` wipe + seed user

## 2026-07-23 — Milestone 5

Frontend read path only (no create/edit/status/comment forms):

- Added `react-router-dom@6` (pinned for Node 18; v7 requires Node 20+)
- Routes: `/` list, `/tickets/:id` detail; acting-user picker + `localStorage`
- Client API helpers for `GET /api/users`, `GET /api/tickets`, `GET /api/tickets/:id`
- List: debounced keyword search + status filter; loading / empty / error+retry
- Detail: fields, creator/assignee, comments (asc), status badge, read-only `allowedTransitions`
- `TICKET_NOT_FOUND` → not-found view with link back to list

Notes:

- Write actions deferred to M6; M4 `npm test` must remain green

## 2026-07-23 — Milestone 6

Frontend write path (complete Core UI; no Stretch):

- Route `/tickets/new` create form → redirect to detail
- Detail: edit fields (blocked when terminal), status buttons from `allowedTransitions`, comment form using acting user
- Error banners for `VALIDATION_ERROR`, `TICKET_TERMINAL`, `INVALID_TRANSITION`, `USER_NOT_FOUND`, network errors
- List “Create ticket” CTA; client helpers for POST/PATCH/status/comments

Notes:

- UI only exposes valid status actions; invalid transition messaging still handled if API rejects
- M4 `npm test` must remain green; M7 artifacts deferred

## 2026-07-23 — Milestone 7

Polish, docs, and submission artifacts only (no new Core features / no Stretch):

- Finalized README (prerequisites, install, db, run, test, ports, Stretch list)
- Root assessment artifacts per guide (`candidate-info` through `final-ai-usage-summary`)
- Expanded `ai-prompts/` by activity; filled `tool-specific/cursor-workflow/`
- Confirmed secrets hygiene (`.env` / `*.db` gitignored)
- Clean-setup verification path documented and executed

Notes:

- Stop at M7 exit criteria; do not add auth/OpenAPI/Docker/CI
