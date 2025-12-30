import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: 'traveler' | 'admin') => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Load session from localStorage on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedSession = localStorage.getItem('auth_session');
        if (storedSession) {
          const parsedSession = JSON.parse(storedSession);
          
          // Verify token is still valid by fetching user
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/user`, {
            headers: {
              'Authorization': `Bearer ${parsedSession.access_token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            setSession(parsedSession);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('auth_session');
          }
        }
      } catch (error) {
        console.error('Session load error:', error);
        localStorage.removeItem('auth_session');
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: 'traveler' | 'admin') => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: new Error(data.message || 'Sign up failed') };
      }

      // Store session in localStorage
      if (data.session && data.user) {
        localStorage.setItem('auth_session', JSON.stringify(data.session));
        setSession(data.session);
        setUser(data.user);
      }

      return { error: null };
    } catch (error: any) {
      return { error: new Error(error.message || 'Sign up failed') };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: new Error(data.message || 'Sign in failed') };
      }

      // Store session in localStorage
      if (data.session && data.user) {
        localStorage.setItem('auth_session', JSON.stringify(data.session));
        setSession(data.session);
        setUser(data.user);
      }

      return { error: null };
    } catch (error: any) {
      return { error: new Error(error.message || 'Sign in failed') };
    }
  };

  const signOut = async () => {
    try {
      const storedSession = localStorage.getItem('auth_session');
      if (storedSession) {
        const parsedSession = JSON.parse(storedSession);
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/signout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${parsedSession.access_token}`,
          },
        });
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      localStorage.removeItem('auth_session');
      setUser(null);
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
