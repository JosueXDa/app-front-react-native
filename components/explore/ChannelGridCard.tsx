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
                className="bg-background-0 overflow-hidden border border-outline-200"
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
                        className="text-base font-semibold text-typography-900 text-center mb-2"
                        numberOfLines={1}
                    >
                        {channel.name}
                    </Text>

                    {/* Categories */}
                    <View className="flex-row flex-wrap justify-center gap-2">
                        <View className="bg-background-50 px-2 py-1 rounded-full">
                            <Text className="text-xs text-typography-600">
                                {channel.isPrivate ? '🔒 Privado' : '🌍 Público'}
                            </Text>
                        </View>
                        {channel.category && listCategories.map((category, index) => (
                                <View 
                                key={index}
                                className="bg-brand-100 dark:bg-brand-900 px-2 py-1 rounded-full">
                                    <Text className="text-xs text-brand-700 dark:text-brand-300">
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
