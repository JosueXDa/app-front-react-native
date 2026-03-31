import { useAuth } from '@/src/app/providers';
import { useTheme } from '@/src/app/providers';
import type { ProfileUser } from '@/src/entities/profile';
import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import type { UseProfileSettingsReturn } from './profile-settings.types';

export function useProfileSettings(): UseProfileSettingsReturn {
  const { user, signOut } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const router = useRouter();

  const profileUser = user as ProfileUser | null;

  const displayName =
    profileUser?.profile?.displayName || profileUser?.name || 'User';

  const email = profileUser?.email || 'user@example.com';
  const avatarUrl = profileUser?.profile?.avatarUrl;
  const canOpenProfile = Boolean(profileUser?.id);
  const isDark = resolvedTheme === 'dark';

  const openProfile = useCallback(() => {
    if (!profileUser?.id) {
      return;
    }

    router.push(`/profile/${profileUser.id}`);
  }, [profileUser?.id, router]);

  const logout = useCallback(async () => {
    await signOut();
    router.replace('/login');
  }, [router, signOut]);

  return useMemo(
    () => ({
      displayName,
      email,
      avatarUrl,
      isDark,
      canOpenProfile,
      openProfile,
      toggleThemeMode: toggleTheme,
      logout,
    }),
    [
      avatarUrl,
      canOpenProfile,
      displayName,
      email,
      isDark,
      logout,
      openProfile,
      toggleTheme,
    ]
  );
}
