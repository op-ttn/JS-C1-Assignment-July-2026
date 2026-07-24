# Cursor workflow — project context

## Product

Support Ticket Management System (Core) for the JS AI Capability Exercise.

## Stack

- Language: JavaScript (ES modules)
- Frontend: React + Vite (`src/frontend`), React Router 6
- Backend: Node.js + Express (`src/backend`)
- DB: SQLite via Prisma 5.x
- Validation: Zod
- Tests: Jest + Supertest (SM integration)

## Invariants

- Core only — no auth, pagination, OpenAPI, Docker, CI, user CRUD
- Statuses: `OPEN` | `IN_PROGRESS` | `RESOLVED` | `CLOSED` | `CANCELLED`
- Priorities: `LOW` | `MEDIUM` | `HIGH`
- Status changes only via pure `stateMachine` + `POST /api/tickets/:id/status`
- PATCH must not accept `status`
- Terminal tickets: comments yes; field edits no
- API: `/api`, success `{ data }`, errors `{ error: { code, message, details? } }`
- No secrets in repo — `.env.example` only

## Acting user

Seeded users + UI picker + `localStorage` (no authentication).

## Ports

- API: 3001
- Vite: 5173 (proxies `/api`)
