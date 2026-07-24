# Non-Functional Requirements

**Project:** Support Ticket Management System (Core)  
**Source:** [JS - AI_Assesment_Project.md](./JS%20-%20AI_Assesment_Project.md)

---

## Architecture

| ID | Requirement |
| --- | --- |
| NFR-01 | The system must include a frontend application, a backend API, and a database. |
| NFR-02 | The frontend and backend communicate over HTTP using JSON. |

---

## Persistence and data

| ID | Requirement |
| --- | --- |
| NFR-03 | A database is mandatory (e.g. SQLite, PostgreSQL, MySQL, MongoDB). |
| NFR-04 | Schema/migration or initialization scripts must be provided. |
| NFR-05 | Seed or sample data must be provided. |
| NFR-06 | An environment variable example file (`.env.example`) must be provided if applicable. |
| NFR-07 | Setup instructions must explain how to run the database locally. |

---

## Validation and error handling

| ID | Requirement |
| --- | --- |
| NFR-08 | Server-side input validation is mandatory; invalid input must be rejected at the backend. |
| NFR-09 | API errors must use a consistent response shape. |
| NFR-10 | The UI must show meaningful error states (not silent failures). |

**Proposed API error shape:**

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {}
  }
}
```

---

## Testing

| ID | Requirement |
| --- | --- |
| NFR-11 | At least one meaningful test tier is required for Core. |
| NFR-12 | **Mandatory:** integration tests that prove state-machine rules — valid transitions succeed, invalid transitions are rejected. |

---

## Security

| ID | Requirement |
| --- | --- |
| NFR-13 | No secrets (API keys, passwords, tokens) may be committed to the repository. |
| NFR-14 | Authentication is optional for Core; if implemented well, it counts as Stretch evidence. |

---

## Operability

| ID | Requirement |
| --- | --- |
| NFR-15 | A README must include setup and run instructions. |
| NFR-16 | The application must be runnable locally from documented steps. |
| NFR-17 | A health-check endpoint is recommended for verifying the API is up. |

---

## Process and assessment artifacts

These are required by the assessment guide for submission completeness (not runtime behavior):

| ID | Requirement |
| --- | --- |
| NFR-18 | Full prompt history grouped under `ai-prompts/`. |
| NFR-19 | Lifecycle artifacts: requirement analysis, design notes, test strategy, reflection, PR description, etc. |
| NFR-20 | Tool-specific folder (e.g. `tool-specific/cursor-workflow/`) for the chosen AI tool. |

---

## Effort and scope discipline

| ID | Requirement |
| --- | --- |
| NFR-21 | Core application is scoped for roughly 8–12 focused hours. |
| NFR-22 | Lifecycle artifacts (prompts, testing notes, reflection) should not be sacrificed for feature expansion. |
| NFR-23 | A clean, well-documented Core alone is a strong result; Stretch is optional. |

---

## Proposed technology defaults

These are recommendations, not assessment mandates:

| Layer | Proposed choice | Rationale |
| --- | --- | --- |
| Frontend | React (Vite) | Matches JS competency stack; fast local dev |
| Backend | Node.js + Express | REST API; familiar full-stack pairing |
| Database | SQLite via Prisma | Zero-ops local setup; migrations and seed support |
| Tests | Jest + Supertest | Integration tests against the HTTP API |
