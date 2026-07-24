import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users.js';
import ticketsRouter from './routes/tickets.js';
import { sendError } from './errors.js';

/**
 * Express app factory — used by the HTTP server and (later) integration tests.
 */
export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/users', usersRouter);
  app.use('/api/tickets', ticketsRouter);

  app.use((err, _req, res, _next) => {
    console.error(err);
    sendError(res, 500, 'INTERNAL_ERROR', 'Unexpected server error');
  });

  return app;
}
