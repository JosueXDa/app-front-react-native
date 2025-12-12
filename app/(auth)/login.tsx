import { AuthInput } from '@/components/auth/AuthInput';
import { GithubLoginButton } from '@/components/auth/GithubLoginButton';
import { ToastAlert } from '@/components/auth/ToastAlert';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const toast = useToast();

    const handleLogin = async () => {
        if (!email || !password) {
            toast.show({
                placement: "top right",
                render: ({ id }) => {
                    return (
                        <ToastAlert id={id} title="Error" description="Por favor completa todos los campos" />
                    )
                }
            })
            return;
        }

        setLoading(true);
        try {
            await signIn({ email, password });
            // Navigation is handled by AuthContext
        } catch (error: any) {
            console.error(error);
            toast.show({
                placement: "top right",
                render: ({ id }) => {
                    return (
                        <ToastAlert id={id} title="Error" description={error.response?.data?.message || 'Error al iniciar sesión'} />
                    )
                }
            })
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-950">
            <View className="flex-grow justify-center px-6 py-10">
                <View className="items-center mb-10">
                    <View className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-4">
                        <Ionicons name="chatbubbles" size={40} color="#3b82f6" />
                    </View>
                    <Text className="text-3xl font-bold text-gray-900 dark:text-white text-center">
                        Bienvenido de nuevo
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">
                        Inicia sesión para continuar conectando
                    </Text>
                </View>

                <View className="w-full max-w-md mx-auto">
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

                    <Pressable className="items-end mb-6">
                        <Text className="text-blue-500 font-medium">¿Olvidaste tu contraseña?</Text>
                    </Pressable>

                    <Pressable
                        className={`bg-blue-600 py-4 rounded-xl items-center shadow-lg shadow-blue-500/30 ${loading ? 'opacity-70' : 'active:bg-blue-700'}`}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <Text className="text-white font-bold text-lg">
                            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                        </Text>
                    </Pressable>

                    <View className="flex-row items-center my-8">
                        <View className="flex-1 h-[1px] bg-gray-200 dark:bg-gray-800" />
                        <Text className="mx-4 text-gray-400">O continúa con</Text>
                        <View className="flex-1 h-[1px] bg-gray-200 dark:bg-gray-800" />
                    </View>

                    <View className="flex-row gap-4 justify-center mb-8">
                        <Pressable className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl flex-1 items-center">
                            <Ionicons name="logo-google" size={24} color="#DB4437" />
                        </Pressable>
                        <GithubLoginButton />
                    </View>

                    <View className="flex-row justify-center">
                        <Text className="text-gray-600 dark:text-gray-400">¿No tienes una cuenta? </Text>
                        <Link href="/(auth)/register" asChild>
                            <Pressable>
                                <Text className="text-blue-500 font-bold">Regístrate</Text>
                            </Pressable>
                        </Link>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
