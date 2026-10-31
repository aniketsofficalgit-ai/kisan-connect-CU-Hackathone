import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { User, UserRole, DemoAccount } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<User>;
  register: (userData: any) => Promise<User>;
  logout: () => void;
  updateUserLocally: (updated: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  demoAccounts: DemoAccount[];
  switchDemoAccount: (role: UserRole) => Promise<void>;
}

const FALLBACK_DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: 'farmer',
    title: 'Farmer (Gurpreet Singh)',
    identifier: '9876543210',
    email: 'farmer@kisanconnect.in',
    password: 'password123',
    description: 'Finds workers, rents machinery, lists crops for sale, checks weather.'
  },
  {
    role: 'worker',
    title: 'Agricultural Worker (Ramesh Kumar)',
    identifier: '9876543211',
    email: 'worker@kisanconnect.in',
    password: 'password123',
    description: 'Sets skills/wage, receives farm work requests, accepts/rejects jobs.'
  },
  {
    role: 'machinery_owner',
    title: 'Machinery Owner (Balwinder Dhillon)',
    identifier: '9876543212',
    email: 'owner@kisanconnect.in',
    password: 'password123',
    description: 'Lists tractors/harvesters, sets rental rates, manages booking requests.'
  },
  {
    role: 'buyer',
    title: 'Produce Buyer (Priya Aggarwal)',
    identifier: '9876543213',
    email: 'buyer@kisanconnect.in',
    password: 'password123',
    description: 'Discovers crops, checks harvest quality, submits purchase inquiries.'
  },
  {
    role: 'admin',
    title: 'Administrator',
    identifier: '9876543214',
    email: 'admin@kisanconnect.in',
    password: 'password123',
    description: 'Platform management, verification reviews, listings moderation, reports.'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [demoAccounts, setDemoAccounts] = useState<DemoAccount[]>(FALLBACK_DEMO_ACCOUNTS);

  // Initialize and check token
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    const fetchDemos = async () => {
      try {
        const res = await api.get('/auth/demo-accounts');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setDemoAccounts(res.data);
        }
      } catch {
        // Fallback already assigned
      }
    };

    initAuth();
    fetchDemos();
  }, []);

  const login = async (identifier: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { identifier, password });
      const { access_token, user: loggedUser } = res.data;
      setToken(access_token);
      setUser(loggedUser);
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      return loggedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', userData);
      const { access_token, user: registeredUser } = res.data;
      setToken(access_token);
      setUser(registeredUser);
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(registeredUser));
      return registeredUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  const updateUserLocally = (updated: Partial<User>) => {
    if (user) {
      const merged = { ...user, ...updated };
      setUser(merged);
      localStorage.setItem('user', JSON.stringify(merged));
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch {
      // Ignored
    }
  };

  const switchDemoAccount = async (role: UserRole) => {
    const target = demoAccounts.find((d) => d.role === role);
    if (!target) return;
    await login(target.identifier, target.password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        updateUserLocally,
        refreshUser,
        demoAccounts,
        switchDemoAccount,
      }}
    >
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
