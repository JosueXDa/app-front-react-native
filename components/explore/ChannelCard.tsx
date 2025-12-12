import { Avatar } from '@/components/ui/avatar';
import { useChannels } from '@/context/ChannelContex';
import { Channel, isJoined as checkIsJoined, joinChannel } from '@/lib/api/chat';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

interface ChannelCardProps {
    channel: Channel;
}

export function ChannelCard({ channel }: ChannelCardProps) {
    const router = useRouter();
    const [isJoined, setIsJoined] = useState(false);
    const [loading, setLoading] = useState(false);
    const { refreshChannels } = useChannels();

    useEffect(() => {
        checkJoinStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkJoinStatus = async () => {
        try {
            const joined = await checkIsJoined(channel.id);
            setIsJoined(joined);
        } catch (error) {
            console.error('Error checking join status:', error);
        }
    };

    const handleJoin = async () => {
        setLoading(true);
        try {
            await joinChannel(channel.id);
            setIsJoined(true);
            await refreshChannels();
        } catch (error) {
            console.error('Error joining channel:', error);
            // Optionally handle error (e.g., if already joined, we might want to set isJoined=true)
        } finally {
            setLoading(false);
        }
    };

    const handleView = () => {
        router.push('/');
    };

    return (
        <View className="flex-row items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl mx-4 my-2 shadow-sm border border-gray-100 dark:border-gray-700">
            <View className="mr-3">
                <Avatar
                    imageUrl={channel.imageUrl}
                    name={channel.name}
                    size="lg"
                />
            </View>
            <View className="flex-1 mr-4">
                <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {channel.name}
                </Text>
                {channel.description && (
                    <Text className="text-sm text-gray-500 dark:text-gray-400" numberOfLines={2}>
                        {channel.description}
                    </Text>
                )}
                <View className="flex-row items-center mt-2">
                    <Text className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                        {channel.isPrivate ? 'Private' : 'Public'}
                    </Text>
                    {channel.category && (
                        <Text className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded ml-2">
                            {channel.category}
                        </Text>
                    )}
                </View>
            </View>

            {isJoined ? (
                <Pressable
                    className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg active:opacity-80"
                    onPress={handleView}
                >
                    <Text className="text-gray-900 dark:text-white font-medium">View</Text>
                </Pressable>
            ) : (
                <Pressable
                    className="bg-blue-600 px-4 py-2 rounded-lg active:opacity-80 min-w-[70px] items-center"
                    onPress={handleJoin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text className="text-white font-medium">Join</Text>
                    )}
                </Pressable>
            )}
        </View>
    );
}
