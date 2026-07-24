# Reflection

## What I built

A runnable Core Support Ticket Management System: React UI + Express API + SQLite/Prisma, with enforced status transitions, comments, search/filter, seeded users, validation/errors, SM integration tests, and a full set of assessment artifacts.

## How I used AI (across the lifecycle)

| Phase | Use |
| --- | --- |
| Requirements | Derive FRs/NFRs and lock ambiguities |
| Planning | Milestone map with exit criteria |
| Design | Architecture, API contract, entities |
| Implementation | One milestone at a time under Cursor rules |
| Testing | Jest/Supertest SM suite |
| Debugging | Version pins, SQLite search, watcher EMFILE |
| Review / docs | Structured review + M7 submission package |

## What AI helped with most

- Turning the assessment brief into concrete docs and a sequential plan
- Scaffolding consistent API/error shapes and wiring the SM module through read/write/tests
- Producing the mandatory integration tests quickly against the app factory

## What AI got wrong

- Defaulting toward newer major versions (Prisma 7, React Router 7) that break Node 18
- Assuming Prisma `contains` is case-insensitive on SQLite
- Suggesting Stretch features when not asked
- Occasional desire to “improve” working code with unrelated refactors

## How I validated AI output

- Milestone exit commands (`curl`, `npm test`, browser flows)
- Project rules and locked defaults as acceptance filters
- Reject Stretch / TS / new libraries unless approved
- Confirm secrets stay out of the repo (gitignore + `.env.example` only)

## What I would improve next

- Add a thin CI job for `npm test` once Stretch time allows
- Capture prompt diffs earlier in each milestone (stronger history)
- Consider a few unit tests for `stateMachine` in isolation (still keep HTTP tests)
- Light accessibility pass on forms and error announcements

## Reusable workflow

1. Lock product defaults in writing.  
2. Encode invariants in Cursor rules.  
3. Implement vertical milestones with exit criteria.  
4. Test the highest-risk domain rules via HTTP integration.  
5. Finish with honest reflection and a clone-from-README check.
