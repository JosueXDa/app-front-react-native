import { Tabs } from 'expo-router';
import { Home, User } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

export function DashboardTabs() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: isDark ? '#111827' : '#ffffff',
                    borderTopColor: isDark ? '#1f2937' : '#e5e7eb',
                },
                tabBarActiveTintColor: '#00a884',
                tabBarInactiveTintColor: '#9ca3af',
            }}
        >
            <Tabs.Screen
                name="channels/me"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile/settings"
                options={{
                    title: 'You',
                    tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
                }}
            />
            {/* Ocultar otras rutas en las tabs */}
            <Tabs.Screen
                name="index"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="channels/[channelId]"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="profile/[userId]"
                options={{
                    href: null,
                }}
            />

            <Tabs.Screen
                name="channels/[channelId]/[threadId]"
                options={{
                    href: null,
                }}
            />

            <Tabs.Screen
                name="channels/[channelId]/index"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}
