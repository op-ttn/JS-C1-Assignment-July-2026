import { useCallback, useEffect, useState } from 'react';
import { getUsers } from '../api/users.js';
import { ACTING_USER_STORAGE_KEY } from '../constants.js';

/**
 * Loads seeded users and persists the selected acting user in localStorage.
 * Write actions (M6) will use this selection; M5 shows it for session context.
 */
export function useActingUser() {
  const [users, setUsers] = useState([]);
  const [actingUserId, setActingUserIdState] = useState(() => {
    try {
      return localStorage.getItem(ACTING_USER_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const body = await getUsers();
      const list = body.data ?? [];
      setUsers(list);

      setActingUserIdState((current) => {
        if (current && list.some((user) => user.id === current)) {
          return current;
        }
        const fallback = list[0]?.id || '';
        try {
          if (fallback) {
            localStorage.setItem(ACTING_USER_STORAGE_KEY, fallback);
          } else {
            localStorage.removeItem(ACTING_USER_STORAGE_KEY);
          }
        } catch {
          // ignore storage failures
        }
        return fallback;
      });
    } catch (err) {
      setUsers([]);
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const setActingUserId = useCallback((userId) => {
    setActingUserIdState(userId);
    try {
      if (userId) {
        localStorage.setItem(ACTING_USER_STORAGE_KEY, userId);
      } else {
        localStorage.removeItem(ACTING_USER_STORAGE_KEY);
      }
    } catch {
      // ignore storage failures
    }
  }, []);

  const actingUser = users.find((user) => user.id === actingUserId) || null;

  return {
    users,
    actingUserId,
    actingUser,
    setActingUserId,
    loading,
    error,
    reload: loadUsers,
  };
}
