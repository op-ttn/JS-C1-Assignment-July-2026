# Test Strategy

## Test scope (Core)

Mandatory Core testing is **state-machine integration tests** only. Broad unit/component suites are Stretch and deferred.

| Layer | Tooling | What it proves |
| --- | --- | --- |
| Integration | Jest + Supertest against `createApp()` | `POST /api/tickets/:id/status` enforces the pure `stateMachine` rules |

Tests live under `src/backend/tests/`. Isolated SQLite: `src/backend/database/test.db` via `DATABASE_URL` in `tests/setupEnv.js`. Never reuse `dev.db`.

## Unit tests

Not in Core scope. Domain purity is covered indirectly via HTTP integration against the same `stateMachine` module.

## Component tests

Not in Core scope (Stretch).

## API / integration tests

**Valid edges (HTTP 200):**

- `OPEN` → `IN_PROGRESS`
- `OPEN` → `CANCELLED`
- `IN_PROGRESS` → `RESOLVED`
- `IN_PROGRESS` → `CANCELLED`
- `RESOLVED` → `CLOSED`

**Invalid edges (HTTP 400, `error.code === 'INVALID_TRANSITION'`):**

- `OPEN` → `CLOSED`
- `OPEN` → `RESOLVED`
- `CLOSED` → `OPEN`
- `CANCELLED` → `IN_PROGRESS`
- `RESOLVED` → `OPEN`

**Smoke included:** unknown ticket → `TICKET_NOT_FOUND`; bad status body → `VALIDATION_ERROR`.

## Edge case tests

Representative invalid transitions and validation/not-found smokes are included. Exhaustive API matrix and UI failure suites are Stretch.

## How to run

```bash
npm test
```

No UI or `npm run dev` required. `beforeAll` applies migrations to the test DB; `beforeEach` wipes tables and seeds a fixture user.

## Tests not covered (and why)

| Area | Why deferred |
| --- | --- |
| Frontend component tests | Stretch; Core acceptance proven manually + API tests |
| Full CRUD unit matrix | SM is the mandatory tier; time reserved for artifacts |
| CI pipeline | Stretch |

Results: [test-results.md](./test-results.md).
