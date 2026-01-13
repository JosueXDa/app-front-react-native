import { Channel } from '@/lib/api/chat';

export interface ChannelContextType {
	joinedChannels: Channel[];
	refreshChannels: () => Promise<void>;
	isLoading: boolean;
}
