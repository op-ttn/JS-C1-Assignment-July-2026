import { Link } from 'react-router-dom';
import ActingUserPicker from './ActingUserPicker.jsx';

export default function Layout({ actingUser, children }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <Link to="/" className="brand-link">
            Support Ticket System
          </Link>
          <span className="milestone-tag">Milestone 6 — write path</span>
        </div>
        <ActingUserPicker
          users={actingUser.users}
          actingUserId={actingUser.actingUserId}
          onChange={actingUser.setActingUserId}
          loading={actingUser.loading}
          error={actingUser.error}
          onRetry={actingUser.reload}
        />
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}
