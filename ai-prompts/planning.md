# AI prompts — planning

## 2026-07-23 — Initial planning / Milestone 0 framing

**Prompt (summary):** Analyze the assessment brief; produce functional/non-functional requirements, entities, API endpoints, user flows, ambiguities with locked defaults, proposed architecture, and a sequential implementation plan with exit criteria. Core only; Stretch deferred.

**AI response summary:** Created `docs/*` planning set and milestone map M0–M7 with independently runnable exit criteria.

**Accepted:** Locked defaults (user picker, priorities, terminal rules, SQLite); one-milestone protocol.

**Changed:** Tightened approved library list and Node 18 constraints later during implementation.

**Rejected:** Building Stretch features in the first plan pass.

## 2026-07-23 — Milestone 0

**Prompt:** Implement Milestone 0 only (from docs/implementation-plan.md). Stop when exit criteria are met. Do not start Milestone 1.

**Intent:** Scaffold monorepo (workspaces), Express health API, Vite React status page, shared scripts, env template, stub folders.
