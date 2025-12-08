import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatsScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-950 items-center justify-center">
            <Text className="text-gray-900 dark:text-white">Chats Screen</Text>
        </SafeAreaView>
    );
}
