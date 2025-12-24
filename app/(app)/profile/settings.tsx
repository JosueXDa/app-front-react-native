import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { LogOut, Moon, Sun, User } from 'lucide-react-native';
import { Pressable, ScrollView, Switch, Text, useColorScheme, View } from 'react-native';

export default function SettingsScreen() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const handleLogout = async () => {
        await signOut();
        router.replace('/login');
    };

    return (
        <ScrollView className="flex-1 bg-white dark:bg-gray-900">
            {/* Header */}
            <View className="bg-[#00a884] pt-12 pb-8 px-6">
                <Text className="text-white text-2xl font-bold mb-2">Settings</Text>
                <Text className="text-white/80 text-sm">Manage your account and preferences</Text>
            </View>

            {/* Profile Section */}
            <View className="bg-white dark:bg-gray-800 m-4 rounded-lg p-4 shadow-sm">
                <View className="flex-row items-center mb-4">
                    <Avatar size="md">
                        {user?.image ? (
                            <AvatarImage source={{ uri: user.image }} alt={user.name || 'User'} />
                        ) : (
                            <AvatarFallbackText>{user?.name || 'User'}</AvatarFallbackText>
                        )}
                    </Avatar>
                    <View className="ml-4 flex-1">
                        <Text className="text-lg font-bold text-gray-900 dark:text-white">
                            {user?.name || 'User'}
                        </Text>
                        <Text className="text-sm text-gray-500 dark:text-gray-400">
                            {user?.email || 'user@example.com'}
                        </Text>
                    </View>
                </View>

                <Pressable
                    onPress={() => router.push(`/profile/${user?.id}`)}
                    className="flex-row items-center justify-between py-3 border-t border-gray-200 dark:border-gray-700"
                >
                    <View className="flex-row items-center">
                        <User size={20} color="#6b7280" />
                        <Text className="ml-3 text-gray-900 dark:text-white">View Profile</Text>
                    </View>
                    <Text className="text-gray-400">›</Text>
                </Pressable>
            </View>

            {/* Appearance Section */}
            <View className="bg-white dark:bg-gray-800 m-4 rounded-lg p-4 shadow-sm">
                <Text className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase">
                    Appearance
                </Text>
                
                <View className="flex-row items-center justify-between py-3">
                    <View className="flex-row items-center">
                        {isDark ? (
                            <Moon size={20} color="#6b7280" />
                        ) : (
                            <Sun size={20} color="#6b7280" />
                        )}
                        <Text className="ml-3 text-gray-900 dark:text-white">Dark Mode</Text>
                    </View>
                    <Switch
                        value={isDark}
                        onValueChange={() => {
                            // TODO: Implementar toggle de tema
                            console.log('Toggle theme');
                        }}
                        trackColor={{ false: '#d1d5db', true: '#00a884' }}
                        thumbColor={isDark ? '#fff' : '#f3f4f6'}
                    />
                </View>
            </View>

            {/* Account Actions */}
            <View className="bg-white dark:bg-gray-800 m-4 rounded-lg shadow-sm overflow-hidden">
                <Pressable
                    onPress={handleLogout}
                    className="flex-row items-center py-4 px-4 active:bg-gray-50 dark:active:bg-gray-700"
                >
                    <LogOut size={20} color="#ef4444" />
                    <Text className="ml-3 text-red-500 font-medium">Log Out</Text>
                </Pressable>
            </View>

            {/* App Info */}
            <View className="p-4 items-center">
                <Text className="text-xs text-gray-400 dark:text-gray-500">
                    ChatApp v1.0.0
                </Text>
            </View>
        </ScrollView>
    );
}
