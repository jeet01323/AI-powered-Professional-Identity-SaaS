import { createContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Keep state in sync with localStorage.
    const t = localStorage.getItem('token');
    const raw = localStorage.getItem('user');
    setToken(t);
    setUser(raw ? JSON.parse(raw) : null);
    setLoading(false);
  }, []);

  const isAuthenticated = !!token;

  const authValue = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated,
      login: async (email, password) => {
        const data = await api.auth.login({ email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return data;
      },
      register: async ({ name, email, password }) => {
        const data = await api.auth.register({ name, email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return data;
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      },
      updateUser: (newData) => {
        const updated = { ...user, ...newData };
        localStorage.setItem('user', JSON.stringify(updated));
        setUser(updated);
      },
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
}

