# PR Description

## Summary

Delivers the Support Ticket Management System **Core**: full-stack ticket CRUD-ish flows with an enforced status state machine, comments, search/filter, SQLite persistence, SM integration tests, and complete assessment lifecycle artifacts.

## Features implemented

- Create, list, detail, update tickets; optional assignee
- Status transitions via dedicated endpoint + pure state machine
- Comments (including on terminal tickets)
- Keyword search (title + description) and status filter
- Seeded users + acting-user picker (no auth)
- Meaningful API and UI error states

## Technical changes

- npm workspaces: `src/backend` (Express + Prisma + Zod + Jest/Supertest), `src/frontend` (React + Vite + React Router 6)
- Pure `stateMachine` module shared by API and tests
- Vite `/api` proxy to port 3001

## Database changes

- Prisma schema: User, Ticket, Comment
- Initial migration + seed (4 users, 3 sample tickets, sample comments)
- Local file DB under `src/backend/database/` (gitignored)

## Testing done

- `npm test` — valid/invalid SM transitions + smoke not-found/validation
- Manual UI walkthrough of Core acceptance criteria
- Clean install smoke path documented in README

## AI usage summary

Cursor used end-to-end for requirements, planning, milestone implementation, tests, debugging (Prisma/Node pins, SQLite search, watch EMFILE), and M7 documentation. Persistent rules and milestone-scoped prompts kept scope to Core. Details: [final-ai-usage-summary.md](./final-ai-usage-summary.md), `ai-prompts/`.

## Screenshots / demo notes

Local demo:

1. `npm run dev` → http://localhost:5173  
2. Pick acting user → create ticket → transition OPEN→IN_PROGRESS → add comment → search/filter  

## Known limitations

- No authentication or authorization
- No pagination; list returns matching tickets
- No OpenAPI / Docker / CI
- Frontend tests not included (Stretch)

## Future improvements (Stretch)

Auth/RBAC, user CRUD, extra filters/sorting/pagination, OpenAPI, Docker/CI, unit/component/edge-case test tiers.
