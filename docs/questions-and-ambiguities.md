# Questions and Ambiguities

**Project:** Support Ticket Management System (Core)  
**Source:** [JS - AI_Assesment_Project.md](./JS%20-%20AI_Assesment_Project.md)

Items below were gaps in the assessment brief. **All defaults below are LOCKED for Core implementation** — do not re-open during milestone builds unless the product owner explicitly overrides.

---

## Questions (locked)

| # | Question | Locked decision | Impact |
| --- | --- | --- | --- |
| Q1 | Which project option? | **Support Ticket Management System** | Scope |
| Q2 | How is `createdBy` determined without auth? | **User picker** of seeded users + `localStorage` | UI / API payloads |
| Q3 | Priority values? | **`LOW`, `MEDIUM`, `HIGH`** | Validation / UI |
| Q4 | Keyword search scope? | **Title + description**, case-insensitive behavior | Search |
| Q5 | Assignee required on create? | **Optional**; `null` = unassigned | Create form |
| Q6 | Comment edit/delete? | **Create + list only** | API / UI |
| Q7 | Terminal ticket edits/comments? | **Comments yes; field edits no** | PATCH / UI |
| Q8 | Stretch in v1? | **Defer** | Effort |
| Q9 | Database? | **SQLite** | Local setup |

---

## Locked defaults (for implementation)

Do not change these during M0–M7 unless explicitly requested.

### Scope

- **Project:** Support Ticket Management System, Core only.
- **Stretch:** Deferred unless time permits after lifecycle artifacts are complete.

### Acting user without auth

- Seeded users loaded via `GET /api/users`.
- UI provides a user picker (header or form-level).
- Selected user ID stored in `localStorage` as the acting user.
- Used as `createdBy` for ticket creation and comments.

### Enums

| Enum | Values |
| --- | --- |
| Priority | `LOW`, `MEDIUM`, `HIGH` |
| Status | `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`, `CANCELLED` |
| Role (seed) | `AGENT`, `ADMIN` |

### Terminal ticket behavior

| Action | Allowed on `CLOSED` / `CANCELLED`? |
| --- | --- |
| View detail | Yes |
| Add comment | Yes |
| Edit fields (title, description, priority, assignee) | No |
| Change status | No (already terminal) |

### Search

- Query param: `?q=keyword`
- Searches `title` and `description`
- Case-insensitive (SQLite: `LIKE` or `contains` with Prisma)

### Comments

- No edit or delete in Core.
- Chronological display (oldest first).

---

## Edge cases to handle

| Case | Expected behavior |
| --- | --- |
| Create ticket with non-existent `createdBy` | `404 USER_NOT_FOUND` |
| Assign to non-existent user | `404 USER_NOT_FOUND` |
| Transition from terminal status | `400 INVALID_TRANSITION` |
| Skip status (e.g. `OPEN → RESOLVED`) | `400 INVALID_TRANSITION` |
| Update fields on `CLOSED` ticket | `400 TICKET_TERMINAL` |
| Empty title or description on create | `400 VALIDATION_ERROR` |
| Comment with empty message | `400 VALIDATION_ERROR` |
| Get non-existent ticket | `404 TICKET_NOT_FOUND` |
| Search with no matches | `200` with empty `data` array |

---

## Items not requiring PO input

These are implementation details with a clear best practice:

- Use a separate `POST /status` endpoint (not `PATCH`) to enforce the state machine.
- State machine logic in a pure, testable module shared by API and integration tests.
- Consistent API error shape with `code`, `message`, and optional `details`.
- Include `allowedTransitions` in ticket detail response for frontend rendering.
