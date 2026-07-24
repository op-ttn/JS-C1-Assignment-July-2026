# Acceptance Criteria

Checklist against the assessment Core criteria and this project’s FRs. Marked complete after M0–M6 implementation and M7 verification.

## Core (assessment)

- [x] A user can create a ticket via the UI.
- [x] A user can view all tickets from the database.
- [x] A user can open a ticket detail view.
- [x] A user can update ticket fields and reassign.
- [x] A user can add comments.
- [x] Status changes only through valid transitions; invalid ones are rejected.
- [x] Keyword search and status filter work.
- [x] Data remains available after restart.
- [x] Backend validation prevents invalid records.
- [x] No secrets committed to the repo (`.env` / `*.db` gitignored; `.env.example` only).
- [x] State-machine integration tests pass (`npm test`).

## Validation

- [x] Required fields enforced on create/update/comment (Zod).
- [x] Invalid enum values (priority/status) rejected with `VALIDATION_ERROR`.
- [x] PATCH cannot set `status` (use `POST /api/tickets/:id/status`).
- [x] Creator/assignee must reference existing users.

## Error handling

- [x] Consistent `{ error: { code, message, details? } }` envelope.
- [x] `INVALID_TRANSITION` includes current, requested, and allowed transitions.
- [x] `TICKET_TERMINAL` when editing fields on CLOSED/CANCELLED.
- [x] UI shows banners / not-found for API failures (`TICKET_NOT_FOUND`, validation, network).

## Testing

- [x] Integration tests for all valid SM edges.
- [x] Integration tests for representative invalid SM edges.
- [x] Isolated test database (not `dev.db`).
- [x] Tests runnable via `npm test` without UI.

## Documentation

- [x] README with prerequisites, install, db setup, run, test, ports.
- [x] Database setup notes + migrations + seed.
- [x] API / data / UI artifacts present.
- [x] Prompt history and reflection present.
- [x] Stretch explicitly listed as future work.

## Stretch (not in Core — unchecked by design)

- [ ] Auth / RBAC
- [ ] User CRUD
- [ ] Pagination / extra filters / OpenAPI / Docker / CI
- [ ] Broad unit/component test suites
