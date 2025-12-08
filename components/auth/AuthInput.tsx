import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface AuthInputProps extends TextInputProps {
    label: string;
    iconName: keyof typeof Ionicons.glyphMap;
    error?: string;
}

export function AuthInput({ label, iconName, error, ...props }: AuthInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View className="mb-4">
            <Text className="text-gray-700 dark:text-gray-300 font-medium mb-2 ml-1">
                {label}
            </Text>
            <View className={`flex-row items-center bg-gray-50 dark:bg-gray-800 border rounded-xl px-4 py-3 ${error ? 'border-red-500' : isFocused ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'}`}>
                <Ionicons name={iconName} size={20} color={isFocused ? "#3b82f6" : "#9ca3af"} style={{ marginRight: 10 }} />
                <TextInput
                    className="flex-1 text-gray-900 dark:text-white text-base web:outline-none"
                    placeholderTextColor="#9ca3af"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
            </View>
            {error && (
                <Text className="text-red-500 text-sm mt-1 ml-1">
                    {error}
                </Text>
            )}
        </View>
    );
}
