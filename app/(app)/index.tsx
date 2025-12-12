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
            <View className="flex-1 flex-row bg-gray-100 dark:bg-gray-900">
                <View className="flex-1 bg-[#efeae2] dark:bg-[#0b141a]">
                    <View className="flex-1 items-center justify-center p-8">
                        <Text className="text-2xl font-light text-gray-500 dark:text-gray-400 mb-4">
                            Welcome to ChatApp
                        </Text>
                        <Text className="text-gray-400 dark:text-gray-500 text-center">
                            Select a chat to start messaging
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    return null;
}
