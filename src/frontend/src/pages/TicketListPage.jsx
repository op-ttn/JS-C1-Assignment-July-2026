import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTickets } from '../api/tickets.js';
import { formatDateTime, TICKET_STATUSES } from '../constants.js';
import StatusBadge from '../components/StatusBadge.jsx';

const SEARCH_DEBOUNCE_MS = 300;

export default function TicketListPage() {
  const [qInput, setQInput] = useState('');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQ(qInput.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [qInput]);

  useEffect(() => {
    let cancelled = false;

    async function loadTickets() {
      setLoading(true);
      setError(null);
      try {
        const body = await getTickets({
          q: q || undefined,
          status: status || undefined,
        });
        if (!cancelled) {
          setTickets(body.data ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setTickets([]);
          setError(err instanceof Error ? err.message : 'Failed to load tickets');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTickets();
    return () => {
      cancelled = true;
    };
  }, [q, status, reloadKey]);

  return (
    <section className="page-section">
      <div className="page-heading list-heading">
        <div>
          <h1>Tickets</h1>
          <p className="subtitle">Browse, search, and filter support tickets.</p>
        </div>
        <Link to="/tickets/new" className="btn btn-primary">
          Create ticket
        </Link>
      </div>

      <form
        className="filters"
        onSubmit={(event) => {
          event.preventDefault();
          setQ(qInput.trim());
        }}
      >
        <div className="field">
          <label htmlFor="ticket-search">Search</label>
          <input
            id="ticket-search"
            type="search"
            placeholder="Title or description"
            value={qInput}
            onChange={(event) => setQInput(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="ticket-status">Status</label>
          <select
            id="ticket-status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">All statuses</option>
            {TICKET_STATUSES.map((value) => (
              <option key={value} value={value}>
                {value.replaceAll('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </form>

      {loading && <p className="state-message">Loading tickets…</p>}

      {!loading && error && (
        <div className="banner banner-error" role="alert">
          <p>Could not load tickets: {error}</p>
          <button type="button" onClick={() => setReloadKey((key) => key + 1)}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && tickets.length === 0 && (
        <p className="state-message empty">No tickets found.</p>
      )}

      {!loading && !error && tickets.length > 0 && (
        <div className="table-wrap">
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assignee</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>
                    <Link to={`/tickets/${ticket.id}`} className="ticket-link">
                      {ticket.title}
                    </Link>
                  </td>
                  <td>{ticket.priority}</td>
                  <td>
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td>{ticket.assignee?.name || 'Unassigned'}</td>
                  <td>{formatDateTime(ticket.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
