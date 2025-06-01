
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { LOCAL_STORAGE_KEYS } from '../constants';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    }
    setIsLoading(false);

    // Listen for storage changes to sync auth state across tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LOCAL_STORAGE_KEYS.CURRENT_USER) {
        if (event.newValue) {
          try {
            setCurrentUser(JSON.parse(event.newValue));
          } catch (e) {
            console.error("Error parsing user from storage event:", e);
            setCurrentUser(null); // Fallback if new value is corrupted
          }
        } else {
          setCurrentUser(null); // User logged out in another tab
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (username: string) => {
    const user: User = { username };
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      setCurrentUser(user);
    } catch (error) {
      console.error("Failed to save user to localStorage", error);
      // Optionally, inform the user about the issue (e.g., storage full)
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
      setCurrentUser(null);
    } catch (error) {
      console.error("Failed to remove user from localStorage", error);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><p className="text-lg text-cyan-400">Initializing System...</p></div>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
