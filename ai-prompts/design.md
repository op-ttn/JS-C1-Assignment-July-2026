# AI prompts — design

## 2026-07-23 — Architecture and contracts

**Prompt (summary):** Propose architecture for Core ticket system; define REST contract, entity model, and state-machine placement so UI and tests share one rule source.

**AI response summary:** Express + Prisma + SQLite; React/Vite; pure `stateMachine` module; separate `POST .../status`; `{ data }` / `{ error }` envelopes; `allowedTransitions` on detail.

**Accepted:** Pure SM module; status not on PATCH; Zod validation; seeded users endpoint.

**Changed:** Search implementation later switched to SQL `lower(...) LIKE` after SQLite case-sensitivity discovery.

**Rejected:** Auth middleware “for completeness”; OpenAPI generation in Core.

## Design decisions captured

See root `design-notes.md`, `api-contract.md`, `data-model.md`, `ui-flow.md`, and `docs/proposed-architecture.md`.
