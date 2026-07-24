import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { useActingUser } from './hooks/useActingUser.js';
import CreateTicketPage from './pages/CreateTicketPage.jsx';
import TicketDetailPage from './pages/TicketDetailPage.jsx';
import TicketListPage from './pages/TicketListPage.jsx';

function App() {
  const actingUser = useActingUser();

  return (
    <Layout actingUser={actingUser}>
      <Routes>
        <Route path="/" element={<TicketListPage />} />
        <Route
          path="/tickets/new"
          element={<CreateTicketPage actingUser={actingUser} />}
        />
        <Route
          path="/tickets/:id"
          element={<TicketDetailPage actingUser={actingUser} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
