import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import request from 'supertest';
import { prisma } from '../src/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirname, '..');
const testDbPath = path.resolve(backendRoot, 'database/test.db');
const testDbJournalPath = `${testDbPath}-journal`;

export const TEST_DATABASE_URL = 'file:../database/test.db';

/**
 * Delete the SQLite test DB files if present.
 */
export function removeTestDatabase() {
  for (const filePath of [testDbPath, testDbJournalPath]) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

/**
 * Apply migrations to the isolated test database (never `dev.db`).
 */
export function migrateTestDatabase() {
  execSync('npx prisma migrate deploy', {
    cwd: backendRoot,
    env: {
      ...process.env,
      DATABASE_URL: TEST_DATABASE_URL,
    },
    stdio: 'pipe',
  });
}

/**
 * Wipe domain tables so each test starts clean.
 */
export async function resetTestData() {
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();
}

/**
 * Seed a single user for create/transition fixtures.
 * @returns {Promise<{ id: string, name: string, email: string, role: string }>}
 */
export async function seedTestUser() {
  return prisma.user.create({
    data: {
      name: 'Test Agent',
      email: 'test.agent@example.com',
      role: 'AGENT',
    },
  });
}

/**
 * Create a ticket via the API (always OPEN), then optionally force status via Prisma
 * so each transition edge can be tested in isolation.
 *
 * @param {import('express').Express} app
 * @param {string} userId
 * @param {string} status
 */
export async function createTicketInStatus(app, userId, status) {
  const createRes = await request(app)
    .post('/api/tickets')
    .send({
      title: `SM test ${status} ${Date.now()}-${Math.random().toString(16).slice(2)}`,
      description: 'State machine integration fixture',
      priority: 'MEDIUM',
      createdBy: userId,
    });

  if (createRes.status !== 201) {
    throw new Error(
      `Failed to create fixture ticket: ${createRes.status} ${JSON.stringify(createRes.body)}`,
    );
  }

  const ticket = createRes.body.data;

  if (status !== 'OPEN') {
    await prisma.ticket.update({
      where: { id: ticket.id },
      data: { status },
    });
  }

  return { ...ticket, status };
}

/**
 * POST /api/tickets/:id/status
 *
 * @param {import('express').Express} app
 * @param {string} ticketId
 * @param {string} status
 */
export function transitionStatus(app, ticketId, status) {
  return request(app)
    .post(`/api/tickets/${ticketId}/status`)
    .send({ status });
}
