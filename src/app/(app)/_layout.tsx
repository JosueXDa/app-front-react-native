import { Sidebar, UserBar } from '@/src/widgets/app-shell';
import { ChannelProvider } from '@/src/app/providers/channel-provider';
import { SelectedChannelProvider, useSelectedChannel } from '@/src/app/providers/selected-channel-provider';
import { Channel } from '@/src/entities/channel';
import { Slot } from 'expo-router';
import { View } from 'react-native';

function AppLayoutContent() {
    const { selectedChannel, setSelectedChannel } = useSelectedChannel();

    const handleSelectChannel = (channel: Channel) => {
        setSelectedChannel(channel);
    };

    return (
        <View className="flex-1 flex-row bg-background-0">
            {/* Sidebar - 1/6 del viewport */}
            <View>
                <Sidebar
                    selectedChannelId={selectedChannel?.id}
                    onSelectChannel={handleSelectChannel}
                />
            </View>
            {/* Main Content - 5/6 del viewport (resto de espacio) */}
            <View className="flex-1 flex-col">
                <View className="flex-1">
                    <Slot />
                </View>
            </View>
            <UserBar />
        </View>
    );
}

export default function AppLayout() {
    return (
        <SelectedChannelProvider>
            <ChannelProvider>
                <AppLayoutContent />
            </ChannelProvider>
        </SelectedChannelProvider>
    );
}
