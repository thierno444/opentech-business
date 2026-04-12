import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUserInfo: (data: Partial<User>) => void;
  isLoggedIn: boolean;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger les infos utilisateur depuis localStorage
    const storedUser = localStorage.getItem('opentech_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user:', error);
      }
    }
    setLoading(false);
  }, []);

  const updateUserInfo = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('opentech_user', JSON.stringify(updatedUser));
    }
  };

  const isLoggedIn = !!user;

  return (
    <UserContext.Provider value={{ user, setUser, updateUserInfo, isLoggedIn, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}