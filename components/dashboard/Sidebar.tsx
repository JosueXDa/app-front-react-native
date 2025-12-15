import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { useChannels } from '@/context/ChannelContex';
import { Channel } from '@/lib/api/chat';
import { useRouter } from 'expo-router';
import { Compass, MessageCircle, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { CreateChannelModal } from '../newChannel/CreateChannelModal';

interface SidebarProps {
    selectedChannelId?: string;
    onSelectChannel: (channel: Channel) => void;
}

export function Sidebar({ selectedChannelId, onSelectChannel }: SidebarProps) {
    const { joinedChannels, isLoading } = useChannels();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const router = useRouter();

    const handleChannelPress = (channel: Channel) => {
        onSelectChannel(channel);
        router.push(`/channels/${channel.id}`);
    };

    if (isLoading) {
        return (
            <View className="w-20 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 items-center py-4">
                <ActivityIndicator size="small" color="#00a884" />
            </View>
        );
    }

    return (
        <View className="w-20 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
            <ScrollView
                contentContainerStyle={{ paddingVertical: 16 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Action Buttons */}
                <View className="items-center mb-4 border-b border-gray-200 dark:border-gray-800 pb-4">
                    {/* mee button*/}
                    <Pressable
                        onPress={() => router.push('/channels/me')}
                        className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center active:opacity-70 mb-3"
                    >
                        <MessageCircle size={24} color="#6b7280" />
                    </Pressable>
                    
                    
                    {/* Explore Button */}
                    <Pressable
                        onPress={() => router.push('/explore')}
                        className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center active:opacity-70 mb-3"
                    >
                        <Compass size={24} color="#6b7280" />
                    </Pressable>

                    {/* New Channel Button */}
                    <Pressable
                        onPress={() => setShowCreateModal(true)}
                        className="w-12 h-12 rounded-full bg-[#00a884] items-center justify-center active:opacity-70"
                    >
                        <Plus size={24} color="white" />
                    </Pressable>
                </View>

                {/* Channels List */}
                {joinedChannels.length === 0 ? (
                    <View className="items-center justify-center py-8 px-2">
                        <Text className="text-xs text-gray-400 dark:text-gray-500 text-center">
                            No channels
                        </Text>
                    </View>
                ) : (
                    <View className="items-center">
                        {joinedChannels.map((item) => (
                            <Pressable
                                key={item.id}
                                onPress={() => handleChannelPress(item)}
                                className={`relative active:opacity-70 mb-3 ${
                                    selectedChannelId === item.id ? 'opacity-100' : 'opacity-80'
                                }`}
                            >
                                <Avatar size="md">
                                    {item.imageUrl ? (
                                        <AvatarImage source={{ uri: item.imageUrl }} alt={item.name} />
                                    ) : (
                                        <AvatarFallbackText>{item.name}</AvatarFallbackText>
                                    )}
                                </Avatar>
                                {selectedChannelId === item.id && (
                                    <View className="absolute -right-1 top-0 w-3 h-3 rounded-full bg-[#00a884] border-2 border-white dark:border-gray-900" />
                                )}
                            </Pressable>
                        ))}
                    </View>
                )}
            </ScrollView>
            {showCreateModal && (
                <CreateChannelModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                />
            )}
        </View>
    );
}
