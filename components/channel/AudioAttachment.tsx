import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Pause, Play } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface AudioAttachmentProps {
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
 * Formatea el tiempo en formato MM:SS
 */
function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Componente para renderizar audio con reproductor
 */
export function AudioAttachment({ url, filename, size }: AudioAttachmentProps) {
    const player = useAudioPlayer(url, {
        updateInterval: 100,
    });
    
    const status = useAudioPlayerStatus(player);

    const togglePlayPause = () => {
        if (status.playing) {
            player.pause();
        } else {
            player.play();
        }
    };

    const currentTime = status.currentTime || 0;
    const duration = status.duration || 0;
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <View className="my-2 bg-background-50 rounded-lg p-4 max-w-[300px]">
            {/* Header con icono y nombre */}
            <View className="flex-row items-center mb-3">
                <View className="bg-brand-500 rounded-full p-2 mr-3">
                    <Text className="text-xl">🎵</Text>
                </View>
                <View className="flex-1">
                    <Text className="text-sm font-semibold text-typography-900" numberOfLines={1}>
                        {filename}
                    </Text>
                    <Text className="text-xs text-typography-500">
                        {formatFileSize(size)}
                    </Text>
                </View>
            </View>

            {/* Barra de progreso */}
            <View className="h-1 bg-background-200 rounded-full mb-2">
                <View 
                    className="h-full bg-brand-500 rounded-full"
                    style={{ width: `${progress}%` }}
                />
            </View>

            {/* Controles de reproducción */}
            <View className="flex-row items-center justify-between">
                <Text className="text-xs text-typography-500">
                    {formatTime(currentTime)}
                </Text>
                
                <Pressable 
                    onPress={togglePlayPause}
                    className="bg-brand-500 rounded-full p-2 active:bg-brand-600"
                >
                    {status.playing ? (
                        <Pause size={16} color="white" fill="white" />
                    ) : (
                        <Play size={16} color="white" fill="white" />
                    )}
                </Pressable>
                
                <Text className="text-xs text-typography-500">
                    {formatTime(duration)}
                </Text>
            </View>
        </View>
    );
}
