import { formatStatusLabel } from '../constants.js';

const STATUS_CLASS = {
  OPEN: 'badge-open',
  IN_PROGRESS: 'badge-in-progress',
  RESOLVED: 'badge-resolved',
  CLOSED: 'badge-closed',
  CANCELLED: 'badge-cancelled',
};

export default function StatusBadge({ status }) {
  const className = STATUS_CLASS[status] || 'badge-default';
  return (
    <span className={`status-badge ${className}`}>{formatStatusLabel(status)}</span>
  );
}
