export default function ErrorBanner({ error, onDismiss }) {
  if (!error) return null;

  return (
    <div className="banner banner-error" role="alert">
      {error.title && <strong className="banner-title">{error.title}</strong>}
      <p>{error.message}</p>
      {error.issues?.length > 0 && (
        <ul className="error-issue-list">
          {error.issues.map((issue) => (
            <li key={`${issue.path}-${issue.message}`}>
              {issue.path ? <code>{issue.path}</code> : null}
              {issue.path ? ': ' : ''}
              {issue.message}
            </li>
          ))}
        </ul>
      )}
      {onDismiss && (
        <button type="button" className="link-button" onClick={onDismiss}>
          Dismiss
        </button>
      )}
    </div>
  );
}
