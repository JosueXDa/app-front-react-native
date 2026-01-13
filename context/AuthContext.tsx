import { authApi, LoginRequest, RegisterRequest, User } from '@/lib/api';
import { storage } from '@/lib/storage';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { AuthContextType } from './interface/AuthContext';


const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                if (Platform.OS === 'web') {
                    const { user } = await authApi.me();
                    setUser(user);
                } else {
                    const token = await storage.getItem('session_token');
                    if (token) {
                        const { user } = await authApi.me();
                        setUser(user);
                    }
                }
            } catch (error) {
                console.error('Session check failed:', error);
                if (Platform.OS !== 'web') {
                    await storage.removeItem('session_token');
                }
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();
    }, []);

    const signIn = async (data: LoginRequest) => {
        try {
            const response = await authApi.login(data);
            setUser(response.user);
            // Token is handled by axios interceptor
        } catch (error) {
            throw error;
        }
    };

    const signUp = async (data: RegisterRequest) => {
        try {
            const response = await authApi.register(data);
            setUser(response.user);
            // Token is handled by axios interceptor
        } catch (error) {
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await authApi.logout();
            if (Platform.OS !== 'web') {
                await storage.removeItem('session_token');
            }
            setUser(null);
        } catch (error) {
            console.error('Sign out failed:', error);
            // Force logout even if api fails
            if (Platform.OS !== 'web') {
                await storage.removeItem('session_token');
            }
            setUser(null);
        }
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}
