import { Session } from '@/src/entities/session';
import { User } from '@/src/entities/user';

export interface AuthResponse {
  user: User;
  session: Session;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ProfileUpdate {
  displayName?: string;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  bio?: string | null;
  age?: number | null;
  isOnline?: boolean;
}

export interface UserUpdate {
  email?: string;
  name?: string;
  emailVerified?: boolean;
  profile?: ProfileUpdate;
}
