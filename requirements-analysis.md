# Requirement Analysis

## Selected project option

**Support Ticket Management System** — mandatory Core. Stretch deferred.

Detailed breakdown also lives under [`docs/`](./docs/) (`functional-requirements.md`, `non-functional-requirements.md`, `questions-and-ambiguities.md`).

## My understanding (in my own words)

Internal support staff need a small app to create tickets, track them through a fixed lifecycle, comment, and find tickets by keyword or status. There is **no login** in Core: seeded users are selected in the UI. The hard part is not CRUD — it is **enforcing status transitions** on the backend and reflecting failures clearly in the UI. Data must survive restarts via a real database with migrations and seed.

## Functional requirements

| ID | Summary |
| --- | --- |
| FR-01 | Create ticket (title, description, priority, creator, optional assignee) |
| FR-02 | List tickets from DB |
| FR-03 | Ticket detail + comments |
| FR-04 | Update title, description, priority, assignee |
| FR-05–07 | Status only via state machine; reject invalid; surface in UI |
| FR-08–09 | Add comments; show chronologically |
| FR-10–11 | Keyword search (title+description); filter by status |
| FR-12–14 | Seeded users; no user CRUD UI; acting-user picker |
| FR-15–16 | Backend validation; meaningful UI errors |
| FR-17–18 | Persistence + migrations/seed |

Full table: [docs/functional-requirements.md](./docs/functional-requirements.md).

## Non-functional requirements

- Local setup from README without external managed DB services.
- Modular backend (routes, validation, pure SM).
- Consistent JSON error envelope `{ error: { code, message, details? } }`.
- No secrets in the repository.
- Mandatory meaningful test tier: state-machine integration tests.

See [docs/non-functional-requirements.md](./docs/non-functional-requirements.md).

## Assumptions (locked)

| Topic | Decision |
| --- | --- |
| Acting user | Seeded-user picker + `localStorage` |
| Priority | `LOW` \| `MEDIUM` \| `HIGH` |
| Search | Title + description, case-insensitive |
| Assignee on create | Optional |
| Terminal tickets | Comments yes; field edits no |
| Database | SQLite via Prisma |
| Routing | `/`, `/tickets/new`, `/tickets/:id` |

Source: [docs/questions-and-ambiguities.md](./docs/questions-and-ambiguities.md).

## Clarifications (questions for a product owner)

These were resolved with locked defaults before coding; listed for transparency:

1. How is `createdBy` set without auth? → User picker.  
2. Exact priority values? → LOW/MEDIUM/HIGH.  
3. Can terminal tickets be edited? → Fields no; comments yes.  
4. Stretch in v1? → No.

## Edge cases

| Case | Behavior |
| --- | --- |
| Invalid status jump (e.g. OPEN→CLOSED) | `400 INVALID_TRANSITION` |
| PATCH fields on CLOSED/CANCELLED | `400 TICKET_TERMINAL` |
| Unknown ticket id | `404 TICKET_NOT_FOUND` |
| Bad/missing body fields | `400 VALIDATION_ERROR` |
| Non-existent creator/assignee | `404 USER_NOT_FOUND` |
| Status via PATCH | Rejected (schema `.strict` / no status field) |
