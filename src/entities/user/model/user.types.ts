export interface UserProfile {
  displayName?: string;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  bio?: string | null;
  age?: number | null;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  profile?: UserProfile;
  status?: 'online' | 'offline';
}
