import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

/**
 * GET /api/users — seeded users for acting-user / assignee pickers.
 */
router.get('/', async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    res.json({ data: users });
  } catch (err) {
    next(err);
  }
});

export default router;
