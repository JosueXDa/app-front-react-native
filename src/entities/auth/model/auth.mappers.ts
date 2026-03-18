import { AuthResponse as RawAuthResponse } from '../api/auth.api';
import { AuthResponse } from './auth.types';

export const mapAuthResponse = (raw: RawAuthResponse): AuthResponse => raw;
