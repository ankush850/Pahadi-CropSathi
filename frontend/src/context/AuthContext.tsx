import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  uid: string;
  displayName: string;
  email: string;
  role: 'farmer' | 'supervisor';
  location: string;
  phoneNumber?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, role: 'farmer' | 'supervisor') => Promise<void>;
  signup: (name: string, email: string, role: 'farmer' | 'supervisor', location: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check local storage for mock user session
    const savedUser = localStorage.getItem('pcs_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, role: 'farmer' | 'supervisor') => {
    setLoading(true);
    // Mock network call
    await new Promise((resolve) => setTimeout(resolve, 800));
    const mockUser: User = {
      uid: 'user_' + Math.random().toString(36).substr(2, 9),
      displayName: role === 'farmer' ? 'Kundan Singh' : 'Aditi Joshi',
      email,
      role,
      location: role === 'farmer' ? 'Ranikhet, Almora' : 'Dehradun HQ',
      phoneNumber: role === 'farmer' ? '+91 9876543210' : '+91 8765432109'
    };
    setUser(mockUser);
    localStorage.setItem('pcs_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const signup = async (name: string, email: string, role: 'farmer' | 'supervisor', location: string, phone: string) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newUser: User = {
      uid: 'user_' + Math.random().toString(36).substr(2, 9),
      displayName: name,
      email,
      role,
      location,
      phoneNumber: phone
    };
    setUser(newUser);
    localStorage.setItem('pcs_user', JSON.stringify(newUser));
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setUser(null);
    localStorage.removeItem('pcs_user');
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
