# API Endpoints

**Project:** Support Ticket Management System (Core)  
**Base path:** `/api`  
**Format:** JSON request/response

---

## Conventions

### Success responses

Single resource:

```json
{ "data": { ... } }
```

List:

```json
{ "data": [ ... ] }
```

### Error responses

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {}
  }
}
```

### HTTP status codes

| Code | Usage |
| --- | --- |
| `200` | Successful GET, PATCH |
| `201` | Successful POST (create) |
| `400` | Validation error, invalid state transition |
| `404` | Ticket or user not found |
| `500` | Unexpected server error |

---

## Endpoints

### Health check

| | |
| --- | --- |
| **Method** | `GET` |
| **Path** | `/api/health` |
| **Purpose** | Verify API is running |

**Response `200`:**

```json
{ "status": "ok" }
```

---

### List users

| | |
| --- | --- |
| **Method** | `GET` |
| **Path** | `/api/users` |
| **Purpose** | Return seeded users for acting-user and assignee pickers |

**Response `200`:**

```json
{
  "data": [
    {
      "id": "user-id",
      "name": "Alex Morgan",
      "email": "alex.morgan@example.com",
      "role": "ADMIN"
    }
  ]
}
```

---

### List tickets

| | |
| --- | --- |
| **Method** | `GET` |
| **Path** | `/api/tickets` |
| **Purpose** | List tickets with optional search and status filter |

**Query parameters:**

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| `q` | string | No | Keyword search (title + description, case-insensitive) |
| `status` | enum | No | Filter by status (`OPEN`, `IN_PROGRESS`, etc.) |

**Response `200`:**

```json
{
  "data": [
    {
      "id": "ticket-id",
      "title": "Cannot reset password",
      "description": "...",
      "priority": "HIGH",
      "status": "OPEN",
      "assignedTo": "user-id",
      "createdBy": "user-id",
      "createdAt": "2025-07-23T10:00:00.000Z",
      "updatedAt": "2025-07-23T10:00:00.000Z",
      "creator": { "id": "...", "name": "...", "email": "...", "role": "..." },
      "assignee": { "id": "...", "name": "...", "email": "...", "role": "..." }
    }
  ]
}
```

---

### Create ticket

| | |
| --- | --- |
| **Method** | `POST` |
| **Path** | `/api/tickets` |
| **Purpose** | Create a new ticket (status defaults to `OPEN`) |

**Request body:**

```json
{
  "title": "Cannot reset password",
  "description": "User reports password reset email never arrives.",
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
| `createdBy` | Yes | Must reference existing user |
| `assignedTo` | No | Must reference existing user if provided |

**Response `201`:** Ticket object in `data`.

**Errors:**
- `400` — validation failure (`VALIDATION_ERROR`)
- `404` — creator or assignee not found (`USER_NOT_FOUND`)

---

### Get ticket detail

| | |
| --- | --- |
| **Method** | `GET` |
| **Path** | `/api/tickets/:id` |
| **Purpose** | Ticket detail including comments and allowed next statuses |

**Response `200`:**

```json
{
  "data": {
    "id": "ticket-id",
    "title": "...",
    "description": "...",
    "priority": "HIGH",
    "status": "OPEN",
    "assignedTo": "user-id",
    "createdBy": "user-id",
    "createdAt": "...",
    "updatedAt": "...",
    "creator": { ... },
    "assignee": { ... },
    "comments": [
      {
        "id": "comment-id",
        "message": "...",
        "createdBy": "user-id",
        "createdAt": "...",
        "author": { ... }
      }
    ],
    "allowedTransitions": ["IN_PROGRESS", "CANCELLED"]
  }
}
```

**Errors:**
- `404` — ticket not found (`TICKET_NOT_FOUND`)

---

### Update ticket fields

| | |
| --- | --- |
| **Method** | `PATCH` |
| **Path** | `/api/tickets/:id` |
| **Purpose** | Update title, description, priority, or assignee |

**Note:** Status cannot be changed via this endpoint. Use the status transition endpoint instead.

**Request body** (at least one field required):

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "MEDIUM",
  "assignedTo": "user-id"
}
```

`assignedTo` may be `null` to unassign.

**Response `200`:** Updated ticket in `data`.

**Errors:**
- `400` — validation failure or ticket in terminal status (`VALIDATION_ERROR`, `TICKET_TERMINAL`)
- `404` — ticket or assignee not found

---

### Transition ticket status

| | |
| --- | --- |
| **Method** | `POST` |
| **Path** | `/api/tickets/:id/status` |
| **Purpose** | Change status via the enforced state machine |

**Request body:**

```json
{ "status": "IN_PROGRESS" }
```

**Response `200`:** Updated ticket in `data` (includes `allowedTransitions`).

**Errors:**
- `400` — invalid transition (`INVALID_TRANSITION`)

```json
{
  "error": {
    "code": "INVALID_TRANSITION",
    "message": "Cannot transition from OPEN to CLOSED",
    "details": {
      "currentStatus": "OPEN",
      "requestedStatus": "CLOSED",
      "allowedTransitions": ["IN_PROGRESS", "CANCELLED"]
    }
  }
}
```

- `404` — ticket not found

---

### Add comment

| | |
| --- | --- |
| **Method** | `POST` |
| **Path** | `/api/tickets/:id/comments` |
| **Purpose** | Add a comment to a ticket |

**Request body:**

```json
{
  "message": "Investigating the email delivery logs.",
  "createdBy": "user-id"
}
```

**Response `201`:** Comment object in `data`.

**Errors:**
- `400` — validation failure
- `404` — ticket or author not found

---

## Design rationale

| Decision | Reason |
| --- | --- |
| Separate `POST /status` endpoint | Prevents bypassing the state machine via `PATCH` |
| `GET /users` endpoint | Supports acting-user and assignee pickers without auth |
| `allowedTransitions` in detail response | Frontend can render only valid status actions |
| Consistent `error.code` | Enables targeted UI error handling |
