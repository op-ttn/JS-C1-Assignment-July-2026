# Cursor rules / instructions

Persistent project instructions live in [`.cursor/rules/project.mdc`](../../.cursor/rules/project.mdc).

## Summary of enforced rules

1. **Core only** — defer Stretch (auth, pagination, OpenAPI, Docker, CI, user CRUD).
2. **One milestone at a time** — stop at exit criteria; smallest change.
3. **JavaScript ESM** — not TypeScript unless explicitly requested.
4. **Stack** — React/Vite frontend, Express backend, SQLite/Prisma, ask before new libraries.
5. **Domain** — SM via pure module + `POST .../status`; never status on PATCH; terminal = no field edits, comments OK.
6. **API shape** — `/api`, `{ data }` / `{ error: { code, message, details? } }`, Zod validation.
7. **Tests** — mandatory SM integration tests; don’t expand to Stretch suites unasked.
8. **Secrets** — never hardcode; `.env.example` only; ignore `.env` and `*.db`.
9. **Artifacts** — keep `ai-prompts/` and assessment docs updated with the work.

## How rules were used

- Agent prompts referenced `docs/implementation-plan.md` milestones.
- Rules prevented scope creep when the model suggested auth or TS.
- Rules kept error codes and SM behavior consistent across M2–M6.
