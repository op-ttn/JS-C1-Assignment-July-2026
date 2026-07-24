import { PrismaClient } from '@prisma/client';

/** Shared Prisma client for the Express app. */
export const prisma = new PrismaClient();
