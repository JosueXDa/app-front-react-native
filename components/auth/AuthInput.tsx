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
            <Text className="text-typography-700 font-medium mb-2 ml-1">
                {label}
            </Text>
            <View className={`flex-row items-center bg-background-50 border rounded-xl px-4 py-3 ${error ? 'border-error-500' : isFocused ? 'border-brand-500' : 'border-outline-300'}`}>
                <Ionicons name={iconName} size={20} color={isFocused ? "#00a884" : "#9ca3af"} style={{ marginRight: 10 }} />
                <TextInput
                    className="flex-1 text-typography-900 text-base web:outline-none"
                    placeholderTextColor="#9ca3af"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
            </View>
            {error && (
                <Text className="text-error-500 text-sm mt-1 ml-1">
                    {error}
                </Text>
            )}
        </View>
    );
}
