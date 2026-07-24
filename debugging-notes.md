# Debugging Notes

## Issue 1 — Prisma 7 vs Node 18

### Problem

Installing latest Prisma failed or warned because Prisma 7 requires Node 20+.

### How I investigated

Checked engine requirements and project `engines.node` (`>=18`). Confirmed assessment environment should stay on Node 18.

### How AI helped

Suggested pinning Prisma / `@prisma/client` to **5.22.0**, which supports Node 18.

### What I validated

`npm run db:setup` and Prisma Client generate succeeded on Node 18.

### Final fix

Pinned Prisma 5.22.0 in the backend workspace; documented in README/prompt history.

---

## Issue 2 — Case-sensitive ticket search on SQLite

### Problem

Prisma `contains` on SQLite is case-sensitive; keyword search missed seeded tickets when casing differed.

### How I investigated

Reproduced with `curl` using mixed-case `q`; compared to SQLite default collation behavior.

### How AI helped

Proposed normalizing with raw SQL `lower(title) LIKE` / `lower(description) LIKE` instead of relying on Prisma `contains`.

### What I validated

`GET /api/tickets?q=password` and casing variants returned expected seed tickets.

### Final fix

Read-path list query uses lowercased `LIKE` matching (documented in M2 notes).

---

## Issue 3 — EMFILE with `node --watch`

### Problem

Backend `dev` using `node --watch` hit EMFILE (too many open files) on this machine.

### How I investigated

Failed process logs pointed at the file watcher; health endpoint never stayed up reliably under watch mode.

### How AI helped

Suggested switching backend `dev` script to plain `node` for local stability (restart manually when needed).

### What I validated

`npm run dev:backend` serves `GET /api/health` → `{ "status": "ok" }`.

### Final fix

Backend `dev` script uses plain `node` (no `--watch`).

---

## Issue 4 — React Router 7 vs Node 18

### Problem

Latest `react-router-dom` (v7) expects newer Node.

### How I investigated

Install/runtime constraints vs project Node 18 engine.

### How AI helped

Pinned `react-router-dom@6` for M5 routes.

### What I validated

List/detail/create routes work under Vite on Node 18.

### Final fix

`react-router-dom@6` in the frontend workspace.

---

## Issue 5 — Clean install seed failed without `prisma generate`

### Problem

After deleting `node_modules` and reinstalling, `npm run db:setup` migrated successfully but seed crashed: `@prisma/client did not initialize yet`.

### How I investigated

Clean M7 verification path; compared `db:setup` script to `db:generate`.

### How AI helped

Identified that `db:setup` only ran migrate + seed; generate was a separate step.

### What I validated

Updated `db:setup` to `prisma generate && prisma migrate deploy && prisma db seed`, then re-ran clean install → setup → `npm test` (12 passing).

### Final fix

`src/backend/package.json` `db:setup` includes `prisma generate`; setup notes/README updated.
