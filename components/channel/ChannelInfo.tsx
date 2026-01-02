import { ChannelSettingsMenu } from '@/components/channel-settings';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Channel } from '@/lib/api/chat';
import { Hash, Lock, User } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

interface ChannelInfoProps {
    channel: Channel;
    memberCount?: number;
    onChannelUpdate?: (channel: Channel) => void;
}

export function ChannelInfo({ channel, memberCount, onChannelUpdate }: ChannelInfoProps) {
    const listCategories = channel.category ? channel.category.split(', ') : ['General'];


    return (
        <>
            <View className="p-4 border-b border-gray-200 dark:border-gray-700">
                <View className="flex-row items-center mb-3">
                    {channel.imageUrl ? (
                        <View className="mr-3">
                            <Avatar size="lg">
                                <AvatarImage source={{ uri: channel.imageUrl }} alt={channel.name} />
                            </Avatar>
                        </View>
                    ) : (
                        <View className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center mr-3">
                            {channel.isPrivate ? (
                                <Lock size={24} color="#6366f1" />
                            ) : (
                                <Hash size={24} color="#6366f1" />
                            )}
                        </View>
                    )}
                    <View className="flex-1">
                        <Text className="text-xl font-bold text-gray-900 dark:text-white">
                            {channel.name}
                        </Text>
                        {memberCount !== undefined && (
                            <View className="flex-row items-center mt-1">
                                <User size={14} color="#6b7280" />
                                <Text className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                                    {memberCount} {memberCount === 1 ? 'miembro' : 'miembros'}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Settings Menu */}
                    <ChannelSettingsMenu channel={channel} onChannelUpdate={onChannelUpdate} />
                </View>
                
                {channel.description && (
                    <Text className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {channel.description}
                    </Text>
                )}
                
                {channel.category && (
                    <View className="flex-row items-center">
                            {listCategories.map((category, index) => (
                                <View key={index} className="bg-primary-100 dark:bg-primary-900 px-2 py-1 mr-2 rounded">
                                    <Text className="text-xs font-medium text-primary-700 dark:text-primary-300">
                                        {category}
                                    </Text>
                                </View>
                            ))}
                    </View>
                )}
            </View>
        </>
    );
}
