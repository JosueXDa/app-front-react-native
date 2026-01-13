import { Channel, getUserChannels } from '@/lib/api/chat';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { ChannelContextType } from './interface/ChannelContext';

const ChannelContext = createContext<ChannelContextType>({} as ChannelContextType);

export function ChannelProvider({ children }: PropsWithChildren) {
    const [joinedChannels, setJoinedChannels] = useState<Channel[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refreshChannels = async () => {
        try {
            setIsLoading(true);
            const channels = await getUserChannels();
            setJoinedChannels(channels);
        } catch (error) {
            console.error('Error refreshing channels:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshChannels();
    }, []);

    return (
        <ChannelContext.Provider value={{ joinedChannels, refreshChannels, isLoading }}>
            {children}
        </ChannelContext.Provider>
    );
}

export function useChannels() {
    return useContext(ChannelContext);
}
