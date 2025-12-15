import { ChatView } from '@/components/channel/ChatView';
import { useSelectedChannel } from '@/context/SelectedChannelContext';
import { Channel, getChannelById, getThreadById, Thread } from '@/lib/api/chat';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function ThreadScreen() {
    const { channelId, threadId } = useLocalSearchParams<{ channelId: string; threadId: string }>();
    const router = useRouter();
    
    const { selectedChannel } = useSelectedChannel();
    const [channel, setChannel] = useState<Channel | null>(
        selectedChannel?.id === channelId ? selectedChannel : null
    );
    const [thread, setThread] = useState<Thread | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleBack = () => {
        router.back();
    };

    // Fetch thread and channel data
    useEffect(() => {
        const fetchThreadAndChannel = async () => {
            if (!threadId || !channelId) return;
            
            try {
                setIsLoading(true);
                // Fetch thread info
                console.log('[ThreadScreen] Fetching thread data for:', threadId);
                const fetchedThread = await getThreadById(threadId);
                setThread(fetchedThread);
                
                // Si el canal del contexto coincide con el channelId, úsalo directamente
                if (selectedChannel?.id === channelId) {
                    setChannel(selectedChannel);
                    console.log('[ThreadScreen] Using channel from context:', selectedChannel.name);
                } else {
                    // Si no, hacer fetch del canal
                    console.log('[ThreadScreen] Fetching channel data for:', channelId);
                    const fetchedChannel = await getChannelById(channelId);
                    setChannel(fetchedChannel);
                }
            } catch (err) {
                console.error('Failed to fetch thread/channel:', err);
                setError('Failed to load thread.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchThreadAndChannel();
    }, [threadId, channelId, selectedChannel]);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-[#efeae2] dark:bg-[#0b141a]">
                <ActivityIndicator size="large" color="#00a884" />
            </View>
        );
    }

    if (error || !channel || !thread) {
        return (
            <View className="flex-1 items-center justify-center bg-[#efeae2] dark:bg-[#0b141a]">
                <Text className="text-red-500 text-center mb-4">
                    {error || 'Failed to load thread'}
                </Text>
            </View>
        );
    }

    // Usar el componente ChatView tanto en desktop como mobile
    return (
        <ChatView
            channel={channel}
            thread={thread}
            showBackButton={true}
            onBack={handleBack}
        />
    );
}
