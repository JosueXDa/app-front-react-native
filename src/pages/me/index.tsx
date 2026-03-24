import { MeChannelList, MeProfileHeader, MeStats, useMeData } from '@/src/features/me';
import React from 'react';
import { ScrollView } from 'react-native';

const MePage = () => {
  const { user, joinedChannels, isLoading, stats } = useMeData();

  return (
    <ScrollView className="flex-1 bg-background-0">
      <MeProfileHeader user={user} />
      <MeStats 
        channelsCount={stats.channelsCount} 
        messagesCount={stats.messagesCount} 
      />
      <MeChannelList 
        channels={joinedChannels} 
        isLoading={isLoading} 
      />
    </ScrollView>
  );
};

export default MePage;
