import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export function HeroSection() {
    return (
        <View className="items-center justify-center py-20 px-4">
            <View className="mb-6 bg-blue-100 dark:bg-blue-900/50 px-4 py-1.5 rounded-full">
                <Text className="text-blue-600 dark:text-blue-300 font-medium text-sm">
                    v1.0 Ahora Disponible
                </Text>
            </View>

            <Text className="text-4xl md:text-6xl font-bold text-center text-gray-900 dark:text-white mb-6 leading-tight">
                Mensajería en <Text className="text-blue-500">Tiempo Real</Text>
                {'\n'}Sin Complicaciones
            </Text>

            <Text className="text-lg md:text-xl text-gray-600 dark:text-gray-300 text-center max-w-2xl mb-10 leading-relaxed">
                Conecta con amigos, crea grupos y comparte momentos al instante.
                Una experiencia fluida, segura y diseñada para ti.
            </Text>

            <View className="flex-row gap-4">
                <Link href="/(auth)/login" asChild>
                    <Pressable className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 px-8 py-4 rounded-xl shadow-lg shadow-blue-500/30">
                        <Text className="text-white font-bold text-lg">Comenzar Ahora</Text>
                    </Pressable>
                </Link>

                <Pressable className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Text className="text-gray-900 dark:text-white font-bold text-lg">Saber Más</Text>
                </Pressable>
            </View>
        </View>
    );
}
