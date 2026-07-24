/**
 * Runs before test modules load so Prisma picks up the isolated test DB.
 * Never point this at `dev.db`.
 */
process.env.DATABASE_URL = 'file:../database/test.db';
process.env.NODE_ENV = 'test';
