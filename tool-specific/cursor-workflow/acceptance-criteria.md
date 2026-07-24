# Cursor workflow — acceptance criteria

Mirror of root [acceptance-criteria.md](../../acceptance-criteria.md) for tool-specific traceability.

## Must pass

- [x] Create / list / detail / update / comment via UI
- [x] Status only through valid transitions; invalid rejected
- [x] Keyword search + status filter
- [x] Persistence across restart
- [x] Backend validation rejects invalid input
- [x] No secrets in repo
- [x] `npm test` SM integration suite green
- [x] README enables clone → install → db:setup → test → dev
- [x] Assessment artifacts non-empty
- [x] Stretch listed as future work (not implemented)

## Traceability

| Spec area | Implementation |
| --- | --- |
| State machine | `src/backend/src/stateMachine.js` + status route + tests |
| API contract | `src/backend/src/routes/*`, `api-contract.md` |
| UI flows | `src/frontend/src/pages/*`, `ui-flow.md` |
| Data model | `src/backend/prisma/schema.prisma`, `data-model.md` |
