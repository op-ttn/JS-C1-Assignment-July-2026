import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createTicket } from '../api/tickets.js';
import ErrorBanner from '../components/ErrorBanner.jsx';
import { formatApiError, PRIORITIES } from '../constants.js';

export default function CreateTicketPage({ actingUser }) {
  const navigate = useNavigate();
  const { users, actingUserId, loading: usersLoading } = actingUser;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [createdBy, setCreatedBy] = useState(actingUserId || '');
  const [assignedTo, setAssignedTo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (actingUserId) {
      setCreatedBy(actingUserId);
    }
  }, [actingUserId]);

  function validateLocal() {
    const next = {};
    if (!title.trim()) next.title = 'Title is required';
    if (!description.trim()) next.description = 'Description is required';
    if (!priority) next.priority = 'Priority is required';
    if (!createdBy) next.createdBy = 'Creator is required';
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setApiError(null);
    if (!validateLocal()) return;

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        priority,
        createdBy,
      };
      if (assignedTo) {
        payload.assignedTo = assignedTo;
      }

      const body = await createTicket(payload);
      navigate(`/tickets/${body.data.id}`);
    } catch (err) {
      setApiError(formatApiError(err));
      if (err?.code === 'VALIDATION_ERROR' && Array.isArray(err?.details?.issues)) {
        const next = {};
        for (const issue of err.details.issues) {
          if (issue.path) next[issue.path] = issue.message;
        }
        setFieldErrors(next);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page-section">
      <p className="breadcrumb">
        <Link to="/">Tickets</Link>
        <span aria-hidden="true"> / </span>
        <span>New ticket</span>
      </p>

      <div className="page-heading">
        <h1>Create ticket</h1>
        <p className="subtitle">New tickets start in OPEN status.</p>
      </div>

      <ErrorBanner error={apiError} onDismiss={() => setApiError(null)} />

      <form className="ticket-form panel" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="create-title">Title</label>
          <input
            id="create-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={submitting}
            required
          />
          {fieldErrors.title && <p className="field-error">{fieldErrors.title}</p>}
        </div>

        <div className="field">
          <label htmlFor="create-description">Description</label>
          <textarea
            id="create-description"
            rows={5}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={submitting}
            required
          />
          {fieldErrors.description && (
            <p className="field-error">{fieldErrors.description}</p>
          )}
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="create-priority">Priority</label>
            <select
              id="create-priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              disabled={submitting}
            >
              {PRIORITIES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            {fieldErrors.priority && (
              <p className="field-error">{fieldErrors.priority}</p>
            )}
          </div>

          <div className="field">
            <label htmlFor="create-createdBy">Created by</label>
            <select
              id="create-createdBy"
              value={createdBy}
              onChange={(event) => setCreatedBy(event.target.value)}
              disabled={submitting || usersLoading}
            >
              <option value="">Select user…</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
            {fieldErrors.createdBy && (
              <p className="field-error">{fieldErrors.createdBy}</p>
            )}
          </div>

          <div className="field">
            <label htmlFor="create-assignedTo">Assignee (optional)</label>
            <select
              id="create-assignedTo"
              value={assignedTo}
              onChange={(event) => setAssignedTo(event.target.value)}
              disabled={submitting || usersLoading}
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
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create ticket'}
          </button>
          <Link to="/" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
