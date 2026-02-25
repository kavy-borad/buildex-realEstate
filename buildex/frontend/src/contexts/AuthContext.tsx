import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

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

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        console.error('❌ [Auth] Login failed with status:', response.status);
        try {
          const errorData = await response.json();
          console.error('  Error:', errorData.error || errorData.message);
        } catch (e) {
          console.error('  Could not parse error response');
        }
        return false;
      }

      const data = await response.json();
      console.log('📦 [Auth] Response:', { success: data.success, hasToken: !!data.token, hasAdmin: !!data.admin });

      if (data.success && data.token && data.admin) {
        // New format: token and admin at root level
        setUser(data.admin);
        localStorage.setItem('auth_user', JSON.stringify(data.admin));
        localStorage.setItem('auth_token', data.token);
        console.log('✅ [Auth] Login successful:', data.admin.name);
        return true;
      } else if (data.success && data.data) {
        // Legacy format fallback: nested in data
        const { admin, token } = data.data;
        setUser(admin);
        localStorage.setItem('auth_user', JSON.stringify(admin));
        localStorage.setItem('auth_token', token);
        console.log('✅ [Auth] Login successful (legacy format):', admin.name);
        return true;
      }

      console.error('❌ [Auth] Unexpected response format');
      return false;
    } catch (error) {
      console.error('❌ [Auth] Login error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    console.log('🚪 [Auth] Logout initiated');

    // Call backend logout (fire-and-forget — always clear frontend regardless)
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('✅ [Auth] Backend logout successful');
      } catch (error) {
        console.error('⚠️ [Auth] Backend logout failed (clearing locally anyway):', error);
      }
    }

    // Always clear frontend state
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.setItem('manual_logout', 'true'); // Prevent auto-login after manual logout
    console.log('✅ [Auth] Local session cleared');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
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
