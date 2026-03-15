import { AuthResponse as RawAuthResponse } from '@/src/shared/api/auth';
import { AuthResponse } from './auth.types';

export const mapAuthResponse = (raw: RawAuthResponse): AuthResponse => raw;
