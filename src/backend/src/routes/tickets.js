import { Router } from 'express';
import { prisma } from '../db.js';
import { sendError } from '../errors.js';
import {
  canTransition,
  getAllowedTransitions,
  isTerminalStatus,
} from '../stateMachine.js';
import {
  createCommentSchema,
  createTicketSchema,
  listTicketsQuerySchema,
  transitionStatusSchema,
  updateTicketSchema,
  zodErrorDetails,
} from '../validation.js';

const router = Router();

const userPublicSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
};

const ticketListInclude = {
  creator: { select: userPublicSelect },
  assignee: { select: userPublicSelect },
};

const ticketDetailInclude = {
  ...ticketListInclude,
  comments: {
    orderBy: { createdAt: 'asc' },
    include: {
      creator: { select: userPublicSelect },
    },
  },
};

/**
 * Map a Prisma ticket (+ comments) to the API shape.
 * Comments use `author` (API contract) rather than Prisma's `creator` relation name.
 */
function toTicketResponse(ticket, { includeAllowedTransitions = false } = {}) {
  const { comments, ...rest } = ticket;
  const data = { ...rest };

  if (comments) {
    data.comments = comments.map(({ creator, ...comment }) => ({
      ...comment,
      author: creator,
    }));
  }

  if (includeAllowedTransitions) {
    data.allowedTransitions = getAllowedTransitions(ticket.status);
  }

  return data;
}

function toCommentResponse(comment) {
  const { creator, ...rest } = comment;
  return {
    ...rest,
    author: creator,
  };
}

async function userExists(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  return Boolean(user);
}

/**
 * Case-insensitive keyword match on title + description (SQLite `contains` is case-sensitive).
 * Returns matching ticket ids, or null when no keyword filter applies.
 */
async function findTicketIdsByKeyword(q) {
  const keyword = q?.trim();
  if (!keyword) {
    return null;
  }

  const pattern = `%${keyword.toLowerCase()}%`;
  const rows = await prisma.$queryRaw`
    SELECT id FROM Ticket
    WHERE lower(title) LIKE ${pattern}
       OR lower(description) LIKE ${pattern}
  `;

  return rows.map((row) => row.id);
}

/**
 * GET /api/tickets?q=&status=
 * List tickets with optional case-insensitive search and status filter.
 */
router.get('/', async (req, res, next) => {
  try {
    const parsed = listTicketsQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return sendError(
        res,
        400,
        'VALIDATION_ERROR',
        'Invalid query parameters',
        zodErrorDetails(parsed.error),
      );
    }

    const { q, status } = parsed.data;
    const where = {};

    if (status) {
      where.status = status;
    }

    const matchingIds = await findTicketIdsByKeyword(q);
    if (matchingIds !== null) {
      if (matchingIds.length === 0) {
        return res.json({ data: [] });
      }
      where.id = { in: matchingIds };
    }

    const tickets = await prisma.ticket.findMany({
      where,
      include: ticketListInclude,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: tickets.map((t) => toTicketResponse(t)) });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/tickets — create ticket (status defaults to OPEN).
 */
router.post('/', async (req, res, next) => {
  try {
    const parsed = createTicketSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        res,
        400,
        'VALIDATION_ERROR',
        'Invalid request body',
        zodErrorDetails(parsed.error),
      );
    }

    const { title, description, priority, createdBy, assignedTo } = parsed.data;

    if (!(await userExists(createdBy))) {
      return sendError(res, 404, 'USER_NOT_FOUND', 'Creator user not found', {
        field: 'createdBy',
      });
    }

    if (assignedTo != null && !(await userExists(assignedTo))) {
      return sendError(res, 404, 'USER_NOT_FOUND', 'Assignee user not found', {
        field: 'assignedTo',
      });
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority,
        status: 'OPEN',
        createdBy,
        assignedTo: assignedTo ?? null,
      },
      include: ticketListInclude,
    });

    res.status(201).json({
      data: toTicketResponse(ticket, { includeAllowedTransitions: true }),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/tickets/:id/status — enforced state-machine transition.
 */
router.post('/:id/status', async (req, res, next) => {
  try {
    const parsed = transitionStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        res,
        400,
        'VALIDATION_ERROR',
        'Invalid request body',
        zodErrorDetails(parsed.error),
      );
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id },
    });

    if (!ticket) {
      return sendError(res, 404, 'TICKET_NOT_FOUND', 'Ticket not found');
    }

    const requestedStatus = parsed.data.status;
    const allowed = getAllowedTransitions(ticket.status);

    if (!canTransition(ticket.status, requestedStatus)) {
      return sendError(
        res,
        400,
        'INVALID_TRANSITION',
        `Cannot transition from ${ticket.status} to ${requestedStatus}`,
        {
          currentStatus: ticket.status,
          requestedStatus,
          allowedTransitions: allowed,
        },
      );
    }

    const updated = await prisma.ticket.update({
      where: { id: ticket.id },
      data: { status: requestedStatus },
      include: ticketDetailInclude,
    });

    res.json({
      data: toTicketResponse(updated, { includeAllowedTransitions: true }),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/tickets/:id/comments — add comment (allowed on terminal tickets).
 */
router.post('/:id/comments', async (req, res, next) => {
  try {
    const parsed = createCommentSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        res,
        400,
        'VALIDATION_ERROR',
        'Invalid request body',
        zodErrorDetails(parsed.error),
      );
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id },
      select: { id: true },
    });

    if (!ticket) {
      return sendError(res, 404, 'TICKET_NOT_FOUND', 'Ticket not found');
    }

    const { message, createdBy } = parsed.data;

    if (!(await userExists(createdBy))) {
      return sendError(res, 404, 'USER_NOT_FOUND', 'Comment author not found', {
        field: 'createdBy',
      });
    }

    const comment = await prisma.comment.create({
      data: {
        ticketId: ticket.id,
        message,
        createdBy,
      },
      include: {
        creator: { select: userPublicSelect },
      },
    });

    res.status(201).json({ data: toCommentResponse(comment) });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/tickets/:id — update fields only (never status).
 * Blocked when ticket is CLOSED or CANCELLED.
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const parsed = updateTicketSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        res,
        400,
        'VALIDATION_ERROR',
        'Invalid request body',
        zodErrorDetails(parsed.error),
      );
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id },
    });

    if (!ticket) {
      return sendError(res, 404, 'TICKET_NOT_FOUND', 'Ticket not found');
    }

    if (isTerminalStatus(ticket.status)) {
      return sendError(
        res,
        400,
        'TICKET_TERMINAL',
        `Cannot update fields on a ${ticket.status} ticket`,
        { status: ticket.status },
      );
    }

    const { assignedTo, ...rest } = parsed.data;

    if (assignedTo !== undefined && assignedTo !== null) {
      if (!(await userExists(assignedTo))) {
        return sendError(res, 404, 'USER_NOT_FOUND', 'Assignee user not found', {
          field: 'assignedTo',
        });
      }
    }

    const data = { ...rest };
    if (assignedTo !== undefined) {
      data.assignedTo = assignedTo;
    }

    const updated = await prisma.ticket.update({
      where: { id: ticket.id },
      data,
      include: ticketDetailInclude,
    });

    res.json({
      data: toTicketResponse(updated, { includeAllowedTransitions: true }),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/tickets/:id
 * Detail with comments (oldest first) and allowedTransitions.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id },
      include: ticketDetailInclude,
    });

    if (!ticket) {
      return sendError(res, 404, 'TICKET_NOT_FOUND', 'Ticket not found');
    }

    res.json({
      data: toTicketResponse(ticket, { includeAllowedTransitions: true }),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
