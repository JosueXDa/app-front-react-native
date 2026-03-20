import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import type { UseViewProfileReturn } from './view-profile.types';

export function useViewProfile(): UseViewProfileReturn {
  const params = useLocalSearchParams<{ userId?: string }>();

  return useMemo(
    () => ({
      userId: params.userId,
      title: 'Profile / Settings',
    }),
    [params.userId]
  );
}
