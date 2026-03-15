import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { AuthInput } from '@/src/shared/ui/auth-input';
import { useLogin } from '../model/useLogin';

export const LoginForm = () => {
  const { login, loading } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View className="gap-4">
      <AuthInput
        label="Correo Electrónico"
        iconName="mail-outline"
        placeholder="ejemplo@correo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <AuthInput
        label="Contraseña"
        iconName="lock-closed-outline"
        placeholder="••••••••"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable className="items-end">
        <Text className="text-brand-500 font-medium">¿Olvidaste tu contraseña?</Text>
      </Pressable>

      <Pressable
        className={`bg-brand-500 py-4 rounded-xl items-center shadow-lg shadow-brand-500/30 ${loading ? 'opacity-70' : 'active:bg-brand-600'}`}
        onPress={() => login(email, password)}
        disabled={loading}
      >
        <Text className="text-white font-bold text-lg">
          {loading ? 'Iniciando...' : 'Iniciar Sesión'}
        </Text>
      </Pressable>
    </View>
  );
};
