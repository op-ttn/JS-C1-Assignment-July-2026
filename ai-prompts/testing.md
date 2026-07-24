# AI prompts — testing

## 2026-07-23 — Milestone 4 (state-machine integration)

**Prompt (summary):** Implement Milestone 4 only — Jest + Supertest against app factory; isolated test DB; cover all valid SM edges and listed invalid edges; optional not-found/validation smoke. Stop at exit criteria.

**AI response summary:** Added Jest ESM config, `setupEnv.js` with `test.db`, suite asserting 200 for valid transitions and `400 INVALID_TRANSITION` for invalid ones.

**Accepted:** Isolated DB; fixture pattern create-via-API then force status with Prisma; root `npm test`.

**Changed:** Minor assertion/message tweaks during green runs.

**Rejected:** Expanding into full unit/component suites (Stretch).

## Verification prompt pattern

**Prompt:** Run `npm test` and report failures only; fix SM tests without touching unrelated UI.

Used again in M5–M7 as a regression gate.
