# Functional Requirements

**Project:** Support Ticket Management System (Core)  
**Source:** [JS - AI_Assesment_Project.md](./JS%20-%20AI_Assesment_Project.md)

**Scope:** Mandatory Core features only. Stretch items are listed separately and are out of scope for the initial build.

---

## Ticket lifecycle

| ID | Requirement |
| --- | --- |
| FR-01 | Users can create a ticket with title, description, priority, creator (`createdBy`), and optional assignee (`assignedTo`). |
| FR-02 | Users can list all tickets loaded from the database. |
| FR-03 | Users can open a ticket detail view showing all ticket fields and its comments. |
| FR-04 | Users can update ticket fields: title, description, priority, and assignee. |
| FR-05 | Users can change ticket status only through the enforced state machine (see below). |
| FR-06 | Invalid status transitions must be rejected by the backend. |
| FR-07 | Invalid status transitions must be surfaced clearly in the frontend. |

### Status state machine

| From | Allowed transitions |
| --- | --- |
| `OPEN` | `IN_PROGRESS`, `CANCELLED` |
| `IN_PROGRESS` | `RESOLVED`, `CANCELLED` |
| `RESOLVED` | `CLOSED` |
| `CLOSED` | *(none — terminal)* |
| `CANCELLED` | *(none — terminal)* |

All other transitions are invalid and must be rejected.

---

## Comments

| ID | Requirement |
| --- | --- |
| FR-08 | Users can add a comment to a ticket (`message`, `createdBy`). |
| FR-09 | Comments are displayed on the ticket detail view in chronological order (oldest first). |

---

## Search and filter

| ID | Requirement |
| --- | --- |
| FR-10 | Users can search tickets by keyword (title and description). |
| FR-11 | Users can filter tickets by status. |

---

## Users (seeded only)

| ID | Requirement |
| --- | --- |
| FR-12 | Users exist in the database with `id`, `name`, `email`, and `role`. |
| FR-13 | No user-management UI is required in Core (users are seeded only). |
| FR-14 | The UI must allow selecting a seeded user as the acting user (`createdBy`) and as assignee without full authentication. |

---

## Validation and error handling

| ID | Requirement |
| --- | --- |
| FR-15 | The backend rejects missing or invalid required fields. |
| FR-16 | The frontend displays meaningful error states for validation failures, invalid transitions, not-found resources, and server errors. |

---

## Persistence

| ID | Requirement |
| --- | --- |
| FR-17 | All data persists in a database and survives application restarts. |
| FR-18 | Database setup includes schema/migration scripts and seed data. |

---

## Core acceptance criteria (from assessment)

- [ ] A user can create a ticket via the UI.
- [ ] A user can view all tickets from the database.
- [ ] A user can open a ticket detail view.
- [ ] A user can update ticket fields and reassign.
- [ ] A user can add comments.
- [ ] Status changes only through valid transitions; invalid ones are rejected.
- [ ] Keyword search and status filter work.
- [ ] Data remains available after restart.
- [ ] Backend validation prevents invalid records.
- [ ] State-machine integration tests pass.

---

## Out of scope (Stretch — optional)

These are not required for a strong Core submission:

- Authentication (login/logout, JWT/session, RBAC, protected routes)
- User CRUD and role management
- Filter by priority and assignee; sorting; pagination
- Additional test tiers (unit tests, edge-case/failure tests)
- API documentation (Swagger/OpenAPI)
- Docker setup, CI workflow
- Reusable prompt templates, rules, or specs
- Third entity or richer data model
