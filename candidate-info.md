# Candidate Information

| Field | Value |
| --- | --- |
| **Name** | Om Prakash |
| **Role** | Developer |
| **Primary technology stack** | JavaScript — React (Vite), Node.js/Express, SQLite/Prisma |
| **Primary AI tool used** | Cursor |
| **Project option selected** | Support Ticket Management System (Backend-heavy / Core) |
| **Assessment start date** | 2026-07-23 |
| **Submission date** | 2026-07-23 |

## Project summary

A local-first Support Ticket Management System implementing mandatory Core: create/list/detail tickets, field updates, enforced status state machine, comments, keyword search + status filter, seeded users (no auth), Zod validation, and Jest/Supertest state-machine integration tests. Stretch features are documented as future work and were not implemented.

## Tools used

| Tool | Use |
| --- | --- |
| Cursor (Agent) | Requirements analysis, planning, implementation, tests, docs |
| Cursor project rules (`.cursor/rules/project.mdc`) | Persistent stack/domain constraints |
| npm workspaces | Monorepo scripts |
| Prisma | Schema, migrations, seed |
| Jest + Supertest | State-machine integration tests |
| Vite proxy | Frontend → backend `/api` in local dev |

## Setup summary

```bash
npm install
cp .env.example .env
npm run db:setup
npm run test
npm run dev
```

- Backend: http://localhost:3001  
- Frontend: http://localhost:5173  
- See [README.md](./README.md) for full instructions.
