import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { useSelectedChannel } from '@/context/SelectedChannelContext';
import { Channel, Message, createMessage, getMessages } from '@/lib/api/chat';
import { wsManager } from '@/lib/api/ws';
import { ArrowLeft, MoreVertical, Send } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';

interface ChatWindowProps {
    channel: Channel;
}

interface PendingMessage {
    tempId: string;
    content: string;
    timestamp: number;
    retries: number;
}

export function ChatWindow({ channel }: ChatWindowProps) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Cola de mensajes pendientes (máximo 1 envío simultáneo)
    const pendingQueueRef = useRef<PendingMessage[]>([]);
    const isSendingRef = useRef(false);
    const flatListRef = useRef<FlatList>(null); // 📌 Añadir ref para scroll
    
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

    /**
     * Server-Driven State Synchronization Strategy
     * 1. Client envía mensaje al servidor SOLAMENTE
     * 2. Servidor guarda en BD y emite por WebSocket
     * 3. Cliente actualiza estado SOLO cuando recibe confirmación del servidor
     * 4. WebSocket es la única fuente de verdad para nuevos mensajes
     */
    const processPendingQueue = useCallback(async () => {
        if (isSendingRef.current || pendingQueueRef.current.length === 0 || !user) {
            return;
        }

        isSendingRef.current = true;
        const pendingMsg = pendingQueueRef.current.shift();

        if (!pendingMsg) {
            isSendingRef.current = false;
            return;
        }

        try {
            // SOLO enviamos al servidor, sin actualizar UI
            const createdMessage = await createMessage({
                channelId: channel.id,
                content: pendingMsg.content
            });

            // El servidor debería emitir el mensaje por WebSocket
            // que luego será recibido por handleNewMessage
            console.log(`Message ${pendingMsg.tempId} sent, server returned:`, createdMessage.id);
        } catch (err) {
            console.error(`Failed to send message ${pendingMsg.tempId}:`, err);
            
            // Reintentar hasta 3 veces con backoff exponencial
            if (pendingMsg.retries < 3) {
                pendingMsg.retries++;
                const delayMs = Math.pow(2, pendingMsg.retries) * 1000;
                setTimeout(() => {
                    pendingQueueRef.current.push(pendingMsg);
                    processPendingQueue();
                }, delayMs);
            } else {
                // Después de 3 reintentos, mostrar error
                setError(`Failed to send: "${pendingMsg.content}". Check your connection.`);
                // Opcionalmente remover del mensaje pendiente de la UI
                setMessages(prev => 
                    prev.filter(msg => msg.id !== pendingMsg.tempId)
                );
            }
        } finally {
            isSendingRef.current = false;
            // Procesar el siguiente mensaje en la cola
            if (pendingQueueRef.current.length > 0) {
                setTimeout(() => processPendingQueue(), 100);
            }
        }
    }, [channel.id, user]);

    const handleSend = async () => {
        if (!message.trim() || !user) return;

        const originalMessage = message.trim();
        const tempId = `temp-${Date.now()}`;

        // SOLAMENTE agregar a UI de forma temporal
        const tempMessage: Message = {
            id: tempId,
            senderId: user.id,
            channelId: channel.id,
            content: originalMessage,
            createdAt: new Date().toISOString(),
            sender: {
                id: user.id,
                name: user.name,
                image: user.image
            }
        };

        // 1. Limpiar input inmediatamente
        setMessage('');

        // 2. Mostrar mensaje temporal en la UI
        setMessages(prev => [...prev, tempMessage]);
        setError(null);

        // 3. Agregar a la cola de envío
        pendingQueueRef.current.push({
            tempId,
            content: originalMessage,
            timestamp: Date.now(),
            retries: 0
        });

        // 4. Procesar la cola
        processPendingQueue();
    };

    /**
     * Este handler es la ÚNICA forma en que los mensajes nuevos llegan a la UI
     * después del envío inicial
     */
    const handleNewMessage = useCallback((newMessage: Message) => {
        console.log('[ChatWindow] 📨 New message received:', newMessage.id);
        setMessages(prev => {
            // 1. Verificar duplicado por ID real
            if (prev.some(msg => msg.id === newMessage.id)) {
                console.log('[ChatWindow] ⚠️ Message already exists, skipping');
                return prev;
            }

            // 2. Buscar mensaje temporal para reemplazar
            // 🔥 FIX: Buscar SOLO por senderId y content (ignorar timestamp)
            const tempIndex = prev.findIndex(
                msg => msg.id.startsWith('temp-') && 
                msg.senderId === newMessage.senderId &&
                msg.content.trim() === newMessage.content.trim()
            );

            if (tempIndex !== -1) {
                console.log('[ChatWindow] ✅ Replacing temp:', prev[tempIndex].id, '→', newMessage.id);
                // IMPORTANTE: Crear nuevo array inmutable
                return [
                    ...prev.slice(0, tempIndex),
                    newMessage,
                    ...prev.slice(tempIndex + 1)
                ];
            }

            // 3. Es un mensaje completamente nuevo (de otros usuarios)
            console.log('[ChatWindow] ➕ Adding new message from other user');
            const updated = [...prev, newMessage];
            
            // 📌 Auto-scroll si es del usuario actual
            if (newMessage.senderId === user?.id) {
                setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }
            
            return updated;
        });
    }, [user?.id]);

    // Setup WebSocket handlers - Subscribe to channel and listen for messages
    useEffect(() => {
        let cleanup: (() => void) | null = null;
        let messageHandlerRef: ((data: any) => void) | null = null;

        const setupWebSocket = async () => {
            try {
                // 1. Asegurar que WebSocket está conectado
                await wsManager.connect();

                // 2. Suscribirse al canal específico
                console.log(`[WebSocket] Joining channel: ${channel.id}`);
                wsManager.sendMessage('JOIN_CHANNEL', {
                    channelId: channel.id
                });

                // 3. 🔥 FIX: Crear handler UNA SOLA VEZ y guardarlo en ref
                messageHandlerRef = (data: any) => {
                    // 🔥 Probar diferentes estructuras posibles del backend
                    let message = null;
                    let receivedChannelId = null;
                    
                    // Opción 1: data = { message, channelId }
                    if (data.message && data.channelId) {
                        message = data.message;
                        receivedChannelId = data.channelId;
                    }
                    // Opción 2: data = mensaje directo (sin wrapper)
                    else if (data.id && data.content && data.senderId) {
                        message = data;
                        receivedChannelId = data.channelId;
                    }
                    
                    // Validar que sea un mensaje para este canal
                    if (receivedChannelId === channel.id && message) {
                        console.log(`[ChatWindow] ✅ Message for this channel`);
                        handleNewMessage(message);
                    }
                };

                wsManager.on('NEW_MESSAGE', messageHandlerRef);

                cleanup = () => {
                    // Cleanup: desuscribirse del canal
                    console.log(`[WebSocket] Leaving channel: ${channel.id}`);
                    if (messageHandlerRef) {
                        wsManager.off('NEW_MESSAGE', messageHandlerRef);
                    }
                    wsManager.sendMessage('LEAVE_CHANNEL', {
                        channelId: channel.id
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
    }, [channel.id, handleNewMessage, fetchMessages]);

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
                    <View className="mr-3">
                        <Avatar size="md">
                            {channel.imageUrl ? (
                                <AvatarImage source={{ uri: channel.imageUrl }} alt={channel.name} />
                            ) : (
                                <AvatarFallbackText>{channel.name}</AvatarFallbackText>
                            )}
                        </Avatar>
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
                    extraData={messages} // � FIX: Pasar todo el array, no solo length
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
