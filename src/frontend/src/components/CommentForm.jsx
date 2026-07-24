import { useState } from 'react';
import { createComment } from '../api/tickets.js';
import ErrorBanner from './ErrorBanner.jsx';
import { formatApiError } from '../constants.js';

export default function CommentForm({
  ticketId,
  actingUserId,
  actingUserName,
  onCreated,
}) {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fieldError, setFieldError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setFieldError('');

    if (!message.trim()) {
      setFieldError('Comment message is required');
      return;
    }
    if (!actingUserId) {
      setError({
        title: 'Acting user required',
        message: 'Select an acting user in the header before commenting.',
        code: 'USER_NOT_FOUND',
        issues: [],
      });
      return;
    }

    setSubmitting(true);
    try {
      await createComment(ticketId, {
        message: message.trim(),
        createdBy: actingUserId,
      });
      setMessage('');
      onCreated();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="ticket-form comment-form" onSubmit={handleSubmit} noValidate>
      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      <div className="field">
        <label htmlFor="comment-message">
          Add comment
          {actingUserName ? ` (as ${actingUserName})` : ''}
        </label>
        <textarea
          id="comment-message"
          rows={3}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          disabled={submitting}
          placeholder="Write a comment…"
        />
        {fieldError && <p className="field-error">{fieldError}</p>}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Posting…' : 'Post comment'}
        </button>
      </div>
    </form>
  );
}
