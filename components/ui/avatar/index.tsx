import React from 'react';
import { Image, Text, View } from 'react-native';

interface AvatarProps {
    imageUrl?: string | null;
    name: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
    sm: { container: 32, text: 12 },
    md: { container: 40, text: 14 },
    lg: { container: 48, text: 16 },
    xl: { container: 64, text: 20 },
};

const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const generateColor = (name: string): string => {
    const colors = [
        '#ef4444', // red
        '#f97316', // orange
        '#f59e0b', // amber
        '#eab308', // yellow
        '#84cc16', // lime
        '#22c55e', // green
        '#10b981', // emerald
        '#14b8a6', // teal
        '#06b6d4', // cyan
        '#0ea5e9', // sky
        '#3b82f6', // blue
        '#6366f1', // indigo
        '#8b5cf6', // violet
        '#a855f7', // purple
        '#d946ef', // fuchsia
        '#ec4899', // pink
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
};

export function Avatar({ imageUrl, name, size = 'md' }: AvatarProps) {
    const initials = getInitials(name);
    const bgColor = generateColor(name);
    const dimensions = sizeMap[size];

    if (imageUrl) {
        return (
            <Image
                source={{ uri: imageUrl }}
                style={{
                    width: dimensions.container,
                    height: dimensions.container,
                    borderRadius: dimensions.container / 2,
                }}
            />
        );
    }

    return (
        <View
            style={{
                width: dimensions.container,
                height: dimensions.container,
                borderRadius: dimensions.container / 2,
                backgroundColor: bgColor,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Text
                style={{
                    fontSize: dimensions.text,
                    fontWeight: '600',
                    color: '#ffffff',
                }}
            >
                {initials}
            </Text>
        </View>
    );
}
