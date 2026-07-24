import { useState } from 'react';
import { transitionTicketStatus } from '../api/tickets.js';
import ErrorBanner from './ErrorBanner.jsx';
import SuccessBanner from './SuccessBanner.jsx';
import { formatApiError, formatStatusLabel } from '../constants.js';

export default function StatusActions({ ticket, onTransitioned }) {
  const transitions = ticket.allowedTransitions ?? [];
  const [pendingStatus, setPendingStatus] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function handleTransition(nextStatus) {
    setError(null);
    setSuccess(null);
    setPendingStatus(nextStatus);
    try {
      const body = await transitionTicketStatus(ticket.id, nextStatus);
      setSuccess(`Status changed to ${formatStatusLabel(body.data.status)}.`);
      onTransitioned(body.data);
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setPendingStatus(null);
    }
  }

  return (
    <section className="panel">
      <h2>Change status</h2>
      <p className="muted hint">
        Only valid next statuses from the state machine are shown.
      </p>

      <ErrorBanner error={error} onDismiss={() => setError(null)} />
      <SuccessBanner message={success} onDismiss={() => setSuccess(null)} />

      {transitions.length === 0 ? (
        <p className="state-message empty">
          No transitions available (terminal status).
        </p>
      ) : (
        <div className="status-actions">
          {transitions.map((nextStatus) => (
            <button
              key={nextStatus}
              type="button"
              className="btn btn-secondary"
              disabled={Boolean(pendingStatus)}
              onClick={() => handleTransition(nextStatus)}
            >
              {pendingStatus === nextStatus
                ? 'Updating…'
                : `Move to ${formatStatusLabel(nextStatus)}`}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
