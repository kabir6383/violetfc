import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, AuthState } from '../types';
import { api } from '../services/api';

interface AuthContextType extends AuthState {
  login: (identifier: string, pass: string) => Promise<void>;
  register: (data: { name: string; age: number; phone: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('violet_jwt_token') || localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Seed default admin in localStorage fallback if not present
    const existingUsers = localStorage.getItem('violet_users');
    if (!existingUsers) {
      const defaultAdmin = {
        id: 1,
        name: 'Administrator',
        age: 32,
        phone: '9990001111',
        email: 'admin@violet.com',
        password: 'admin',
        role: 'admin',
        is_paid: 1,
      };
      localStorage.setItem('violet_users', JSON.stringify([defaultAdmin]));
    }

    const initAuth = async () => {
      if (token) {
        try {
          // Attempt token auth via API
          const currentUser = await api.getMe();
          setUser(currentUser);
        } catch {
          // Fallback check from localStorage
          const storedUsers: any[] = JSON.parse(localStorage.getItem('violet_users') || '[]');
          const found = storedUsers.find((u) => u.id.toString() === token || `token_${u.id}` === token || token.includes(`token_${u.id}`));
          if (found) {
            const { password, ...clean } = found;
            setUser(clean);
          } else {
            localStorage.removeItem('violet_jwt_token');
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (identifier: string, pass: string) => {
    const res = await api.login(identifier, pass);
    localStorage.setItem('violet_jwt_token', res.token);
    localStorage.setItem('token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const register = async (data: { name: string; age: number; phone: string; email: string; password: string }) => {
    const res = await api.register(data);
    localStorage.setItem('violet_jwt_token', res.token);
    localStorage.setItem('token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('violet_jwt_token');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
