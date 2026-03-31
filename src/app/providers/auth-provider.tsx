import { LoginRequest, RegisterRequest } from '@/src/entities/auth';
import { login, logout, me, register } from '@/src/entities/auth/api/auth.api';
import { sessionStorage } from '@/src/entities/session';
import { User } from '@/src/entities/user';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signIn: (data: LoginRequest) => Promise<void>;
  signUp: (data: RegisterRequest) => Promise<void>;
  signOut: (_data?: unknown) => Promise<void>;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        if (Platform.OS === 'web') {
          const { user } = await me();
          setUser(user);
        } else {
          const token = await sessionStorage.getItem('session_token');
          if (token) {
            const { user } = await me();
            setUser(user);
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
        if (Platform.OS !== 'web') {
          await sessionStorage.removeItem('session_token');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (data: LoginRequest) => {
    try {
      const response = await login(data);
      setUser(response.user);
      // Token is handled by axios interceptor
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (data: RegisterRequest) => {
    try {
      const response = await register(data);
      setUser(response.user);
      // Token is handled by axios interceptor
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await logout();
      if (Platform.OS !== 'web') {
        await sessionStorage.removeItem('session_token');
      }
      setUser(null);
    } catch (error) {
      console.error('Sign out failed:', error);
      // Force logout even if api fails
      if (Platform.OS !== 'web') {
        await sessionStorage.removeItem('session_token');
      }
      setUser(null);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, updateUser }}>{children}</AuthContext.Provider>;
}
