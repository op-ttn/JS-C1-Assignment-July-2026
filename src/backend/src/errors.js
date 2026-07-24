/**
 * Send a standardized API error response.
 * Shape: { error: { code, message, details? } }
 */
export function sendError(res, status, code, message, details) {
  const error = { code, message };
  if (details !== undefined) {
    error.details = details;
  }
  return res.status(status).json({ error });
}
