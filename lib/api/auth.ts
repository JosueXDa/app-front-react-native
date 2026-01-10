import { axiosInstance } from "./axios";
import { 
    AuthResponse, 
    LoginRequest, 
    ProfileUpdate, 
    RegisterRequest, 
    User, 
    UserUpdate 
} from "./interface/auth";

export * from "./interface/auth";

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
    },
    updateProfile: async (userId: string, updateData: UserUpdate) => {
        const response = await axiosInstance.patch<User>(`/api/users/${userId}`, updateData);
        return response.data;
    }
};
