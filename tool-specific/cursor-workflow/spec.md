# Cursor workflow — spec

## Goal

Deliver a local Core support-ticket app that meets assessment FRs FR-01–FR-18 and Core acceptance criteria, with mandatory state-machine integration tests and full lifecycle artifacts.

## Backend

- `GET /api/health`, `GET /api/users`
- `GET /api/tickets` (`q`, `status`), `GET /api/tickets/:id` (+ comments, `allowedTransitions`)
- `POST /api/tickets`, `PATCH /api/tickets/:id`, `POST /api/tickets/:id/status`, `POST /api/tickets/:id/comments`
- Zod validation; Prisma persistence; pure SM module

## Frontend

- Routes `/`, `/tickets/new`, `/tickets/:id`
- List search/filter; create; detail edit; status actions; comments
- Error banners for validation / terminal / invalid transition / not-found / network

## Data

- User, Ticket, Comment
- Migrations + seed; data survives restart

## Tests

- Jest/Supertest: all valid SM edges succeed; listed invalid edges rejected

## Docs

- README + assessment root artifacts + `ai-prompts/` + this Cursor workflow folder

## Non-goals (Stretch)

Auth, user CRUD, extra filters/pagination, OpenAPI, Docker, CI, broad unit/component suites.
