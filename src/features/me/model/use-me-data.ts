import { useAuth } from '@/src/app/providers/auth-provider';
import { useChannels } from '@/src/app/providers/channel-provider';

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
