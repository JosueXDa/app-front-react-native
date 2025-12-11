import { Navbar } from '@/components/dashboard/Navbar';
import { DashboardTabs } from '@/components/dashboard/Tabs';
import { ChannelProvider } from '@/context/ChannelContex';
import { SelectedChannelProvider } from '@/context/SelectedChannelContext';
import { Slot } from 'expo-router';
import { useWindowDimensions, View } from 'react-native';

export default function AppLayout() {
    const { width } = useWindowDimensions();
    const isDesktop = width >= 768; // md breakpoint

    return (
        <SelectedChannelProvider>
            <ChannelProvider>
                <>
                    <Navbar isDesktop={isDesktop} />
                    {isDesktop ? (
                        <View className='flex-1 bg-gray-50 dark:bg-gray-900'>
                            <View className='flex-1'>
                                <Slot />
                            </View>
                        </View>
                    ) : (
                        <DashboardTabs />
                    )}
                </>
            </ChannelProvider>
        </SelectedChannelProvider>
    );
}