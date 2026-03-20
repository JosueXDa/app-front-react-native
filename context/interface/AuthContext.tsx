import { LoginRequest, RegisterRequest } from '@/src/entities/auth';
import { User } from '@/src/entities/user';

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    signIn: (data: LoginRequest) => Promise<void>;
    signUp: (data: RegisterRequest) => Promise<void>;
    signOut: (data?: any) => Promise<void>;
    updateUser: (updatedUser: User) => void;
}
