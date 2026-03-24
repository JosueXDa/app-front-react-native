import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export function HeroSection() {
    return (
        <View className="items-center justify-center py-20 px-4">
            <View className="mb-6 bg-brand-100 dark:bg-brand-900 px-4 py-1.5 rounded-full">
                <Text className="text-brand-600 dark:text-brand-300 font-medium text-sm">
                    v1.0 Ahora Disponible
                </Text>
            </View>

            <Text className="text-4xl md:text-6xl font-bold text-center text-typography-900 mb-6 leading-tight">
                Mensajería en <Text className="text-brand-500">Tiempo Real</Text>
                {'\n'}Sin Complicaciones
            </Text>

            <Text className="text-lg md:text-xl text-typography-600 text-center max-w-2xl mb-10 leading-relaxed">
                Conecta con amigos, crea grupos y comparte momentos al instante.
                Una experiencia fluida, segura y diseñada para ti.
            </Text>

            <View className="flex-row gap-4">
                <Link href="/(auth)/login" asChild>
                    <Pressable className="bg-brand-500 hover:bg-brand-600 active:bg-brand-700 px-8 py-4 rounded-xl">
                        <Text className="text-white font-bold text-lg">Comenzar Ahora</Text>
                    </Pressable>
                </Link>

                <Pressable className="bg-background-0 border border-outline-200 px-8 py-4 rounded-xl hover:bg-background-50 active:bg-background-100">
                    <Text className="text-typography-900 font-bold text-lg">Saber Más</Text>
                </Pressable>
            </View>
        </View>
    );
}
