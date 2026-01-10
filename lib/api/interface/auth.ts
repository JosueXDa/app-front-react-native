export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface Profile {
    id: string;
    userId: string;
    displayName?: string;
    avatarUrl?: string | null;
    bannerUrl?: string | null;
    bio?: string | null;
    age?: number | null;
    isOnline?: boolean;
    lastSeen?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    profile?: Profile;
}

export interface Session {
    id: string;
    userId: string;
    expiresAt: string;
    ipAddress?: string;
    userAgent?: string;
}

export interface AuthResponse {
    user: User;
    session: Session;
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
