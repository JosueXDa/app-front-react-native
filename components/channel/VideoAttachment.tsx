import { useVideoPlayer, VideoView } from 'expo-video';
import React from 'react';
import { Text, View } from 'react-native';

interface VideoAttachmentProps {
    url: string;
    filename: string;
    size: number;
}

/**
 * Formatea el tamaño del archivo en formato legible
 */
function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Componente para renderizar videos
 */
export function VideoAttachment({ url, filename, size }: VideoAttachmentProps) {
    const player = useVideoPlayer(url, (player) => {
        player.loop = false;
    });

    return (
        <View className="my-2">
            <VideoView
                player={player}
                style={{ width: 300, height: 200, borderRadius: 8 }}
                allowsFullscreen
                allowsPictureInPicture
                nativeControls
                contentFit="contain"
            />
            <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {filename} • {formatFileSize(size)}
            </Text>
        </View>
    );
}
