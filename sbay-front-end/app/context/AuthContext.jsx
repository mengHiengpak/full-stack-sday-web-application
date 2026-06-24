'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '@/app/lib/api';
import { disconnectSocket } from '@/app/lib/socket';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('sbay_token');
    if (!token) {
      setLoading(false);
      return;
    }
    const demoUser = localStorage.getItem('sbay_demo_user');
    if (demoUser) {
      setUser(JSON.parse(demoUser));
      setLoading(false);
      return;
    }
    try {
      const res = await authAPI.me();
      setUser(res.data.data);
    } catch {
      localStorage.removeItem('sbay_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token, data } = res.data;
    localStorage.setItem('sbay_token', token);
    setUser(data);
    return data;
  };

  const register = async (username, email, password) => {
    const res = await authAPI.register({ username, email, password });
    const { token, data } = res.data;
    localStorage.setItem('sbay_token', token);
    setUser(data);
    return data;
  };

  const logout = () => {
    disconnectSocket();
    localStorage.removeItem('sbay_token');
    localStorage.removeItem('sbay_demo_user');
    setUser(null);
  };

  const updateUser = (updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : prev);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { AuthContext };
