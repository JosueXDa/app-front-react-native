import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { Channel, createMessage, getMessagesByThread, Message, MessageAttachment } from '@/lib/api/chat';
import { wsManager } from '@/lib/api/ws';
import { ArrowLeft, MoreVertical } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { AttachmentsList } from './AttachmentRenderer';
import { ChatInput } from './ChatInput';

export interface Thread {
    id: string;
    channelId: string;
    name: string;
    description?: string | null;
    createdBy: string;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
}

interface PendingMessage {
    tempId: string;
    content: string;
    attachments?: MessageAttachment[];
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
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const pendingQueueRef = useRef<PendingMessage[]>([]);
    const isSendingRef = useRef(false);
    const flatListRef = useRef<FlatList>(null);
    const offsetRef = useRef(0);
    const limitRef = useRef(50);
    
    const { user } = useAuth();

    const fetchMessages = useCallback(async (reset: boolean = true) => {
        if (!thread.id) return;
        try {
            if (reset) {
                setIsLoading(true);
                offsetRef.current = 0;
            }
            setError(null);
            
            const fetchedMessages = await getMessagesByThread(
                thread.id,
                limitRef.current,
                reset ? 0 : offsetRef.current
            );
            
            // Normalize messages to ensure profile structure exists
            const normalizedMessages = fetchedMessages.map(msg => ({
                ...msg,
                sender: msg.sender ? {
                    ...msg.sender,
                    profile: msg.sender.profile || {
                        displayName: msg.sender.name,
                        avatarUrl: (msg.sender as any).avatarUrl || (msg.sender as any).image || (msg.sender as any).avatar || null
                    }
                } : {
                    id: 'unknown',
                    name: 'Unknown',
                    profile: { displayName: 'Unknown', avatarUrl: null }
                }
            }));

            if (reset) {
                setMessages(normalizedMessages);
                offsetRef.current = normalizedMessages.length;
            } else {
                setMessages(prev => [...normalizedMessages, ...prev]);
                offsetRef.current += normalizedMessages.length;
            }
            
            setHasMore(fetchedMessages.length === limitRef.current);
        } catch (err) {
            console.error('Failed to fetch messages:', err);
            setError('Failed to load messages. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [thread.id]);

    const loadMoreMessages = useCallback(async () => {
        if (isLoadingMore || !hasMore || isLoading) return;
        
        try {
            setIsLoadingMore(true);
            await fetchMessages(false);
        } catch (err) {
            console.error('Failed to load more messages:', err);
        } finally {
            setIsLoadingMore(false);
        }
    }, [fetchMessages, isLoadingMore, hasMore, isLoading]);

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
                content: pendingMsg.content,
                attachments: pendingMsg.attachments
            });
            console.log(`Message ${pendingMsg.tempId} sent, server returned:`, createdMessage.id);

            // Update UI immediately with the response from POST to fix "sending" state
            setMessages(prev => {
                const tempIndex = prev.findIndex(msg => msg.id === pendingMsg.tempId);
                if (tempIndex === -1) return prev;

                // Ensure the created message has the correct structure
                // If backend returns partial data, we might need to merge with local user data
                // But usually createMessage returns the full message object
                
                // We need to make sure we don't lose the sender info if the backend response is minimal
                const updatedMessage = {
                    ...createdMessage,
                    sender: createdMessage.sender || prev[tempIndex].sender
                };

                return [
                    ...prev.slice(0, tempIndex),
                    updatedMessage,
                    ...prev.slice(tempIndex + 1)
                ];
            });

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

    const handleSend = async (content: string, attachments?: MessageAttachment[]) => {
        if ((!content.trim() && !attachments?.length) || !user || !thread.id) return;

        const originalMessage = content.trim();
        const tempId = `temp-${Date.now()}`;

        const tempMessage: Message = {
            id: tempId,
            senderId: user.id,
            threadId: thread.id,
            content: originalMessage,
            attachments: attachments || null,
            createdAt: new Date().toISOString(),
            sender: {
                id: user.id,
                name: user.name,
                profile: {
                    displayName: user.profile?.displayName || user.name,
                    avatarUrl: user.profile?.avatarUrl || null
                }
            }
        };

        setMessages(prev => [...prev, tempMessage]);
        setError(null);

        pendingQueueRef.current.push({
            tempId,
            content: originalMessage,
            attachments,
            timestamp: Date.now(),
            retries: 0
        });

        processPendingQueue();
    };

    const handleNewMessage = useCallback((payload: any) => {
        console.log('[ChatView] 📨 New message received:', payload);
        
        // Ensure payload has necessary fields
        if (!payload || !payload.id) {
            console.warn('[ChatView] ⚠️ Invalid message payload:', payload);
            return;
        }

        const sender = payload.sender || payload.user;
        
        const newMessage: Message = {
            id: payload.id,
            senderId: payload.senderId || sender?.id,
            threadId: payload.threadId || payload.channelId,
            content: payload.content,
            attachments: payload.attachments || null,
            createdAt: payload.createdAt,
            sender: sender ? {
                id: sender.id,
                name: sender.name || sender.username || 'Unknown',
                profile: sender.profile || {
                    displayName: sender.displayName || sender.name,
                    avatarUrl: sender.avatarUrl || sender.image || sender.avatar || null
                }
            } : {
                id: 'unknown',
                name: 'Unknown',
                profile: { displayName: 'Unknown', avatarUrl: null }
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

        // Reset pagination state when thread changes
        offsetRef.current = 0;
        setHasMore(true);
        setIsLoadingMore(false);

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
        <View className="flex-1 bg-background-0 relative z-10">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-background-50 border-b border-outline-200">
                <View className="flex-row items-center">
                    {showBackButton && onBack && (
                        <View className="mr-3">
                            <Pressable onPress={onBack}>
                                <ArrowLeft size={20} color="rgb(var(--color-typography-600))" />
                            </Pressable>
                        </View>
                    )}
                    <View>
                        <Text className="font-bold text-typography-900 text-base">
                            {thread.name || 'Unknown Thread'}
                        </Text>
                        <Text className="text-xs text-typography-500">
                            {channel.name}
                        </Text>
                    </View>
                </View>
                <View className="flex-row items-center">
                    <Pressable className="p-2"><MoreVertical size={20} color="rgb(var(--color-typography-600))" /></Pressable>
                </View>
            </View>

            {/* Messages Area */}
            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="rgb(var(--color-brand-500))" />
                    <Text className="text-typography-500 mt-2">Loading messages...</Text>
                </View>
            ) : error ? (
                <View className="flex-1 items-center justify-center px-4">
                    <Text className="text-error-500 text-center mb-4">{error}</Text>
                    <Pressable
                        onPress={() => fetchMessages(true)}
                        className="bg-brand-500 px-4 py-2 rounded-lg active:bg-brand-600"
                    >
                        <Text className="text-white">Retry</Text>
                    </Pressable>
                </View>
            ) : messages.length === 0 ? (
                <View className="flex-1 items-center justify-center px-4">
                    <Text className="text-typography-500 text-center">
                        No messages yet. Start the conversation!
                    </Text>
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={[...messages].reverse()}
                    keyExtractor={(item) => item.id}
                    extraData={messages}
                    contentContainerStyle={{ paddingVertical: 16 }}
                    inverted={true}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        loadMoreMessages();
                    }}
                    ListFooterComponent={
                        isLoadingMore ? (
                            <View className="py-4 items-center">
                                <ActivityIndicator size="small" color="rgb(var(--color-brand-500))" />
                                <Text className="text-typography-500 text-xs mt-2">Loading more messages...</Text>
                            </View>
                        ) : !hasMore ? (
                            <View className="py-4 items-center">
                                <Text className="text-typography-500 text-xs">No more messages</Text>
                            </View>
                        ) : null
                    }
                    renderItem={({ item, index }) => {
                        const messageTime = new Date(item.createdAt);
                        const isPending = item.id.startsWith('temp-');
                        
                        // Since we're using inverted, we need to look at the next message (index + 1) for comparison
                        const reversedMessages = [...messages].reverse();
                        const nextMessage = reversedMessages[index + 1];
                        const isSameUser = nextMessage && nextMessage.senderId === item.senderId;
                        const timeDiff = nextMessage ? messageTime.getTime() - new Date(nextMessage.createdAt).getTime() : 0;
                        const isNear = Math.abs(timeDiff) < 5 * 60 * 1000; // 5 minutes
                        
                        const showHeader = !isSameUser || !isNear;

                        return (
                            <View 
                                key={item.id} 
                                className={`flex-row px-4 ${showHeader ? 'mt-4' : 'mt-0.5'} ${isPending ? 'opacity-60' : ''}`}
                            >
                                <View className="w-10 mr-3">
                                    {showHeader ? (
                                        <Avatar size="md" className="w-10 h-10 rounded-full">
                                            {item.sender?.profile?.avatarUrl ? (
                                                <AvatarImage 
                                                    source={{ uri: item.sender.profile.avatarUrl }} 
                                                    alt={item.sender.profile.displayName || item.sender.name || 'User'} 
                                                />
                                            ) : (
                                                <AvatarFallbackText>{item.sender?.profile?.displayName || item.sender?.name || 'User'}</AvatarFallbackText>
                                            )}
                                        </Avatar>
                                    ) : null}
                                </View>

                                <View className="flex-1">
                                    {showHeader && (
                                        <View className="flex-row items-baseline mb-1">
                                            <Text className="font-bold text-typography-900 mr-2 text-base">
                                                {item.sender?.profile?.displayName || item.sender?.name || 'Unknown User'}
                                            </Text>
                                            <Text className="text-xs text-typography-500">
                                                {messageTime.toLocaleDateString()} {messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Text>
                                        </View>
                                    )}

                                    <Text className="text-typography-800 text-base leading-6">
                                        {item.content}
                                    </Text>
                                    
                                    {/* Attachments */}
                                    {item.attachments && item.attachments.length > 0 && (
                                        <AttachmentsList attachments={item.attachments} />
                                    )}
                                    
                                    {isPending && (
                                        <Text className="text-[10px] text-typography-400 mt-1">Sending...</Text>
                                    )}
                                </View>
                            </View>
                        );
                    }}
                />
            )}

            <ChatInput onSend={handleSend} />
        </View>
    );
}
