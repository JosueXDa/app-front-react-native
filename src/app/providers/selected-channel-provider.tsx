import { Channel } from '@/src/entities/channel';
import { createContext, PropsWithChildren, useContext, useState } from 'react';

interface SelectedChannelContextValue {
  selectedChannel: Channel | null;
  setSelectedChannel: (channel: Channel | null) => void;
}

const SelectedChannelContext = createContext<SelectedChannelContextValue | undefined>(undefined);

export function SelectedChannelProvider({ children }: PropsWithChildren) {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  return <SelectedChannelContext.Provider value={{ selectedChannel, setSelectedChannel }}>{children}</SelectedChannelContext.Provider>;
}

export function useSelectedChannel() {
  const context = useContext(SelectedChannelContext);
  if (!context) {
    throw new Error('useSelectedChannel must be used within a SelectedChannelProvider');
  }
  return context;
}
