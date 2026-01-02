import { useTheme } from '@/context/ThemeContext';
import { Tabs } from 'expo-router';
import { Home, User } from 'lucide-react-native';

export function DashboardTabs() {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: isDark ? 'rgb(var(--color-background-0))' : 'rgb(var(--color-background-0))',
                    borderTopColor: isDark ? 'rgb(var(--color-outline-200))' : 'rgb(var(--color-outline-200))',
                },
                tabBarActiveTintColor: 'rgb(var(--color-brand-500))',
                tabBarInactiveTintColor: 'rgb(var(--color-typography-400))',
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
