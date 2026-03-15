import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Pressable } from 'react-native';
import { authClient } from '@/src/shared/api/auth-client';

export const GithubLoginButton = () => {
  const [loading, setLoading] = useState(false);

  const handleGithubLogin = async () => {
    try {
      setLoading(true);
      const { error } = await authClient.signIn.social({
        provider: 'github',
        callbackURL: 'http://localhost:8081/(app)',
      });

      if (error) {
        Alert.alert('Error', error.message || 'No se pudo iniciar sesión con GitHub');
      }
    } catch (e: any) {
      console.error('GitHub login error:', e);
      Alert.alert('Error', e.message || 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={handleGithubLogin}
      disabled={loading}
      className={`bg-background-50 border border-outline-200 p-4 rounded-xl flex-1 items-center ${
        loading ? 'opacity-70' : 'active:bg-background-100'
      }`}
    >
      <Ionicons name="logo-github" size={24} color="#ffff" />
    </Pressable>
  );
};
