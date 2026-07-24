# Cursor workflow — tasks

Implemented sequentially via milestone prompts.

| Task | Milestone | Done |
| --- | --- | --- |
| Scaffold workspaces, health API, Vite shell | M0 | Yes |
| Prisma schema, migrate, seed, setup notes | M1 | Yes |
| Read API (users, list, detail, search/filter) | M2 | Yes |
| Write API + SM enforcement + terminal rules | M3 | Yes |
| SM integration tests | M4 | Yes |
| Frontend read path | M5 | Yes |
| Frontend write path | M6 | Yes |
| README + assessment artifacts + clean verify | M7 | Yes |

## Prompt pattern used

```text
Implement Milestone N only (from docs/implementation-plan.md).
Stop when exit criteria are met.
Do not start Milestone N+1.
Do not add Stretch features.
```
