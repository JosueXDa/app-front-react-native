import { Channel } from '@/src/entities/channel';

export interface SelectedChannelContextType {
	selectedChannel: Channel | null;
	setSelectedChannel: (channel: Channel | null) => void;
}
