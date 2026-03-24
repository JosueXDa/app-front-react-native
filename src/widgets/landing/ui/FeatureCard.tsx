import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface FeatureCardProps {
    title: string;
    description: string;
    iconName: keyof typeof Ionicons.glyphMap;
}

export function FeatureCard({ title, description, iconName }: FeatureCardProps) {
    return (
        <View className="bg-background-0 p-6 rounded-2xl border border-outline-200 w-full md:w-[48%] lg:w-[23%] mb-4">
            <View className="bg-brand-100 dark:bg-brand-900 w-12 h-12 rounded-full items-center justify-center mb-4">
                <Ionicons name={iconName} size={24} color="#00a884" />
            </View>
            <Text className="text-lg font-bold text-typography-900 mb-2">
                {title}
            </Text>
            <Text className="text-typography-600 leading-relaxed">
                {description}
            </Text>
        </View>
    );
}
