import { authClient } from '@/src/shared/api/auth-client';
import { AuthResponse, LoginRequest, RegisterRequest, UserUpdate } from '../model/auth.types';
import { User } from '@/src/entities/user';
import { Session } from '@/src/entities/session';
import { axiosInstance } from '@/src/shared/api/axios';

/**
 * Convierte el usuario de Better Auth al formato de la aplicación
 */
const transformBetterAuthUser = (betterAuthUser: any): User => ({
  id: betterAuthUser.id,
  email: betterAuthUser.email,
  name: betterAuthUser.name || undefined,
  avatarUrl: betterAuthUser.image || undefined,
});

/**
 * Convierte la sesión de Better Auth al formato de la aplicación
 */
const transformBetterAuthSession = (betterAuthSession: any): Session => ({
  id: betterAuthSession.id || '',
  userId: betterAuthSession.userId || '',
  expiresAt: betterAuthSession.expiresAt?.toString() || new Date().toISOString(),
  ipAddress: betterAuthSession.ipAddress,
  userAgent: betterAuthSession.userAgent,
});

export const authApi = {
  login: async (data: LoginRequest) => {
    // Usar authClient.signIn.email según documentación de Better Auth
    const response = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: true,
    });

    if (response.error) {
      throw new Error(response.error.message || 'Login failed');
    }

    // Better Auth retorna: { redirect: boolean, token: string, url?: string, user: {...} }
    if (!response.data?.user) {
      throw new Error('No user data returned from login');
    }

    return {
      user: transformBetterAuthUser(response.data.user),
      session: {
        id: response.data.token || '',
        userId: response.data.user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days default
      } as Session,
    } as AuthResponse;
  },

  register: async (data: RegisterRequest) => {
    // Usar authClient.signUp.email según documentación de Better Auth
    const response = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
    });

    if (response.error) {
      throw new Error(response.error.message || 'Registration failed');
    }

    if (!response.data?.user) {
      throw new Error('No user data returned from registration');
    }

    return {
      user: transformBetterAuthUser(response.data.user),
      session: {
        id: response.data.token || '',
        userId: response.data.user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days default
      } as Session,
    } as AuthResponse;
  },

  me: async () => {
    // Usar authClient.getSession() según documentación de Better Auth
    const response = await authClient.getSession();

    if (response.error || !response.data?.user) {
      throw new Error(response.error?.message || 'Failed to fetch session');
    }

    return {
      user: transformBetterAuthUser(response.data.user),
      session: response.data.session
        ? transformBetterAuthSession(response.data.session)
        : ({
            id: '',
            userId: response.data.user.id,
            expiresAt: new Date().toISOString(),
          } as Session),
    } as AuthResponse;
  },

  logout: async () => {
    // Usar authClient.signOut() según documentación de Better Auth
    await authClient.signOut();
  },

  updateProfile: async (userId: string, updateData: UserUpdate) => {
    // Para actualizar el perfil, usa authClient si Better Auth lo soporta,
    // sino usa axios para el endpoint específico
    const response = await axiosInstance.patch<any>(`/api/users/${userId}`, updateData);
    return transformBetterAuthUser(response.data);
  },
};

export type { AuthResponse, LoginRequest, RegisterRequest, UserUpdate };
