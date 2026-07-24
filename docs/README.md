# Support Ticket Management System — Analysis Docs

Requirements and architecture analysis for the **Support Ticket Management System (Core)**, derived from [JS - AI_Assesment_Project.md](./JS%20-%20AI_Assesment_Project.md).

Each document is self-contained and can be reviewed independently.

---

## Documents

| Document | Description |
| --- | --- |
| [functional-requirements.md](./functional-requirements.md) | What the system must do (Core + Stretch out-of-scope list) |
| [non-functional-requirements.md](./non-functional-requirements.md) | Quality, testing, security, operability, and assessment artifact requirements |
| [entities.md](./entities.md) | Data model: User, Ticket, Comment — fields, relationships, enums, business rules |
| [api-endpoints.md](./api-endpoints.md) | REST API contract: endpoints, request/response shapes, error codes |
| [user-flows.md](./user-flows.md) | Step-by-step user journeys with success/error paths |
| [questions-and-ambiguities.md](./questions-and-ambiguities.md) | Open questions, proposed defaults, edge cases |
| [proposed-architecture.md](./proposed-architecture.md) | Stack, repo layout, backend/frontend design, testing, dev workflow |
| [implementation-plan.md](./implementation-plan.md) | Milestone plan + step-by-step protocol; each milestone independently runnable |

---

## Scope

- **Project:** Support Ticket Management System
- **Tier:** Core (mandatory) — Stretch deferred
- **Stack:** React (Vite) + Node.js/Express + SQLite/Prisma (JavaScript)
- **Auth:** None in Core; seeded users with UI picker for acting user
- **Build mode:** One milestone at a time — see [implementation-plan.md](./implementation-plan.md) “Step-by-step implementation protocol”
