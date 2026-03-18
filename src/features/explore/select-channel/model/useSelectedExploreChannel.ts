import { Channel } from '@/src/entities/channel';
import { useCallback, useState } from 'react';

type UseSelectedExploreChannelReturn = {
  selectedChannel: Channel | null;
  isModalOpen: boolean;
  handleChannelPress: (channel: Channel) => void;
  handleCloseModal: () => void;
};

export function useSelectedExploreChannel(): UseSelectedExploreChannelReturn {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChannelPress = useCallback((channel: Channel) => {
    setSelectedChannel(channel);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedChannel(null);
  }, []);

  return {
    selectedChannel,
    isModalOpen,
    handleChannelPress,
    handleCloseModal,
  };
}
