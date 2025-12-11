import { useChannels } from '@/context/ChannelContex';
import { Channel } from '@/lib/api/chat';
import { useRouter } from 'expo-router';
import { MessageCircle, Plus } from 'lucide-react-native';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';

interface ChatListProps {
    selectedChannelId?: string;
    onSelectChannel: (channel: Channel) => void;
    isDesktop?: boolean;
}

export function ChatList({ selectedChannelId, onSelectChannel, isDesktop }: ChatListProps) {

    const { joinedChannels, isLoading, refreshChannels } = useChannels();
    const router = useRouter();


    if (isLoading) {
        return <ActivityIndicator size="large" />;
    }

    if (joinedChannels.length === 0) {
        return (
            <View className="flex-1 items-center justify-center p-4 bg-white dark:bg-gray-900">
                <Text className="text-gray-500 dark:text-gray-400 text-center mb-4 text-lg">
                    You haven't joined any channels yet.
                </Text>
                <Pressable
                    onPress={() => router.push('/explore')}
                    className="bg-[#00a884] px-6 py-3 rounded-full flex-row items-center shadow-sm active:opacity-90"
                >
                    <Plus color="white" size={20} />
                    <Text className="text-white font-medium ml-2 text-base">Join a Channel</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
            <FlatList
                data={joinedChannels}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => onSelectChannel(item)}
                        className={`flex-row items-center p-3 border-b border-gray-100 dark:border-gray-800 ${selectedChannelId === item.id ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'
                            } active:bg-gray-50 dark:active:bg-gray-800`}
                    >
                        <View className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center mr-3">
                            <MessageCircle size={24} color="#6b7280" />
                        </View>
                        <View className="flex-1">
                            <View className="flex-row justify-between items-center mb-1">
                                <Text className="font-semibold text-gray-900 dark:text-white text-base" numberOfLines={1}>
                                    {item.name}
                                </Text>
                                <Text className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(item.updatedAt).toLocaleDateString()}
                                </Text>
                            </View>
                            <Text className="text-gray-500 dark:text-gray-400 text-sm" numberOfLines={1}>
                                {item.description || 'No description'}
                            </Text>
                        </View>
                    </Pressable>
                )}
            />
        </View>
    );
}
