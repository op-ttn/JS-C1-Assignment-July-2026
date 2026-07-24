# API Contract

**Base path:** `/api`  
**Success:** `{ "data": ... }`  
**Error:** `{ "error": { "code", "message", "details?" } }`

Authoritative detail during build: [docs/api-endpoints.md](./docs/api-endpoints.md). Summary below matches the implemented Core API.

---

## `GET /api/health`

**Purpose:** Liveness check.  
**Response `200`:** `{ "status": "ok" }`

---

## `GET /api/users`

**Purpose:** Seeded users for acting-user / assignee pickers.  
**Response `200`:** `{ "data": [ { id, name, email, role } ] }`

---

## `GET /api/tickets`

**Purpose:** List tickets with optional search and status filter.

| Query | Required | Rules |
| --- | --- | --- |
| `q` | No | Keyword over title + description (case-insensitive) |
| `status` | No | One of `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`, `CANCELLED` |

**Response `200`:** `{ "data": [ ticket… ] }` (includes `creator` / `assignee` when present).  
**Errors:** `400 VALIDATION_ERROR` for invalid `status`.

---

## `GET /api/tickets/:id`

**Purpose:** Detail including comments (oldest first) and `allowedTransitions`.  
**Response `200`:** `{ "data": { …ticket, comments, allowedTransitions } }`  
**Errors:** `404 TICKET_NOT_FOUND`

---

## `POST /api/tickets`

**Purpose:** Create ticket (status defaults to `OPEN`).

### Request

```json
{
  "title": "Cannot reset password",
  "description": "Reset email never arrives.",
  "priority": "HIGH",
  "createdBy": "user-id",
  "assignedTo": "user-id"
}
```

| Field | Required | Validation |
| --- | --- | --- |
| `title` | Yes | Non-empty string |
| `description` | Yes | Non-empty string |
| `priority` | Yes | `LOW` \| `MEDIUM` \| `HIGH` |
| `createdBy` | Yes | Existing user |
| `assignedTo` | No | Existing user if set |

**Response `201`:** created ticket in `data`.  
**Errors:** `400 VALIDATION_ERROR`, `404 USER_NOT_FOUND`

---

## `PATCH /api/tickets/:id`

**Purpose:** Update title, description, priority, and/or assignee. **Does not accept `status`.**

### Request (at least one field)

```json
{
  "title": "Updated",
  "description": "Updated",
  "priority": "MEDIUM",
  "assignedTo": null
}
```

**Response `200`:** updated ticket.  
**Errors:** `400 VALIDATION_ERROR`, `400 TICKET_TERMINAL`, `404 TICKET_NOT_FOUND` / `USER_NOT_FOUND`

---

## `POST /api/tickets/:id/status`

**Purpose:** Enforce state-machine transition.

### Request

```json
{ "status": "IN_PROGRESS" }
```

**Response `200`:** updated ticket including `allowedTransitions`.  
**Errors:** `400 INVALID_TRANSITION` (details include current, requested, allowed), `400 VALIDATION_ERROR`, `404 TICKET_NOT_FOUND`

### Allowed transitions

| From | To |
| --- | --- |
| `OPEN` | `IN_PROGRESS`, `CANCELLED` |
| `IN_PROGRESS` | `RESOLVED`, `CANCELLED` |
| `RESOLVED` | `CLOSED` |
| `CLOSED` / `CANCELLED` | *(none)* |

---

## `POST /api/tickets/:id/comments`

**Purpose:** Add a comment (allowed even when ticket is terminal).

### Request

```json
{
  "message": "Investigating email logs.",
  "createdBy": "user-id"
}
```

**Response `201`:** comment in `data`.  
**Errors:** `400 VALIDATION_ERROR`, `404 TICKET_NOT_FOUND` / `USER_NOT_FOUND`
