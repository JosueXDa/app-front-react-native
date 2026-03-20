import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { useProfileSettings } from '@/src/features/profile/settings';
import { LogOut, Moon, Sun, User } from 'lucide-react-native';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';

export function ProfileSettingsCard() {
  const {
    avatarUrl,
    canOpenProfile,
    displayName,
    email,
    isDark,
    logout,
    openProfile,
    toggleThemeMode,
  } = useProfileSettings();

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="bg-brand-500 pt-12 pb-8 px-6">
        <Text className="text-white text-2xl font-bold mb-2">Settings</Text>
        <Text className="text-white/80 text-sm">
          Manage your account and preferences
        </Text>
      </View>

      <View className="bg-white dark:bg-gray-800 m-4 rounded-lg p-4 shadow-sm">
        <View className="flex-row items-center mb-4">
          <Avatar size="md">
            {avatarUrl ? (
              <AvatarImage source={{ uri: avatarUrl }} alt={displayName} />
            ) : (
              <AvatarFallbackText>{displayName}</AvatarFallbackText>
            )}
          </Avatar>
          <View className="ml-4 flex-1">
            <Text className="text-lg font-bold text-gray-900 dark:text-white">
              {displayName}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">{email}</Text>
          </View>
        </View>

        <Pressable
          disabled={!canOpenProfile}
          onPress={openProfile}
          className="flex-row items-center justify-between py-3 border-t border-gray-200 dark:border-gray-700"
        >
          <View className="flex-row items-center">
            <User size={20} color="#6b7280" />
            <Text className="ml-3 text-gray-900 dark:text-white">View Profile</Text>
          </View>
          <Text className="text-gray-400">{'>'}</Text>
        </Pressable>
      </View>

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
            onValueChange={() => void toggleThemeMode()}
            trackColor={{ false: '#d1d5db', true: 'rgb(var(--color-brand-500))' }}
            thumbColor={isDark ? '#fff' : '#f3f4f6'}
          />
        </View>
      </View>

      <View className="bg-white dark:bg-gray-800 m-4 rounded-lg shadow-sm overflow-hidden">
        <Pressable
          onPress={() => void logout()}
          className="flex-row items-center py-4 px-4 active:bg-gray-50 dark:active:bg-gray-700"
        >
          <LogOut size={20} color="#ef4444" />
          <Text className="ml-3 text-red-500 font-medium">Log Out</Text>
        </Pressable>
      </View>

      <View className="p-4 items-center">
        <Text className="text-xs text-gray-400 dark:text-gray-500">ChatApp v1.0.0</Text>
      </View>
    </ScrollView>
  );
}
