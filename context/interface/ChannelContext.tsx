import { Channel } from '@/src/entities/channel';

export interface ChannelContextType {
	joinedChannels: Channel[];
	refreshChannels: () => Promise<void>;
	isLoading: boolean;
}
