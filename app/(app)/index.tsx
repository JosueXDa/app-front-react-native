import { ChatList } from '@/components/chat/ChatList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { useSelectedChannel } from '@/context/SelectedChannelContext';
import { Channel, getUserChannels } from '@/lib/api/chat';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, useWindowDimensions, View } from 'react-native';

export default function Dashboard() {
    const { width } = useWindowDimensions();
    const isDesktop = width >= 768;
    const { selectedChannel, setSelectedChannel } = useSelectedChannel();
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadChannels();
    }, []);

    const loadChannels = async () => {
        try {
            const data = await getUserChannels();
            setChannels(data);
        } catch (error) {
            console.error('Error loading channels:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectChannel = (channel: Channel) => {
        setSelectedChannel(channel);
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
                <ActivityIndicator size="large" color="#00a884" />
            </View>
        );
    }

    if (isDesktop) {
        return (
            <View className="flex-1 flex-row bg-gray-100 dark:bg-gray-900">
                {/* Left Side: Chat List */}
                <View className="w-1/3 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <ChatList
                        selectedChannelId={selectedChannel?.id}
                        onSelectChannel={handleSelectChannel}
                        isDesktop={true}
                    />
                </View>

                {/* Right Side: Chat Window */}
                <View className="flex-1 bg-[#efeae2] dark:bg-[#0b141a]">
                    {selectedChannel ? (
                        <ChatWindow channel={selectedChannel} />
                    ) : (
                        <View className="flex-1 items-center justify-center p-8">
                            <Text className="text-2xl font-light text-gray-500 dark:text-gray-400 mb-4">
                                Welcome to ChatApp
                            </Text>
                            <Text className="text-gray-400 dark:text-gray-500 text-center">
                                Select a chat to start messaging
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        );
    }

    // Mobile View
    return (
        <View className="flex-1 bg-white dark:bg-gray-900">
            {selectedChannel ? (
                <ChatWindow channel={selectedChannel} />
            ) : (
                <ChatList
                    onSelectChannel={handleSelectChannel}
                    isDesktop={false}
                />
            )}
        </View>
    );
}
