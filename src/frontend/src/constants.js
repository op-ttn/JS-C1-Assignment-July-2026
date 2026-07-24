export const TICKET_STATUSES = [
  'OPEN',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
  'CANCELLED',
];

export const TERMINAL_STATUSES = ['CLOSED', 'CANCELLED'];

export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

export const ACTING_USER_STORAGE_KEY = 'actingUserId';

export function isTerminalStatus(status) {
  return TERMINAL_STATUSES.includes(status);
}

export function formatStatusLabel(status) {
  return String(status || '')
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatDateTime(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return String(value);
  }
}

/**
 * Map API error objects into a UI-friendly message (+ optional field issues).
 * @param {Error & { code?: string, details?: object }} err
 */
export function formatApiError(err) {
  const code = err?.code;
  const details = err?.details;
  const message = err?.message || 'Something went wrong';

  if (code === 'INVALID_TRANSITION') {
    const allowed = details?.allowedTransitions?.map(formatStatusLabel).join(', ');
    const from = formatStatusLabel(details?.currentStatus);
    const to = formatStatusLabel(details?.requestedStatus);
    return {
      title: 'Invalid status transition',
      message: allowed
        ? `Cannot transition from ${from} to ${to}. Allowed: ${allowed}.`
        : message,
      code,
      issues: [],
    };
  }

  if (code === 'TICKET_TERMINAL') {
    return {
      title: 'Ticket is closed',
      message: message || 'This ticket is in a terminal status and cannot be edited.',
      code,
      issues: [],
    };
  }

  if (code === 'VALIDATION_ERROR') {
    const issues = Array.isArray(details?.issues) ? details.issues : [];
    return {
      title: 'Validation failed',
      message: issues.length
        ? issues.map((issue) => `${issue.path || 'field'}: ${issue.message}`).join('; ')
        : message,
      code,
      issues,
    };
  }

  if (code === 'USER_NOT_FOUND') {
    return {
      title: 'User not found',
      message: message || 'Selected user does not exist.',
      code,
      issues: [],
    };
  }

  if (code === 'NETWORK_ERROR') {
    return {
      title: 'Connection error',
      message: 'Could not reach the API. Check that the backend is running.',
      code,
      issues: [],
    };
  }

  return {
    title: code || 'Error',
    message,
    code,
    issues: [],
  };
}
