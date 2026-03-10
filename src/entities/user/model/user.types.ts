export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  status?: 'online' | 'offline';
}

export interface Session {
  token: string;
  refreshToken?: string;
  user: User;
}
