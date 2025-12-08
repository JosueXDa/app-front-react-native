import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface FeatureCardProps {
    title: string;
    description: string;
    iconName: keyof typeof Ionicons.glyphMap;
}

export function FeatureCard({ title, description, iconName }: FeatureCardProps) {
    return (
        <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 w-full md:w-[48%] lg:w-[23%] mb-4">
            <View className="bg-blue-50 dark:bg-blue-900/30 w-12 h-12 rounded-full items-center justify-center mb-4">
                <Ionicons name={iconName} size={24} color="#3b82f6" />
            </View>
            <Text className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {title}
            </Text>
            <Text className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {description}
            </Text>
        </View>
    );
}
