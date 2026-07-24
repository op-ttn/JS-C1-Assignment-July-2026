# Test Results

## Latest run (Milestone 7 verification)

**Command:** `npm test`  
**Date:** 2026-07-23  
**Environment:** local macOS, Node 18.19.1, isolated `src/backend/database/test.db`

### Result

```
Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
```

All state-machine integration tests passed:

- Valid transitions → HTTP 200
- Invalid transitions → HTTP 400 `INVALID_TRANSITION`
- Smoke: `TICKET_NOT_FOUND`, `VALIDATION_ERROR`

### Suite location

`src/backend/tests/stateMachine.integration.test.js`

### Clean setup notes

After deleting `node_modules` and `*.db`, `npm install` + `npm run db:setup` must generate the Prisma client before seed. `db:setup` now runs `prisma generate && migrate deploy && db seed`.

### Manual Core checks (UI + API)

| Check | Result |
| --- | --- |
| Create / list / detail | Pass (M6) |
| Edit + reassign | Pass (M6) |
| Valid status buttons | Pass (M6) |
| Search + status filter | Pass (M5–M6) |
| Comment on open and terminal | Pass (M6) |
| Data survives restart | Pass (SQLite file) |
