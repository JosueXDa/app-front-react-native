import { useViewProfile } from '@/src/features/profile/view-profile';
import { Text, View } from 'react-native';

export function ProfileDetailsCard() {
  const { title } = useViewProfile();

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white">{title}</Text>
    </View>
  );
}
