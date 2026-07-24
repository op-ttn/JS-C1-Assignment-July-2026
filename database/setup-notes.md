# Database setup notes

SQLite via Prisma for the Support Ticket Management System (Core).

## Location

| Item | Path |
| --- | --- |
| Prisma schema | `src/backend/prisma/schema.prisma` |
| Migrations | `src/backend/prisma/migrations/` |
| Seed script | `src/backend/prisma/seed.js` |
| Local DB file | `src/backend/database/dev.db` (gitignored) |

`DATABASE_URL` is relative to the Prisma schema directory:

```env
DATABASE_URL="file:../database/dev.db"
```

## First-time setup

From the repo root:

```bash
cp .env.example .env
npm install
npm run db:setup
```

`db:setup` syncs `.env` into `src/backend/.env` (Prisma loads env from the backend package), runs `prisma generate`, applies migrations, and runs the seed.

## Scripts

| Script | Description |
| --- | --- |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Apply pending migrations (`prisma migrate deploy`) |
| `npm run db:seed` | Run seed (idempotent enough for local use) |
| `npm run db:setup` | Generate client + migrate + seed |

Backend-only equivalents: `npm run db:* -w src/backend` (expects `src/backend/.env`).

## Seed data

- **4 users** (mix of `AGENT` / `ADMIN`), upserted by email
- **3 tickets** in varied statuses (`OPEN`, `IN_PROGRESS`, `RESOLVED`); skipped if a ticket with the same title already exists
- Sample comments on some tickets

Re-running `npm run db:seed` does not duplicate sample tickets.

## Inspect data

```bash
npx prisma studio --schema src/backend/prisma/schema.prisma
# or
sqlite3 src/backend/database/dev.db "SELECT id, name, email, role FROM User;"
sqlite3 src/backend/database/dev.db "SELECT title, status, priority FROM Ticket;"
```

## Reset (local only)

```bash
rm -f src/backend/database/dev.db src/backend/database/dev.db-journal
npm run db:setup
```

Do not commit `.env` or `*.db` files.
