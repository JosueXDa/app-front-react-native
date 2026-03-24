import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Channel } from '@/src/entities/channel/model/channel.types';
import { useRouter } from 'expo-router';
import { Compass, MessageCircle } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

interface MeChannelListProps {
  channels: Channel[];
  isLoading: boolean;
}

export const MeChannelList = ({ channels, isLoading }: MeChannelListProps) => {
  const router = useRouter();

  return (
    <View className="p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold text-typography-900">
          Your Channels
        </Text>
        <Pressable onPress={() => router.push('/explore')}>
          <Text className="text-brand-500 font-medium">See All</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View className="py-8 items-center">
          <ActivityIndicator size="large" color="rgb(var(--color-brand-500))" />
        </View>
      ) : channels.length === 0 ? (
        <View className="bg-background-50 rounded-lg p-6 items-center">
          <View className="bg-brand-100 dark:bg-brand-900 p-4 rounded-full mb-4">
            <MessageCircle size={48} color="rgb(var(--color-brand-500))" />
          </View>
          <Text className="text-typography-600 text-center mt-4 mb-2 font-medium">
            You haven&apos;t joined any channels yet
          </Text>
          <Pressable
            onPress={() => router.push('/explore')}
            className="bg-brand-500 px-6 py-3 rounded-full mt-4 active:bg-brand-600"
          >
            <View className="flex-row items-center">
              <Compass size={18} color="white" />
              <Text className="text-white font-medium ml-2">Explore Channels</Text>
            </View>
          </Pressable>
        </View>
      ) : (
        <View>
          {channels.slice(0, 5).map((channel) => (
            <Pressable
              key={channel.id}
              onPress={() => router.push(`/channels/${channel.id}`)}
              className="flex-row items-center p-3 bg-background-0 rounded-lg mb-2 border border-outline-200 active:bg-background-50"
            >
              <Avatar size="md" >
                <AvatarImage source={{ uri: channel.imageUrl || undefined }} />
                <AvatarFallbackText>{channel.name}</AvatarFallbackText>
              </Avatar>
              <View className="ml-3 flex-1">
                <Text className="font-semibold text-typography-900">
                  {channel.name}
                </Text>
                <Text className="text-sm text-typography-500" numberOfLines={1}>
                  {channel.description || 'No description'}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};
