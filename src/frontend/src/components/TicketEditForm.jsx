import { useEffect, useState } from 'react';
import { updateTicket } from '../api/tickets.js';
import ErrorBanner from './ErrorBanner.jsx';
import SuccessBanner from './SuccessBanner.jsx';
import {
  formatApiError,
  isTerminalStatus,
  PRIORITIES,
} from '../constants.js';

export default function TicketEditForm({ ticket, users, onSaved }) {
  const terminal = isTerminalStatus(ticket.status);
  const [title, setTitle] = useState(ticket.title);
  const [description, setDescription] = useState(ticket.description);
  const [priority, setPriority] = useState(ticket.priority);
  const [assignedTo, setAssignedTo] = useState(ticket.assignedTo || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    setTitle(ticket.title);
    setDescription(ticket.description);
    setPriority(ticket.priority);
    setAssignedTo(ticket.assignedTo || '');
    setError(null);
    setSuccess(null);
    setFieldErrors({});
  }, [ticket]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (terminal) {
      setError({
        title: 'Ticket is closed',
        message: 'This ticket is in a terminal status and cannot be edited.',
        code: 'TICKET_TERMINAL',
        issues: [],
      });
      return;
    }

    const nextErrors = {};
    if (!title.trim()) nextErrors.title = 'Title is required';
    if (!description.trim()) nextErrors.description = 'Description is required';
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      const body = await updateTicket(ticket.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        assignedTo: assignedTo || null,
      });
      setSuccess('Ticket updated.');
      onSaved(body.data);
    } catch (err) {
      setError(formatApiError(err));
      if (err?.code === 'VALIDATION_ERROR' && Array.isArray(err?.details?.issues)) {
        const mapped = {};
        for (const issue of err.details.issues) {
          if (issue.path) mapped[issue.path] = issue.message;
        }
        setFieldErrors(mapped);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="panel">
      <h2>Edit fields</h2>
      {terminal && (
        <p className="muted hint">
          This ticket is {ticket.status.replaceAll('_', ' ')}. Field edits are
          blocked; you can still add comments.
        </p>
      )}

      <ErrorBanner error={error} onDismiss={() => setError(null)} />
      <SuccessBanner message={success} onDismiss={() => setSuccess(null)} />

      <form className="ticket-form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="edit-title">Title</label>
          <input
            id="edit-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={terminal || saving}
          />
          {fieldErrors.title && <p className="field-error">{fieldErrors.title}</p>}
        </div>

        <div className="field">
          <label htmlFor="edit-description">Description</label>
          <textarea
            id="edit-description"
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={terminal || saving}
          />
          {fieldErrors.description && (
            <p className="field-error">{fieldErrors.description}</p>
          )}
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="edit-priority">Priority</label>
            <select
              id="edit-priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              disabled={terminal || saving}
            >
              {PRIORITIES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="edit-assignee">Assignee</label>
            <select
              id="edit-assignee"
              value={assignedTo}
              onChange={(event) => setAssignedTo(event.target.value)}
              disabled={terminal || saving}
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={terminal || saving}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </section>
  );
}
