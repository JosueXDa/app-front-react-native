import { AuthInput } from "@/src/shared/ui/auth-input";
import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useRegister } from "../model/useRegister";

export const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, loading } = useRegister();
  return (
    <View className="gap-4">
      <AuthInput
          label="Nombre Completo"
          iconName="person-outline"
          placeholder="Tu nombre"
          value={name}
          onChangeText={setName}
      />

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

      <AuthInput
          label="Confirmar Contraseña"
          iconName="lock-closed-outline"
          placeholder="••••••••"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
      />

      <Pressable
          className={`bg-brand-500 py-4 rounded-xl items-center shadow-lg shadow-brand-500/30 mt-4 ${loading ? 'opacity-70' : 'active:bg-brand-600'}`}
          onPress={() => register(name, email, password, confirmPassword)}
          disabled={loading}
      >
          <Text className="text-white font-bold text-lg">
              {loading ? 'Creando cuenta...' : 'Registrarse'}
          </Text>
      </Pressable>

      <View className="flex-row justify-center mt-8">
          <Text className="text-typography-600">¿Ya tienes una cuenta? </Text>
          <Link href="./(auth)/login" asChild>
              <Pressable>
                  <Text className="text-brand-500 font-bold">Inicia Sesión</Text>
              </Pressable>
          </Link>
      </View>
    </View>
  );
}
