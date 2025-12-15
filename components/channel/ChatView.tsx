import { useAuth } from '@/context/AuthContext';
import { Channel, createMessage, getMessages, Message, Thread } from '@/lib/api/chat';
import { wsManager } from '@/lib/api/ws';
import { ArrowLeft, MoreVertical, Send } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';

interface PendingMessage {
    tempId: string;
    content: string;
    timestamp: number;
    retries: number;
}

interface ChatViewProps {
    channel: Channel;
    thread: Thread;
    showBackButton?: boolean;
    onBack?: () => void;
}

export function ChatView({ channel, thread, showBackButton = true, onBack }: ChatViewProps) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const pendingQueueRef = useRef<PendingMessage[]>([]);
    const isSendingRef = useRef(false);
    const flatListRef = useRef<FlatList>(null);
    
    const { user } = useAuth();

    const fetchMessages = useCallback(async () => {
        if (!thread.id) return;
        try {
            setIsLoading(true);
            setError(null);
            const fetchedMessages = await getMessages(thread.id);
            setMessages(fetchedMessages);
        } catch (err) {
            console.error('Failed to fetch messages:', err);
            setError('Failed to load messages. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [thread.id]);

    const processPendingQueue = useCallback(async () => {
        if (isSendingRef.current || pendingQueueRef.current.length === 0 || !user || !thread.id) {
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
                threadId: thread.id,
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
    }, [thread.id, user]);

    const handleSend = async () => {
        if (!message.trim() || !user || !thread.id) return;

        const originalMessage = message.trim();
        const tempId = `temp-${Date.now()}`;

        const tempMessage: Message = {
            id: tempId,
            senderId: user.id,
            threadId: thread.id,
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

    const handleNewMessage = useCallback((payload: any) => {
        console.log('[ChatView] 📨 New message received:', payload);
        
        // Payload structure from backend: { id, content, senderId, threadId, createdAt, sender: { id, name, image } }
        const newMessage: Message = {
            id: payload.id,
            senderId: payload.senderId,
            threadId: payload.threadId,
            content: payload.content,
            createdAt: payload.createdAt,
            sender: {
                id: payload.sender.id,
                name: payload.sender.name,
                avatar: payload.sender.image || undefined
            }
        };
        
        setMessages(prev => {
            // Check if message already exists
            if (prev.some(msg => msg.id === newMessage.id)) {
                console.log('[ChatView] ⚠️ Message already exists, skipping');
                return prev;
            }

            // Replace temp message if exists
            const tempIndex = prev.findIndex(
                msg => msg.id.startsWith('temp-') && 
                msg.senderId === newMessage.senderId &&
                msg.content.trim() === newMessage.content.trim()
            );

            if (tempIndex !== -1) {
                console.log('[ChatView] ✅ Replacing temp:', prev[tempIndex].id, '→', newMessage.id);
                return [
                    ...prev.slice(0, tempIndex),
                    newMessage,
                    ...prev.slice(tempIndex + 1)
                ];
            }

            console.log('[ChatView] ➕ Adding new message');
            const updated = [...prev, newMessage];
            
            // Auto-scroll to bottom for new messages
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
            
            return updated;
        });
    }, []);

    const handleMessageDeleted = useCallback((payload: any) => {
        console.log('[ChatView] 🗑️ Message deleted:', payload);
        // Payload structure: { id, threadId }
        setMessages(prev => prev.filter(msg => msg.id !== payload.id));
    }, []);

    useEffect(() => {
        if (!thread.id) return;

        const setupWebSocket = async () => {
            try {
                console.log('[ChatView] 🔌 Setting up WebSocket for thread:', thread.id);
                
                // Connect to WebSocket
                await wsManager.connect();
                
                console.log('[ChatView] ✅ WebSocket connected, joining thread');
                
                // Join thread (backend protocol)
                wsManager.joinThread(thread.id);
                
                // Subscribe to NEW_MESSAGE events
                const messageHandler = (payload: any) => {
                    console.log('[ChatView] 📬 NEW_MESSAGE event:', payload);
                    if (payload.threadId === thread.id) {
                        handleNewMessage(payload);
                    }
                };
                wsManager.on('NEW_MESSAGE', messageHandler);
                
                // Subscribe to MESSAGE_DELETED events
                const deleteHandler = (payload: any) => {
                    console.log('[ChatView] 📬 MESSAGE_DELETED event:', payload);
                    if (payload.threadId === thread.id) {
                        handleMessageDeleted(payload);
                    }
                };
                wsManager.on('MESSAGE_DELETED', deleteHandler);
                
                // Subscribe to ERROR events
                const errorHandler = (payload: any) => {
                    console.error('[ChatView] ❌ WebSocket error:', payload);
                    setError(payload.message || 'WebSocket error occurred');
                };
                wsManager.on('ERROR', errorHandler);
                
                // Cleanup function
                return () => {
                    console.log('[ChatView] 🧹 Cleaning up WebSocket');
                    wsManager.off('NEW_MESSAGE', messageHandler);
                    wsManager.off('MESSAGE_DELETED', deleteHandler);
                    wsManager.off('ERROR', errorHandler);
                    wsManager.leaveThread(thread.id);
                };
            } catch (error) {
                console.error('[ChatView] ❌ WebSocket setup failed:', error);
            }
        };

        const cleanup = setupWebSocket();
        fetchMessages();

        return () => {
            cleanup.then(fn => fn?.());
        };
    }, [thread.id, handleNewMessage, handleMessageDeleted, fetchMessages]);

    return (
        <View className="flex-1 bg-[#efeae2] dark:bg-[#0b141a]">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <View className="flex-row items-center">
                    {showBackButton && onBack && (
                        <View className="mr-3">
                            <Pressable onPress={onBack}>
                                <ArrowLeft size={20} color="#54656f" />
                            </Pressable>
                        </View>
                    )}
                    {/* <View className="mr-3">
                        <Avatar size="md">
                            {channel.imageUrl ? (
                                <AvatarImage source={{ uri: channel.imageUrl }} alt={thread.name || 'Unknown Thread'} />
                            ) : (
                                <AvatarFallbackText>{thread.name || 'Unknown Thread'}</AvatarFallbackText>
                            )}
                        </Avatar>
                    </View> */}
                    <View>
                        <Text className="font-bold text-gray-900 dark:text-white text-base">
                            {thread.name || 'Unknown Thread'}
                        </Text>
                        <Text className="text-xs text-gray-500 dark:text-gray-400">
                            {channel.name}
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
}
