import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  role: string;
  is_paid: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize default admin if no users exist
    const existingUsers = localStorage.getItem('violet_users');
    if (!existingUsers) {
      const defaultAdmin = {
        id: 1,
        name: 'Admin',
        age: 30,
        phone: '0000000000',
        email: 'admin@violet.com',
        password: 'admin', // Storing plain text for prototype purposes
        role: 'admin',
        is_paid: 1
      };
      localStorage.setItem('violet_users', JSON.stringify([defaultAdmin]));
    }

    const fetchUser = () => {
      if (token) {
        try {
          // In a real app, we'd verify the token. Here we just find the user by ID stored in the token.
          // For this prototype, the token is just the user ID as a string.
          const users = JSON.parse(localStorage.getItem('violet_users') || '[]');
          const foundUser = users.find((u: any) => u.id.toString() === token);
          
          if (foundUser) {
            // Don't expose password in state
            const { password, ...userWithoutPassword } = foundUser;
            setUser(userWithoutPassword);
          } else {
            logout();
          }
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
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
