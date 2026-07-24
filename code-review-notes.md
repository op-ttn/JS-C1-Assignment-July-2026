# Code Review Notes

## AI-assisted review summary

Reviewed Core backend and frontend against project rules and the API contract, focusing on:

- Status changes only via `POST /api/tickets/:id/status` and `stateMachine.canTransition`
- PATCH never accepting `status`
- Terminal tickets: field edits blocked; comments allowed
- Error envelope consistency (`code`, `message`, `details`)
- Test isolation from `dev.db`
- No secrets in source

## My review observations

| Area | Observation |
| --- | --- |
| State machine | Pure module is clear and reused by detail responses + write path + tests |
| Validation | Zod at the boundary is consistent; good use of `.strict` on PATCH |
| Frontend | Status buttons derived from `allowedTransitions` reduces illegal requests |
| Search | Explicit case-insensitive SQL was the right fix for SQLite |
| Scope | Stretch correctly deferred; artifacts completed in M7 |

## Changes made after review

See [review-fixes.md](./review-fixes.md). Mostly documentation completeness, acceptance checklist, and confirmation that gitignore covers `.env` / `*.db`. No intentional SM rule changes after M4 freeze.

## Suggestions rejected (and why)

| Suggestion | Why rejected |
| --- | --- |
| Add JWT auth “while we’re here” | Stretch; assessment focuses on lifecycle artifacts |
| Switch to TypeScript | Locked to JavaScript ESM for Core |
| Add OpenAPI / Docker / CI | Stretch; would delay M7 artifacts |
| Broad React Testing Library suite | Stretch; SM integration is the mandatory tier |
| Broad refactors of working UI | Prefer smallest change; Core already meets FRs |
