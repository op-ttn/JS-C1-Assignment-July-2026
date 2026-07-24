# Implementation Plan

## Overview

Deliver the Support Ticket Management System **Core** in sequential, independently runnable milestones (M0–M7). Stretch is deferred until Core + lifecycle artifacts are complete.

The detailed plan used during the build is [docs/implementation-plan.md](./docs/implementation-plan.md). This file is the assessment-facing summary.

## Task breakdown

| Area | Tasks |
| --- | --- |
| Skeleton | Workspaces, Express health, Vite app, env template, scripts |
| Data | Prisma schema, migration, seed, setup notes |
| API read | Users, ticket list (search/filter), detail + `allowedTransitions` |
| API write | Create, patch, status transition, comments + Zod |
| Tests | Jest/Supertest SM integration suite |
| UI read | List, search/filter, detail, acting-user picker |
| UI write | Create, edit, status actions, comments, error states |
| Handoff | README, assessment artifacts, prompt history, clean verify |

## Milestones

| ID | Focus | Status |
| --- | --- | --- |
| M0 | Project skeleton | Done |
| M1 | Database and seed | Done |
| M2 | API read path | Done |
| M3 | API write path + state machine | Done |
| M4 | SM integration tests | Done |
| M5 | Frontend read path | Done |
| M6 | Frontend write path | Done |
| M7 | Polish, docs, submission artifacts | Done (this milestone) |

Protocol: one milestone per request; stop at exit criteria; do not start the next.

## AI usage plan

| Phase | AI role |
| --- | --- |
| Analysis | Extract FRs, lock ambiguities |
| Design | Architecture, API, entities, milestone map |
| Implement | Generate/refine code within milestone scope |
| Test | Write SM integration tests; run and fix |
| Debug | Investigate version/search/watch issues |
| Docs | Fill assessment artifacts from real decisions |

## Risks

| Risk | Mitigation |
| --- | --- |
| Scope creep into Stretch | Explicit deferral; Cursor rules |
| SM buried in controllers | Pure `stateMachine.js`; tests hit HTTP |
| Flaky tests sharing `dev.db` | Separate `test.db` via `DATABASE_URL` |
| Artifact rush | Draft docs early; finalize in M7 |

## Mitigation (executed)

- Milestone gates with curl / `npm test` / browser checks.
- Approved dependency list; ask before new libraries.
- Pin Prisma 5 / React Router 6 for Node 18 compatibility.
