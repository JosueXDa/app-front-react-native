import { useAuth } from '@/src/app/providers';
import { useChannels } from '@/src/app/providers';

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
