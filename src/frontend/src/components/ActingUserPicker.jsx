export default function ActingUserPicker({
  users,
  actingUserId,
  onChange,
  loading,
  error,
  onRetry,
}) {
  return (
    <div className="acting-user-picker">
      <label htmlFor="acting-user">Acting as</label>
      {loading && <span className="muted">Loading users…</span>}
      {error && (
        <span className="inline-error" role="alert">
          {error}{' '}
          <button type="button" className="link-button" onClick={onRetry}>
            Retry
          </button>
        </span>
      )}
      {!loading && !error && (
        <select
          id="acting-user"
          value={actingUserId}
          onChange={(event) => onChange(event.target.value)}
          disabled={users.length === 0}
        >
          {users.length === 0 && <option value="">No users available</option>}
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.role})
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
