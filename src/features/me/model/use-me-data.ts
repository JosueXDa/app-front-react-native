import { useAuth } from '@/context/AuthContext';
import { useChannels } from '@/context/ChannelContex';

export const useMeData = () => {
  const { user } = useAuth();
  const { joinedChannels, isLoading } = useChannels();

  return {
    user,
    joinedChannels,
    isLoading,
    stats: {
      channelsCount: joinedChannels.length,
      messagesCount: 0, // Placeholder
    },
  };
};
