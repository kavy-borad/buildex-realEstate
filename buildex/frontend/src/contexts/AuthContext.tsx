import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { AUTO_LOGIN_CONFIG } from '@/config/autoLogin';
import { API_BASE_URL } from '@/services/api/core';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setSession: (user: User, token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 [Auth] Login attempt:', email);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        console.error('❌ [Auth] Login failed with status:', response.status);
        return false;
      }

      const data = await response.json();

      if (data.success && data.token && data.admin) {
        const u: User = { id: data.admin._id || data.admin.id, name: data.admin.name, email: data.admin.email, role: data.admin.role };
        setUser(u);
        localStorage.setItem('auth_user', JSON.stringify(u));
        localStorage.setItem('auth_token', data.token);
        console.log('✅ [Auth] Login successful:', u.name);
        return true;
      } else if (data.success && data.data) {
        const { admin, token } = data.data;
        const u: User = { id: admin._id || admin.id, name: admin.name, email: admin.email, role: admin.role };
        setUser(u);
        localStorage.setItem('auth_user', JSON.stringify(u));
        localStorage.setItem('auth_token', token);
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ [Auth] Login error:', error);
      return false;
    }
  }, []);

  // Fetch fresh user data from backend (fixes stale localStorage cache)
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const data = await res.json();
      const raw = data.admin || data.data || null;
      if (raw?.email) {
        const freshUser: User = { id: raw._id || raw.id, name: raw.name, email: raw.email, role: raw.role };
        setUser(freshUser);
        localStorage.setItem('auth_user', JSON.stringify(freshUser));
      }
    } catch { /* silently ignore */ }
  }, []);

  // On mount: if already has token → refresh; else → auto-login
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('auth_token');
      const manualLogout = localStorage.getItem('manual_logout');

      if (token) {
        // Already logged in — just refresh from DB
        await refreshUser();
      } else if (AUTO_LOGIN_CONFIG.enabled && !manualLogout) {
        // No session — try auto-login
        console.log('🤖 [Auth] Attempting auto-login...');
        await login(AUTO_LOGIN_CONFIG.credentials.email, AUTO_LOGIN_CONFIG.credentials.password);
      }
    };
    init();
  }, []);

  const setSession = useCallback((u: User, token: string) => {
    setUser(u);
    localStorage.setItem('auth_user', JSON.stringify(u));
    localStorage.setItem('auth_token', token);
    localStorage.removeItem('manual_logout');
  }, []);

  const logout = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        });
      } catch { /* ignore */ }
    }
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.setItem('manual_logout', 'true');
    console.log('✅ [Auth] Session cleared');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, refreshUser, setSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
