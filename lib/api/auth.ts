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

export interface User {
    id: string;
    name: string;
    email: string;
    image?: string | null;
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
        return response.data;
    },
    register: async (data: RegisterRequest) => {
        const response = await axiosInstance.post<AuthResponse>("/api/auth/sign-up/email", data);
        return response.data;
    },
    me: async () => {
        const response = await axiosInstance.get<AuthResponse>("/api/auth/get-session");
        return response.data;
    },
    logout: async () => {
        await axiosInstance.post("/api/auth/sign-out");
    }
};
