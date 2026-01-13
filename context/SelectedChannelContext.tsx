import { Channel } from "@/lib/api/chat";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { SelectedChannelContextType } from './interface/SelectedChannel';

const SelectedChannelContext = createContext<SelectedChannelContextType>({} as SelectedChannelContextType);

export function SelectedChannelProvider({ children }: PropsWithChildren) {
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

    return (
        <SelectedChannelContext.Provider value={{ selectedChannel, setSelectedChannel }}>
            {children}
        </SelectedChannelContext.Provider>
    );
}

export function useSelectedChannel() {
    const context = useContext(SelectedChannelContext);
    if (!context) {
        throw new Error('useSelectedChannel must be used within a SelectedChannelProvider');
    }
    return context;
}