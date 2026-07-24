import { z } from 'zod';
import { STATUSES } from './stateMachine.js';

export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

export const listTicketsQuerySchema = z.object({
  q: z.string().optional(),
  status: z.enum(STATUSES).optional(),
});

export const createTicketSchema = z
  .object({
    title: z.string().trim().min(1, 'title is required'),
    description: z.string().trim().min(1, 'description is required'),
    priority: z.enum(PRIORITIES),
    createdBy: z.string().min(1, 'createdBy is required'),
    assignedTo: z.string().min(1).nullable().optional(),
  })
  .strict();

/** PATCH body — status is rejected via .strict(); at least one field required. */
export const updateTicketSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    description: z.string().trim().min(1).optional(),
    priority: z.enum(PRIORITIES).optional(),
    assignedTo: z.string().min(1).nullable().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

export const transitionStatusSchema = z
  .object({
    status: z.enum(STATUSES),
  })
  .strict();

export const createCommentSchema = z
  .object({
    message: z.string().trim().min(1, 'message is required'),
    createdBy: z.string().min(1, 'createdBy is required'),
  })
  .strict();

/**
 * Map Zod issues into API `details.issues` shape.
 * @param {import('zod').ZodError} error
 */
export function zodErrorDetails(error) {
  return {
    issues: error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    })),
  };
}
