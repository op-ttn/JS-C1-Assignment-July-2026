# AI prompts — debugging

## 2026-07-23 — Prisma / Node compatibility

**Prompt (summary):** `db:setup` / Prisma install fails or requires newer Node. Keep Node 18.

**Accepted fix:** Pin `prisma` / `@prisma/client` to 5.22.0.

**Rejected:** Upgrading the whole project to Node 20 solely for Prisma 7.

## 2026-07-23 — Case-insensitive search

**Prompt (summary):** `GET /api/tickets?q=...` misses seed tickets when casing differs. SQLite + Prisma `contains` suspected.

**Accepted fix:** Use lowercased `LIKE` in the list query.

**Rejected:** Storing duplicate lowercase columns unless proven necessary.

## 2026-07-23 — EMFILE with `--watch`

**Prompt (summary):** Backend watch mode hits EMFILE; health check unstable.

**Accepted fix:** Plain `node` for backend `dev` script.

**Rejected:** Ignoring the error and documenting “works on my machine” only.

## 2026-07-23 — React Router major version

**Prompt (summary):** Router install/runtime issues on Node 18.

**Accepted fix:** Pin `react-router-dom@6`.

## 2026-07-23 — Clean install / Prisma client

**Prompt (summary):** After wiping `node_modules`, `db:setup` migrates but seed fails with “Prisma Client did not initialize.”

**Accepted fix:** Run `prisma generate` inside `db:setup` before migrate/seed.

See also [debugging-notes.md](../debugging-notes.md).
