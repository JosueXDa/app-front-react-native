import { useSelectedChannel } from '@/context/SelectedChannelContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text, View, useWindowDimensions } from 'react-native';

export default function Dashboard() {
    const { width } = useWindowDimensions();
    const isDesktop = width >= 768;
    const { selectedChannel } = useSelectedChannel();
    const router = useRouter();

    // Navigate to channel page when a channel is selected (desktop)
    useEffect(() => {
        if (selectedChannel && isDesktop) {
            router.push(`/channels/${selectedChannel.id}`);
        }
    }, [selectedChannel, router, isDesktop]);

    // Mobile: redirect to /channels/me by default
    useEffect(() => {
        if (!isDesktop) {
            router.replace('/channels/me');
        }
    }, [isDesktop, router]);

    // Desktop: show welcome screen by default
    if (isDesktop) {
        return (
            <View className="flex-1 flex-row bg-background-0">
                <View className="flex-1 bg-background-0">
                    <View className="flex-1 items-center justify-center p-8">
                        <View className="bg-brand-100 dark:bg-brand-900 p-6 rounded-full mb-6">
                            <Text className="text-4xl">💬</Text>
                        </View>
                        <Text className="text-2xl font-bold text-typography-900 mb-2">
                            Bienvenido a ChatApp
                        </Text>
                        <Text className="text-typography-500 text-center">
                            Selecciona un canal para comenzar a chatear
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    return null;
}
