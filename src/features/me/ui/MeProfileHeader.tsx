import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/src/entities/user/model/user.types';
import React from 'react';
import { ImageBackground, Text, View } from 'react-native';

interface MeProfileHeaderProps {
  user: User | null;
}

export const MeProfileHeader = ({ user }: MeProfileHeaderProps) => {
  return (
    <ImageBackground
      source={{ uri: user?.profile?.bannerUrl || undefined }}
      resizeMode='cover'
      className='w-full h-40 px-4 py-6 bg-brand-600'
    >
      <View className="flex-row items-center">
        <Avatar size='xl'>
          <AvatarImage source={{ uri: user?.profile?.avatarUrl || undefined }} />
          <AvatarFallbackText>{user?.profile?.displayName || user?.name || 'UNDF'}</AvatarFallbackText>
        </Avatar>
        <View className="ml-4">
          <Text className="text-white text-2xl font-bold">
            {user?.profile?.displayName || user?.name || 'User'}
          </Text>
          <Text className="text-white/80 text-sm">
            Welcome back!
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};
