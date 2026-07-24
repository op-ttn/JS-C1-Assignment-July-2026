import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTicket } from '../api/tickets.js';
import CommentForm from '../components/CommentForm.jsx';
import StatusActions from '../components/StatusActions.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import TicketEditForm from '../components/TicketEditForm.jsx';
import { formatDateTime } from '../constants.js';

export default function TicketDetailPage({ actingUser }) {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadTicket() {
      setLoading(true);
      setError(null);
      setNotFound(false);
      try {
        const body = await getTicket(id);
        if (!cancelled) {
          setTicket(body.data);
        }
      } catch (err) {
        if (!cancelled) {
          setTicket(null);
          if (err?.code === 'TICKET_NOT_FOUND' || err?.status === 404) {
            setNotFound(true);
          } else {
            setError(err instanceof Error ? err.message : 'Failed to load ticket');
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTicket();
    return () => {
      cancelled = true;
    };
  }, [id, reloadKey]);

  function handleTicketUpdated(updated) {
    setTicket(updated);
  }

  function refreshTicket() {
    setReloadKey((key) => key + 1);
  }

  if (loading) {
    return (
      <section className="page-section">
        <p className="state-message">Loading ticket…</p>
      </section>
    );
  }

  if (notFound) {
    return (
      <section className="page-section">
        <div className="banner banner-error" role="alert">
          <h1>Ticket not found</h1>
          <p>No ticket exists with id “{id}”.</p>
          <Link to="/">Back to ticket list</Link>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-section">
        <div className="banner banner-error" role="alert">
          <p>Could not load ticket: {error}</p>
          <button type="button" onClick={refreshTicket}>
            Retry
          </button>
          <Link to="/" className="back-link">
            Back to list
          </Link>
        </div>
      </section>
    );
  }

  if (!ticket) {
    return null;
  }

  return (
    <section className="page-section">
      <p className="breadcrumb">
        <Link to="/">Tickets</Link>
        <span aria-hidden="true"> / </span>
        <span>{ticket.title}</span>
      </p>

      <div className="page-heading detail-heading">
        <div>
          <h1>{ticket.title}</h1>
          <div className="meta-row">
            <StatusBadge status={ticket.status} />
            <span className="priority-pill">{ticket.priority}</span>
          </div>
        </div>
      </div>

      <dl className="detail-grid">
        <div>
          <dt>Creator</dt>
          <dd>{ticket.creator?.name || '—'}</dd>
        </div>
        <div>
          <dt>Assignee</dt>
          <dd>{ticket.assignee?.name || 'Unassigned'}</dd>
        </div>
        <div>
          <dt>Created</dt>
          <dd>{formatDateTime(ticket.createdAt)}</dd>
        </div>
        <div>
          <dt>Updated</dt>
          <dd>{formatDateTime(ticket.updatedAt)}</dd>
        </div>
      </dl>

      <TicketEditForm
        ticket={ticket}
        users={actingUser.users}
        onSaved={handleTicketUpdated}
      />

      <StatusActions ticket={ticket} onTransitioned={handleTicketUpdated} />

      <section className="panel">
        <h2>Comments ({ticket.comments?.length ?? 0})</h2>
        {!ticket.comments?.length && (
          <p className="state-message empty">No comments yet.</p>
        )}
        {ticket.comments?.length > 0 && (
          <ol className="comment-list">
            {ticket.comments.map((comment) => (
              <li key={comment.id} className="comment-item">
                <div className="comment-meta">
                  <strong>{comment.author?.name || 'Unknown'}</strong>
                  <time dateTime={comment.createdAt}>
                    {formatDateTime(comment.createdAt)}
                  </time>
                </div>
                <p>{comment.message}</p>
              </li>
            ))}
          </ol>
        )}

        <CommentForm
          ticketId={ticket.id}
          actingUserId={actingUser.actingUserId}
          actingUserName={actingUser.actingUser?.name}
          onCreated={refreshTicket}
        />
      </section>
    </section>
  );
}
