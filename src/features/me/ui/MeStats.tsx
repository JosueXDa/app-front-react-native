import React from 'react';
import { Text, View } from 'react-native';

interface MeStatsProps {
  channelsCount: number;
  messagesCount: number;
}

export const MeStats = ({ channelsCount, messagesCount }: MeStatsProps) => {
  return (
    <View className="flex-row justify-around py-6 bg-background-0 border-b border-outline-200">
      <View className="items-center">
        <Text className="text-2xl font-bold text-typography-900">
          {channelsCount}
        </Text>
        <Text className="text-sm text-typography-500">Channels</Text>
      </View>
      <View className="items-center">
        <Text className="text-2xl font-bold text-typography-900">
          {messagesCount}
        </Text>
        <Text className="text-sm text-typography-500">Messages</Text>
      </View>
    </View>
  );
};
