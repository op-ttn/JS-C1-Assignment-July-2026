/**
 * Pure ticket status state machine (no DB / Express deps).
 * Source of truth for allowed transitions — used by read path now,
 * write path (M3) and integration tests (M4) later.
 */

export const STATUSES = [
  'OPEN',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
  'CANCELLED',
];

export const TERMINAL_STATUSES = ['CLOSED', 'CANCELLED'];

const ALLOWED_TRANSITIONS = {
  OPEN: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['RESOLVED', 'CANCELLED'],
  RESOLVED: ['CLOSED'],
  CLOSED: [],
  CANCELLED: [],
};

/**
 * @param {string} status
 * @returns {string[]}
 */
export function getAllowedTransitions(status) {
  return [...(ALLOWED_TRANSITIONS[status] ?? [])];
}

/**
 * @param {string} from
 * @param {string} to
 * @returns {boolean}
 */
export function canTransition(from, to) {
  return getAllowedTransitions(from).includes(to);
}

/**
 * @param {string} status
 * @returns {boolean}
 */
export function isTerminalStatus(status) {
  return TERMINAL_STATUSES.includes(status);
}
