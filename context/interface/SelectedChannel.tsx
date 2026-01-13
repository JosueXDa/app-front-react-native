import { Channel } from '@/lib/api/chat';

export interface SelectedChannelContextType {
	selectedChannel: Channel | null;
	setSelectedChannel: (channel: Channel | null) => void;
}
