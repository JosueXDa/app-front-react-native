import { Tabs } from 'expo-router';
import { Compass, MessageCircle } from 'lucide-react-native';
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
                tabBarActiveTintColor: '#2563eb', // blue-600
                tabBarInactiveTintColor: '#9ca3af', // gray-400
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Chats',
                    tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color, size }) => <Compass size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="chat/[id]"
                options={{
                    href: null,
                    tabBarStyle: { display: 'none' },
                }}
            />
            <Tabs.Screen
                name="perfil"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}
