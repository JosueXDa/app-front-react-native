import { FeatureCard } from '@/components/landing/FeatureCard';
import { HeroSection } from '@/components/landing/HeroSection';
import { Stack } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LandingPage() {
    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-950">
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView className="flex-1" contentContainerClassName="pb-20">
                {/* Hero Section */}
                <HeroSection />

                {/* Features Section */}
                <View className="px-4 py-10 bg-gray-50 dark:bg-gray-900/50">
                    <View className="max-w-6xl mx-auto w-full">
                        <Text className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
                            Todo lo que necesitas
                        </Text>
                        <Text className="text-gray-500 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
                            Una plataforma robusta construida con las mejores tecnologías para garantizar velocidad y seguridad.
                        </Text>

                        <View className="flex-row flex-wrap justify-between">
                            <FeatureCard
                                title="Autenticación Segura"
                                description="Sistema de login robusto con Better Auth para proteger tu cuenta y datos."
                                iconName="shield-checkmark"
                            />
                            <FeatureCard
                                title="Chat en Tiempo Real"
                                description="Mensajería instantánea impulsada por WebSockets de alto rendimiento."
                                iconName="chatbubbles"
                            />
                            <FeatureCard
                                title="Canales y Grupos"
                                description="Crea espacios temáticos y conecta con comunidades enteras fácilmente."
                                iconName="people"
                            />
                            <FeatureCard
                                title="Perfiles Personalizables"
                                description="Gestiona tu identidad con avatares, estados y biografías únicas."
                                iconName="person"
                            />
                        </View>
                    </View>
                </View>

                {/* Tech Stack / Info */}
                <View className="px-4 py-20">
                    <View className="max-w-4xl mx-auto w-full items-center">
                        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                            Potenciado por Tecnología Moderna
                        </Text>
                        <View className="flex-row flex-wrap justify-center gap-8 opacity-70">
                            <Text className="text-xl font-semibold text-gray-400">Bun</Text>
                            <Text className="text-xl font-semibold text-gray-400">Hono</Text>
                            <Text className="text-xl font-semibold text-gray-400">React Native</Text>
                            <Text className="text-xl font-semibold text-gray-400">Expo</Text>
                            <Text className="text-xl font-semibold text-gray-400">NativeWind</Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View className="border-t border-gray-100 dark:border-gray-800 py-8 items-center">
                    <Text className="text-gray-400 text-sm">
                        © 2025 AppMensajería. Todos los derechos reservados.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
