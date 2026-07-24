# Schema / migrations

Prisma is the source of truth for schema and migrations:

- Schema: [`src/backend/prisma/schema.prisma`](../src/backend/prisma/schema.prisma)
- Migrations: [`src/backend/prisma/migrations/`](../src/backend/prisma/migrations/)

Apply with `npm run db:migrate` or `npm run db:setup` from the repo root.

See [setup-notes.md](../setup-notes.md).
