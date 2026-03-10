import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { LoginForm } from '@/src/features/auth/login/ui/LoginForm';
import { GoogleLoginButton } from '@/components/auth/GoogleloginBotton';
import { GithubLoginButton } from '@/components/auth/GithubLoginButton';

export const LoginCard = () => (
  <View className="flex-grow justify-center px-6 py-10">
    <View className="items-center mb-10">
      <View className="bg-brand-100 dark:bg-brand-900 p-4 rounded-full mb-4">
        <Ionicons name="chatbubbles" size={40} color="rgb(var(--color-brand-500))" />
      </View>
      <Text className="text-3xl font-bold text-gray-900 dark:text-white text-center">Bienvenido de nuevo</Text>
      <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">Inicia sesión para continuar conectando</Text>
    </View>

    <View className="w-full max-w-md mx-auto">
      <LoginForm />

      <View className="flex-row items-center my-8">
        <View className="flex-1 h-[1px] bg-outline-200" />
        <Text className="mx-4 text-typography-400">O continúa con</Text>
        <View className="flex-1 h-[1px] bg-outline-200" />
      </View>

      <View className="flex-row gap-4 justify-center mb-8">
        <GoogleLoginButton />
        <GithubLoginButton />
      </View>

      <View className="flex-row justify-center">
        <Text className="text-typography-600">¿No tienes una cuenta? </Text>
        <Link href="../register" asChild>
          <Pressable>
            <Text className="text-brand-500 font-bold">Regístrate</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  </View>
);
