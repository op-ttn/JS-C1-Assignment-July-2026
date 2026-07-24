export default function SuccessBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="banner banner-success" role="status">
      <p>{message}</p>
      {onDismiss && (
        <button type="button" className="link-button" onClick={onDismiss}>
          Dismiss
        </button>
      )}
    </div>
  );
}
