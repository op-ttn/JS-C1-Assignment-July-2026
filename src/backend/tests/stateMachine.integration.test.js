import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import { createApp } from '../src/app.js';
import { prisma } from '../src/db.js';
import {
  createTicketInStatus,
  migrateTestDatabase,
  removeTestDatabase,
  resetTestData,
  seedTestUser,
  transitionStatus,
} from './helpers.js';

const VALID_TRANSITIONS = [
  ['OPEN', 'IN_PROGRESS'],
  ['OPEN', 'CANCELLED'],
  ['IN_PROGRESS', 'RESOLVED'],
  ['IN_PROGRESS', 'CANCELLED'],
  ['RESOLVED', 'CLOSED'],
];

const INVALID_TRANSITIONS = [
  ['OPEN', 'CLOSED'],
  ['OPEN', 'RESOLVED'],
  ['CLOSED', 'OPEN'],
  ['CANCELLED', 'IN_PROGRESS'],
  ['RESOLVED', 'OPEN'],
];

describe('ticket status state machine (integration)', () => {
  /** @type {import('express').Express} */
  let app;
  /** @type {{ id: string }} */
  let user;

  beforeAll(() => {
    removeTestDatabase();
    migrateTestDatabase();
    app = createApp();
  });

  beforeEach(async () => {
    await resetTestData();
    user = await seedTestUser();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    removeTestDatabase();
  });

  describe('valid transitions', () => {
    it.each(VALID_TRANSITIONS)(
      'allows %s → %s',
      async (from, to) => {
        const ticket = await createTicketInStatus(app, user.id, from);
        const res = await transitionStatus(app, ticket.id, to);

        expect(res.status).toBe(200);
        expect(res.body.data.status).toBe(to);
        expect(res.body.data.allowedTransitions).toEqual(
          expect.any(Array),
        );
      },
    );
  });

  describe('invalid transitions', () => {
    it.each(INVALID_TRANSITIONS)(
      'rejects %s → %s with INVALID_TRANSITION',
      async (from, to) => {
        const ticket = await createTicketInStatus(app, user.id, from);
        const res = await transitionStatus(app, ticket.id, to);

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe('INVALID_TRANSITION');
        expect(res.body.error.details).toMatchObject({
          currentStatus: from,
          requestedStatus: to,
        });
        expect(res.body.error.details.allowedTransitions).toEqual(
          expect.any(Array),
        );

        const persisted = await prisma.ticket.findUnique({
          where: { id: ticket.id },
        });
        expect(persisted.status).toBe(from);
      },
    );
  });

  describe('smoke cases', () => {
    it('returns 404 TICKET_NOT_FOUND for unknown ticket', async () => {
      const res = await transitionStatus(app, 'missing-ticket-id', 'IN_PROGRESS');

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('TICKET_NOT_FOUND');
    });

    it('returns 400 VALIDATION_ERROR for invalid status body', async () => {
      const ticket = await createTicketInStatus(app, user.id, 'OPEN');
      const res = await transitionStatus(app, ticket.id, 'NOT_A_STATUS');

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
