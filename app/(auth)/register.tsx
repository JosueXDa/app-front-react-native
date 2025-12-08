import { AuthInput } from '@/components/auth/AuthInput';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/context/AuthContext';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        try {
            await signUp({ name, email, password });
            // Navigation is handled by AuthContext
        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', error.response?.data?.message || 'Error al registrarse');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-950">
            <ScrollView contentContainerClassName="flex-grow justify-center px-6 py-10">
                <View className="items-center mb-10">
                    <View className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-4">
                        <Ionicons name="person-add" size={40} color="#3b82f6" />
                    </View>
                    <Text className="text-3xl font-bold text-gray-900 dark:text-white text-center">
                        Crear Cuenta
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">
                        Únete a la comunidad de mensajería
                    </Text>
                </View>

                <View className="w-full max-w-md mx-auto">
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
                        className={`bg-blue-600 py-4 rounded-xl items-center shadow-lg shadow-blue-500/30 mt-4 ${loading ? 'opacity-70' : 'active:bg-blue-700'}`}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        <Text className="text-white font-bold text-lg">
                            {loading ? 'Creando cuenta...' : 'Registrarse'}
                        </Text>
                    </Pressable>

                    <View className="flex-row justify-center mt-8">
                        <Text className="text-gray-600 dark:text-gray-400">¿Ya tienes una cuenta? </Text>
                        <Link href="/(auth)/login" asChild>
                            <Pressable>
                                <Text className="text-blue-500 font-bold">Inicia Sesión</Text>
                            </Pressable>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
