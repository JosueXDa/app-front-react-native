import { ChannelInfo } from '@/components/channel/ChannelInfo';
import { ChatView } from '@/components/channel/ChatView';
import { CreateThreadModal } from '@/components/channel/CreateThreadModal';
import { ThreadList } from '@/components/channel/ThreadList';
import { useAuth } from '@/context/AuthContext';
import { useSelectedChannel } from '@/context/SelectedChannelContext';
import {
    Channel,
    getActiveThreadsByChannel,
    getChannelById,
    getChannelMembers,
    getMemberRole,
    Thread
} from '@/lib/api/chat';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, useWindowDimensions, View } from 'react-native';

export default function ChannelScreen() {
    const { channelId } = useLocalSearchParams<{ channelId: string }>();
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isDesktop = width >= 768;
    
    const { selectedChannel, setSelectedChannel } = useSelectedChannel();
    const [channel, setChannel] = useState<Channel | null>(null);
    const [threads, setThreads] = useState<Thread[]>([]);
    const [memberCount, setMemberCount] = useState<number>(0);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingThreads, setIsLoadingThreads] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    // Estado para manejar el thread seleccionado en desktop
    const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
    
    const { user } = useAuth();

    const handleBack = () => {
        router.back();
    };

    // Fetch channel data - Solo se ejecuta cuando cambia channelId
    useEffect(() => {
        const fetchChannel = async () => {
            if (!channelId) return;
            
            try {
                setIsLoading(true);
                setError(null);
                
                // Primero intentar usar el canal del contexto si coincide
                if (selectedChannel?.id === channelId) {
                    setChannel(selectedChannel);
                    console.log('[ChannelScreen] Using channel from context:', selectedChannel.name);
                } else {
                    // Si no coincide, buscar el canal
                    console.log('[ChannelScreen] Fetching channel data for:', channelId);
                    const fetchedChannel = await getChannelById(channelId);
                    setChannel(fetchedChannel);
                    
                    // Solo actualizar el contexto si es diferente al actual
                    if (selectedChannel?.id !== fetchedChannel.id) {
                        setSelectedChannel(fetchedChannel);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch channel:', err);
                setError('Failed to load channel.');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchChannel();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channelId]); // Intencionalmente solo channelId para evitar ciclos de actualización

    // Fetch channel members and check admin role
    useEffect(() => {
        const fetchMemberInfo = async () => {
            if (!channelId || !user) return;
            
            try {
                // Get member count
                const members = await getChannelMembers(channelId);
                setMemberCount(members.length);
                
                // Check if current user is admin
                const role = await getMemberRole(channelId, user.id);
                setIsAdmin(role === 'admin' || role === 'owner');
            } catch (err) {
                console.error('Failed to fetch member info:', err);
            }
        };
        
        fetchMemberInfo();
    }, [channelId, user]);

    // Fetch threads
    const fetchThreads = useCallback(async () => {
        if (!channelId) return;
        
        try {
            setIsLoadingThreads(true);
            const fetchedThreads = await getActiveThreadsByChannel(channelId);
            setThreads(fetchedThreads);
        } catch (err) {
            console.error('Failed to fetch threads:', err);
        } finally {
            setIsLoadingThreads(false);
        }
    }, [channelId]);

    useEffect(() => {
        fetchThreads();
    }, [fetchThreads]);

    // Sincronizar el estado local cuando cambie el contexto
    useEffect(() => {
        if (selectedChannel?.id === channelId) {
            console.log('[ChannelScreen] Syncing channel from context:', selectedChannel.name);
            setChannel(selectedChannel);
        }
    }, [selectedChannel, channelId]);

    const handleThreadPress = async (thread: Thread) => {
        if (isDesktop) {
            // En desktop, actualizar el estado local
            setSelectedThread(thread);
        } else {
            // En mobile, navegar a la ruta
            router.push(`/(app)/channels/${channelId}/${thread.id}`);
        }
    };

    const handleCreateThread = () => {
        setIsCreateModalOpen(true);
    };

    const handleThreadCreated = () => {
        fetchThreads();
    };

    const handleChannelUpdate = (updatedChannel: Channel) => {
        console.log('[ChannelScreen] Channel updated:', updatedChannel.name);
        setChannel(updatedChannel);
        // Actualizar contexto si coincide
        if (selectedChannel?.id === updatedChannel.id) {
            setSelectedChannel(updatedChannel);
        }
    };

    if (isLoading) {
        return (
            <View className="flex-1 bg-white dark:bg-gray-900 items-center justify-center">
                <ActivityIndicator size="large" color="#6366f1" />
                <Text className="text-gray-600 dark:text-gray-400 mt-2">
                    Cargando canal...
                </Text>
            </View>
        );
    }

    if (error || !channel) {
        return (
            <View className="flex-1 bg-white dark:bg-gray-900 items-center justify-center p-4">
                <Text className="text-red-500 text-center mb-4">
                    {error || 'Canal no encontrado'}
                </Text>
                <Pressable 
                    onPress={handleBack}
                    className="bg-primary-500 px-4 py-2 rounded"
                >
                    <Text className="text-white font-medium">Volver</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View className={`flex-1 bg-white dark:bg-gray-900 ${isDesktop ? 'flex-row' : ''}`}>
            {/* Header - Only show on mobile */}
            {!isDesktop && (
                <View className="flex-row items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <Pressable
                        onPress={handleBack}
                        className="mr-3 p-2 rounded-full active:bg-gray-100 dark:active:bg-gray-800"
                    >
                        <ArrowLeft size={24} color="#6b7280" />
                    </Pressable>
                    <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                        Información del Canal
                    </Text>
                </View>
            )}

            {/* Channel Info + Thread List - Desktop: 1/5 del espacio restante (20%), Mobile: 100% */}
            <View 
                className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700"
                style={isDesktop ? { width: '30%' } : { flex: 1 }}
            >
                <ChannelInfo 
                    channel={channel} 
                    memberCount={memberCount}
                    onChannelUpdate={handleChannelUpdate}
                />
                
                <ThreadList
                    threads={threads}
                    isLoading={isLoadingThreads}
                    isAdmin={isAdmin}
                    onThreadPress={handleThreadPress}
                    onCreateThread={handleCreateThread}
                />
            </View>

            {/* Chat Area - Desktop: 4/5 del espacio restante (80%), Mobile: not rendered */}
            {isDesktop && (
                <View className="flex-1">
                    {selectedThread && channel ? (
                        <ChatView
                            channel={channel}
                            thread={selectedThread}
                            showBackButton={false}
                        />
                    ) : (
                        <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
                            <Text className="text-gray-500 dark:text-gray-400 text-center px-8">
                                Selecciona un thread para comenzar la conversación
                            </Text>
                        </View>
                    )}
                </View>
            )}

            {/* Create Thread Modal */}
            <CreateThreadModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                channelId={channelId || ''}
                onThreadCreated={handleThreadCreated}
            />
        </View>
    );
}
