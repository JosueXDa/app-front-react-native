export interface UseProfileSettingsReturn {
  displayName: string;
  email: string;
  avatarUrl?: string | null;
  isDark: boolean;
  canOpenProfile: boolean;
  openProfile: () => void;
  toggleThemeMode: () => Promise<void>;
  logout: () => Promise<void>;
}
