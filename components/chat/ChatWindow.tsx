import { useAuth } from '@/context/AuthContext';
import { useSelectedChannel } from '@/context/SelectedChannelContext';
import { Channel, Message, createMessage, getMessages } from '@/lib/api/chat';
import { wsManager } from '@/lib/api/ws';
import { ArrowLeft, MoreVertical, Send } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';

interface ChatWindowProps {
    channel: Channel;
}

export function ChatWindow({ channel }: ChatWindowProps) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setSelectedChannel } = useSelectedChannel();
    const { user } = useAuth();

    const handleBack = () => {
        setSelectedChannel(null);
    }

    const fetchMessages = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const fetchedMessages = await getMessages(channel.id);
            setMessages(fetchedMessages);
        } catch (err) {
            console.error('Failed to fetch messages:', err);
            setError('Failed to load messages. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [channel.id]);

    const handleSend = async () => {
        if (!message.trim() || !user) return;

        const originalMessage = message.trim();
        setMessage('');

        // Optimistic UI update
        const tempMessage: Message = {
            id: `temp-${Date.now()}`,
            senderId: user.id,
            channelId: channel.id,
            content: originalMessage,
            createdAt: new Date().toISOString(),
            sender: {
                id: user.id,
                name: user.name,
                avatar: user.avatar
            }
        };

        setMessages(prev => [...prev, tempMessage]);
        setIsSending(true);
        setError(null);

        try {
            // Send via WebSocket for real-time delivery
            wsManager.sendChatMessage(channel.id, originalMessage);

            // Persist to database
            const createdMessage = await createMessage({
                channelId: channel.id,
                content: originalMessage
            });

            // Replace temp message with real one
            setMessages(prev => prev.map(msg =>
                msg.id === tempMessage.id ? createdMessage : msg
            ));
        } catch (err) {
            console.error('Failed to send message:', err);
            setError('Failed to send message. Please try again.');
            // Remove optimistic message on failure
            setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
            // Restore original message
            setMessage(originalMessage);
        } finally {
            setIsSending(false);
        }
    };

    // WebSocket message handler
    useEffect(() => {
        const handleNewMessage = (newMessage: Message) => {
            // Don't add duplicate messages (already handled by optimistic UI)
            if (!messages.some(msg => msg.id === newMessage.id)) {
                setMessages(prev => [...prev, newMessage]);
            }
        };

        wsManager.setupMessageHandlers(channel.id, handleNewMessage);

        return () => {
            // Cleanup WebSocket handlers when component unmounts
            wsManager.off('NEW_MESSAGE', handleNewMessage);
        };
    }, [channel.id, messages]);

    // Fetch messages on component mount
    useEffect(() => {
        fetchMessages();

        // Connect WebSocket if not already connected
        wsManager.connect();

        return () => {
            // Cleanup on unmount
            wsManager.disconnect();
        };
    }, [fetchMessages]);

    return (
        <View className="flex-1 bg-[#efeae2] dark:bg-[#0b141a]">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <View className="flex-row items-center">
                    <View className="mr-3">
                        <Pressable onPress={handleBack}>
                            <ArrowLeft size={20} color="#54656f" />
                        </Pressable>
                    </View>
                    <View className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 items-center justify-center mr-3">
                        <Text className="text-lg font-bold text-gray-600 dark:text-gray-300">
                            {(channel.name || 'Unknown').charAt(0).toUpperCase()}
                        </Text>
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
                    data={messages}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 16 }}
                    renderItem={({ item }) => {
                        const isCurrentUser = item.senderId === user?.id;
                        const messageTime = new Date(item.createdAt);

                        return (
                            <View className={`mb-2 max-w-[80%] p-3 rounded-lg ${isCurrentUser
                                ? 'bg-[#d9fdd3] dark:bg-[#005c4b] self-end'
                                : 'bg-white dark:bg-gray-800 self-start'
                                }`}>
                                <Text className="text-gray-900 dark:text-white text-base">{item.content}</Text>
                                <Text className="text-[10px] text-gray-500 dark:text-gray-400 self-end mt-1">
                                    {messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
}
