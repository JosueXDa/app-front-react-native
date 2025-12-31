import { axiosInstance } from "./axios";

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

export const authApi = {
    login: async (data: LoginRequest) => {
        const response = await axiosInstance.post<AuthResponse>("/api/auth/sign-in/email", data);
        if (response.data.user) {
            const userResponse = await axiosInstance.get<User>(`/api/users/${response.data.user.id}`);
            return {
                ...response.data,
                user: userResponse.data
            };
        }
        return response.data;
    },
    register: async (data: RegisterRequest) => {
        const response = await axiosInstance.post<AuthResponse>("/api/auth/sign-up/email", data);
        if (response.data.user) {
            const userResponse = await axiosInstance.get<User>(`/api/users/${response.data.user.id}`);
            return {
                ...response.data,
                user: userResponse.data
            };
        }
        return response.data;
    },
    me: async () => {
        const response = await axiosInstance.get<AuthResponse>("/api/auth/get-session");
        if (response.data.user) {
            try {
                const userResponse = await axiosInstance.get<User>(`/api/users/${response.data.user.id}`);
                return {
                    ...response.data,
                    user: userResponse.data
                };
            } catch (error) {
                console.error("Failed to fetch user profile", error);
                return response.data;
            }
        }
        return response.data;
    },
    logout: async () => {
        await axiosInstance.post("/api/auth/sign-out");
    }
};
