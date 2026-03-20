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

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const { data: responseData, error } = await authClient.signIn.email({
    email: data.email,
    password: data.password,
    rememberMe: true,
  });

  if (error) {
    throw new Error(error.message || 'Login failed');
  }

  if (!responseData?.user) {
    throw new Error('No user data returned from login');
  }

  return {
    user: transformBetterAuthUser(responseData.user),
    session: {
      id: responseData.token || '',
      userId: responseData.user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    } as Session,
  };
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const { data: responseData, error } = await authClient.signUp.email({
    email: data.email,
    password: data.password,
    name: data.name,
  });

  if (error) {
    throw new Error(error.message || 'Registration failed');
  }

  if (!responseData?.user) {
    throw new Error('No user data returned from registration');
  }

  return {
    user: transformBetterAuthUser(responseData.user),
    session: {
      id: responseData.token || '',
      userId: responseData.user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    } as Session,
  };
}

export async function me(): Promise<AuthResponse> {
  const { data: responseData, error } = await authClient.getSession();

  if (error || !responseData?.user) {
    throw new Error(error?.message || 'Failed to fetch session');
  }

  return {
    user: transformBetterAuthUser(responseData.user),
    session: responseData.session
      ? transformBetterAuthSession(responseData.session)
      : ({
          id: '',
          userId: responseData.user.id,
          expiresAt: new Date().toISOString(),
        } as Session),
  };
}

export async function logout(): Promise<void> {
  await authClient.signOut();
}

export async function updateProfile(userId: string, updateData: UserUpdate): Promise<User> {
  const response = await axiosInstance.patch<any>(`/api/users/${userId}`, updateData);
  return transformBetterAuthUser(response.data);
}

export type { AuthResponse, LoginRequest, RegisterRequest, UserUpdate };
