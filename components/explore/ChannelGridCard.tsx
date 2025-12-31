import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Channel } from '@/lib/api/chat';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface ChannelGridCardProps {
    channel: Channel;
    onPress: () => void;
}

export function ChannelGridCard({ channel, onPress }: ChannelGridCardProps) {
    const listCategories = channel.category ? channel.category.split(', ') : ['General'];

    return (
        <Pressable onPress={onPress}>
            <Card 
                variant="elevated" 
                size="md"
                className="bg-white dark:bg-gray-800 overflow-hidden"
            >
                {/* Image Section */}
                <View className="items-center pt-4 pb-3">
                    <Avatar size="xl">
                        {channel.imageUrl ? (
                            <AvatarImage 
                                source={{ uri: channel.imageUrl }} 
                                alt={channel.name} 
                            />
                        ) : (
                            <AvatarFallbackText>{channel.name}</AvatarFallbackText>
                        )}
                    </Avatar>
                </View>

                {/* Content Section */}
                <View className="px-4 pb-4">
                    {/* Channel Name */}
                    <Text 
                        className="text-base font-semibold text-gray-900 dark:text-white text-center mb-2"
                        numberOfLines={1}
                    >
                        {channel.name}
                    </Text>

                    {/* Categories */}
                    <View className="flex-row flex-wrap justify-center gap-2">
                        <View className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                            <Text className="text-xs text-gray-600 dark:text-gray-300">
                                {channel.isPrivate ? '🔒 Privado' : '🌍 Público'}
                            </Text>
                        </View>
                        {channel.category && listCategories.map((category, index) => (
                                <View 
                                key={index}
                                className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full">
                                    <Text className="text-xs text-blue-700 dark:text-blue-300">
                                        {category}
                                    </Text>
                                </View>
                            ))
                        }
                    </View>
                </View>
            </Card>
        </Pressable>
    );
}
