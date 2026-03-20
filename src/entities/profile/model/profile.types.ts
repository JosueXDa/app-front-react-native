export interface ProfileData {
  displayName?: string | null;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  bio?: string | null;
  age?: number | null;
}

export interface ProfileUser {
  id: string;
  email?: string;
  name?: string | null;
  profile?: ProfileData;
}
