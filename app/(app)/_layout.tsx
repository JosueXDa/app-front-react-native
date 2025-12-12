import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardTabs } from '@/components/dashboard/Tabs';
import { ChannelProvider } from '@/context/ChannelContex';
import { SelectedChannelProvider, useSelectedChannel } from '@/context/SelectedChannelContext';
import { Channel } from '@/lib/api/chat';
import { Slot } from 'expo-router';
import { useWindowDimensions, View } from 'react-native';

function AppLayoutContent() {
    const { width } = useWindowDimensions();
    const isDesktop = width >= 768; // md breakpoint
    const { selectedChannel, setSelectedChannel } = useSelectedChannel();

    const handleSelectChannel = (channel: Channel) => {
        setSelectedChannel(channel);
    };

    if (isDesktop) {
        return (
            <View className="flex-1 flex-row bg-gray-50 dark:bg-gray-900">
                {/* Sidebar */}
                <Sidebar
                    selectedChannelId={selectedChannel?.id}
                    onSelectChannel={handleSelectChannel}
                />
                {/* Main Content */}
                <View className="flex-1">
                    <Slot />
                </View>
            </View>
        );
    }

    // Mobile: Tabs with integrated Sidebar
    return (
        <View className="flex-1 flex-row">
            {/* Sidebar para mobile */}
            <Sidebar
                selectedChannelId={selectedChannel?.id}
                onSelectChannel={handleSelectChannel}
            />
            {/* Main Content with Tabs */}
            <View className="flex-1">
                <DashboardTabs />
            </View>
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