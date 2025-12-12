import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { useSelectedChannel } from '@/context/SelectedChannelContext';
import { Channel, createMessage, getChannelById, getMessages, Message } from '@/lib/api/chat';
import { wsManager } from '@/lib/api/ws';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, MoreVertical, Send } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, useWindowDimensions, View } from 'react-native';

interface PendingMessage {
    tempId: string;
    content: string;
    timestamp: number;
    retries: number;
}

export default function ChannelScreen() {
    const { channelId } = useLocalSearchParams<{ channelId: string }>();
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isDesktop = width >= 768;
    
    // Primero intentar usar el canal del contexto, luego hacer fetch si no existe
    const { selectedChannel } = useSelectedChannel();
    const [channel, setChannel] = useState<Channel | null>(
        selectedChannel?.id === channelId ? selectedChannel : null
    );
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const pendingQueueRef = useRef<PendingMessage[]>([]);
    const isSendingRef = useRef(false);
    const flatListRef = useRef<FlatList>(null);
    
    const { user } = useAuth();

    const handleBack = () => {
        router.back();
    };

    // Fetch channel data - usa el contexto primero, si no coincide hace fetch
    useEffect(() => {
        const fetchChannel = async () => {
            if (!channelId) return;
            
            // Si el canal del contexto coincide con el channelId, úsalo directamente
            if (selectedChannel?.id === channelId) {
                setChannel(selectedChannel);
                console.log('[ChannelScreen] Using channel from context:', selectedChannel.name);
                return;
            }
            
            // Si no, hacer fetch del canal
            try {
                console.log('[ChannelScreen] Fetching channel data for:', channelId);
                const fetchedChannel = await getChannelById(channelId);
                setChannel(fetchedChannel);
            } catch (err) {
                console.error('Failed to fetch channel:', err);
                setError('Failed to load channel.');
            }
        };
        fetchChannel();
    }, [channelId, selectedChannel]);

    const fetchMessages = useCallback(async () => {
        if (!channelId) return;
        try {
            setIsLoading(true);
            setError(null);
            const fetchedMessages = await getMessages(channelId);
            setMessages(fetchedMessages);
        } catch (err) {
            console.error('Failed to fetch messages:', err);
            setError('Failed to load messages. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [channelId]);

    const processPendingQueue = useCallback(async () => {
        if (isSendingRef.current || pendingQueueRef.current.length === 0 || !user || !channelId) {
            return;
        }

        isSendingRef.current = true;
        const pendingMsg = pendingQueueRef.current.shift();

        if (!pendingMsg) {
            isSendingRef.current = false;
            return;
        }

        try {
            const createdMessage = await createMessage({
                channelId,
                content: pendingMsg.content
            });
            console.log(`Message ${pendingMsg.tempId} sent, server returned:`, createdMessage.id);
        } catch (err) {
            console.error(`Failed to send message ${pendingMsg.tempId}:`, err);
            
            if (pendingMsg.retries < 3) {
                pendingMsg.retries++;
                const delayMs = Math.pow(2, pendingMsg.retries) * 1000;
                setTimeout(() => {
                    pendingQueueRef.current.push(pendingMsg);
                    processPendingQueue();
                }, delayMs);
            } else {
                setError(`Failed to send: "${pendingMsg.content}". Check your connection.`);
                setMessages(prev => 
                    prev.filter(msg => msg.id !== pendingMsg.tempId)
                );
            }
        } finally {
            isSendingRef.current = false;
            if (pendingQueueRef.current.length > 0) {
                setTimeout(() => processPendingQueue(), 100);
            }
        }
    }, [channelId, user]);

    const handleSend = async () => {
        if (!message.trim() || !user || !channelId) return;

        const originalMessage = message.trim();
        const tempId = `temp-${Date.now()}`;

        const tempMessage: Message = {
            id: tempId,
            senderId: user.id,
            channelId,
            content: originalMessage,
            createdAt: new Date().toISOString(),
            sender: {
                id: user.id,
                name: user.name,
                avatar: user.avatar
            }
        };

        setMessage('');
        setMessages(prev => [...prev, tempMessage]);
        setError(null);

        pendingQueueRef.current.push({
            tempId,
            content: originalMessage,
            timestamp: Date.now(),
            retries: 0
        });

        processPendingQueue();
    };

    const handleNewMessage = useCallback((newMessage: Message) => {
        console.log('[ChannelScreen] 📨 New message received:', newMessage.id);
        setMessages(prev => {
            if (prev.some(msg => msg.id === newMessage.id)) {
                console.log('[ChannelScreen] ⚠️ Message already exists, skipping');
                return prev;
            }

            const tempIndex = prev.findIndex(
                msg => msg.id.startsWith('temp-') && 
                msg.senderId === newMessage.senderId &&
                msg.content.trim() === newMessage.content.trim()
            );

            if (tempIndex !== -1) {
                console.log('[ChannelScreen] ✅ Replacing temp:', prev[tempIndex].id, '→', newMessage.id);
                return [
                    ...prev.slice(0, tempIndex),
                    newMessage,
                    ...prev.slice(tempIndex + 1)
                ];
            }

            console.log('[ChannelScreen] ➕ Adding new message from other user');
            const updated = [...prev, newMessage];
            
            if (newMessage.senderId === user?.id) {
                setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }
            
            return updated;
        });
    }, [user?.id]);

    useEffect(() => {
        if (!channelId) return;

        let cleanup: (() => void) | null = null;
        let messageHandlerRef: ((data: any) => void) | null = null;

        const setupWebSocket = async () => {
            try {
                await wsManager.connect();

                console.log(`[WebSocket] Joining channel: ${channelId}`);
                wsManager.sendMessage('JOIN_CHANNEL', {
                    channelId
                });

                messageHandlerRef = (data: any) => {
                    let message = null;
                    let receivedChannelId = null;
                    
                    if (data.message && data.channelId) {
                        message = data.message;
                        receivedChannelId = data.channelId;
                    } else if (data.id && data.content && data.senderId) {
                        message = data;
                        receivedChannelId = data.channelId;
                    }
                    
                    if (receivedChannelId === channelId && message) {
                        console.log(`[ChannelScreen] ✅ Message for this channel`);
                        handleNewMessage(message);
                    }
                };

                wsManager.on('NEW_MESSAGE', messageHandlerRef);

                cleanup = () => {
                    console.log(`[WebSocket] Leaving channel: ${channelId}`);
                    if (messageHandlerRef) {
                        wsManager.off('NEW_MESSAGE', messageHandlerRef);
                    }
                    wsManager.sendMessage('LEAVE_CHANNEL', {
                        channelId
                    });
                };
            } catch (error) {
                console.error('[WebSocket] Setup error:', error);
            }
        };

        setupWebSocket();
        fetchMessages();

        return () => {
            cleanup?.();
        };
    }, [channelId, handleNewMessage, fetchMessages]);

    if (!channel) {
        return (
            <View className="flex-1 items-center justify-center bg-[#efeae2] dark:bg-[#0b141a]">
                <ActivityIndicator size="large" color="#00a884" />
            </View>
        );
    }

    const renderChatContent = () => (
        <View className="flex-1 bg-[#efeae2] dark:bg-[#0b141a]">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <View className="flex-row items-center">
                    <View className="mr-3">
                        <Pressable onPress={handleBack}>
                            <ArrowLeft size={20} color="#54656f" />
                        </Pressable>
                    </View>
                    <View className="mr-3">
                        <Avatar
                            imageUrl={channel.imageUrl}
                            name={channel.name || 'Unknown Channel'}
                            size="md"
                        />
                    </View>
                    <View>
                        <Text className="font-bold text-gray-900 dark:text-white text-base">
                            {channel.name || 'Unknown Channel'}
                        </Text>
                        <Text className="text-xs text-gray-500 dark:text-gray-400">
                            tap here for info
                        </Text>
                    </View>
                </View>
                <View className="flex-row items-center">
                    <Pressable className="p-2"><MoreVertical size={20} color="#54656f" /></Pressable>
                </View>
            </View>

            {/* Messages Area */}
            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#00a884" />
                    <Text className="text-gray-500 dark:text-gray-400 mt-2">Loading messages...</Text>
                </View>
            ) : error ? (
                <View className="flex-1 items-center justify-center px-4">
                    <Text className="text-red-500 dark:text-red-400 text-center mb-4">{error}</Text>
                    <Pressable
                        onPress={fetchMessages}
                        className="bg-[#00a884] px-4 py-2 rounded-lg"
                    >
                        <Text className="text-white">Retry</Text>
                    </Pressable>
                </View>
            ) : messages.length === 0 ? (
                <View className="flex-1 items-center justify-center px-4">
                    <Text className="text-gray-500 dark:text-gray-400 text-center">
                        No messages yet. Start the conversation!
                    </Text>
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    extraData={messages}
                    contentContainerStyle={{ padding: 16 }}
                    onContentSizeChange={() => {
                        flatListRef.current?.scrollToEnd({ animated: false });
                    }}
                    renderItem={({ item }) => {
                        const isCurrentUser = item.senderId === user?.id;
                        const messageTime = new Date(item.createdAt);
                        const isPending = item.id.startsWith('temp-');

                        return (
                            <View 
                                key={item.id} 
                                className={`mb-2 max-w-[80%] p-3 rounded-lg ${
                                    isCurrentUser
                                        ? 'bg-[#d9fdd3] dark:bg-[#005c4b] self-end'
                                        : 'bg-white dark:bg-gray-800 self-start'
                                } ${isPending ? 'opacity-60' : ''}`}
                            >
                                <Text className="text-gray-900 dark:text-white text-base">
                                    {item.content}
                                </Text>
                                <Text className="text-[10px] text-gray-500 dark:text-gray-400 self-end mt-1">
                                    {messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    {isPending && ' • Sending...'}
                                </Text>
                            </View>
                        );
                    }}
                />
            )}

            {/* Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            >
                <View className="flex-row items-center p-2 bg-gray-100 dark:bg-gray-800">
                    <View className="flex-1 bg-white dark:bg-gray-700 rounded-full px-4 py-2 mr-2 border border-gray-200 dark:border-gray-600">
                        <TextInput
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Type a message"
                            placeholderTextColor="#9ca3af"
                            className="text-base text-gray-900 dark:text-white"
                            multiline
                        />
                    </View>
                    <Pressable
                        onPress={handleSend}
                        className="w-10 h-10 bg-[#00a884] rounded-full items-center justify-center"
                    >
                        <Send size={20} color="white" />
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View>
    );

    // Desktop: incluir espacio para miembros (placeholder)
    if (isDesktop) {
        return (
            <View className="flex-1 flex-row bg-gray-100 dark:bg-gray-900">
                {/* Main Chat Window */}
                <View className="flex-1">
                    {renderChatContent()}
                </View>
                
                {/* Members List Placeholder (futuro) */}
                <View className="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
                    <View className="flex-1 items-center justify-center p-4">
                        <Text className="text-gray-400 dark:text-gray-500 text-center">
                            Members list
                        </Text>
                        <Text className="text-gray-400 dark:text-gray-500 text-xs text-center mt-2">
                            (Coming soon)
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    // Mobile: solo el chat
    return renderChatContent();
}
