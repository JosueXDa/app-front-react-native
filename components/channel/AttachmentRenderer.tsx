import { MessageAttachment } from '@/lib/api/chat';
import { Download } from 'lucide-react-native';
import React from 'react';
import { Image, Linking, Pressable, Text, View } from 'react-native';
import { AudioAttachment } from './AudioAttachment';
import { VideoAttachment } from './VideoAttachment';

interface AttachmentRendererProps {
    attachment: MessageAttachment;
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
 * Obtiene un ícono apropiado según el tipo MIME
 */
function getDocumentIcon(mimeType: string): string {
    if (mimeType.includes('pdf')) return '📕';
    if (mimeType.includes('word')) return '📘';
    if (mimeType.includes('csv') || mimeType.includes('excel')) return '📊';
    if (mimeType.includes('text')) return '📄';
    return '📎';
}

/**
 * Renderiza un attachment según su tipo
 */
export function AttachmentRenderer({ attachment }: AttachmentRendererProps) {
    const handlePress = () => {
        Linking.openURL(attachment.url).catch(err => {
            console.error('Failed to open attachment:', err);
        });
    };

    switch (attachment.type) {
        case 'image':
            return (
                <Pressable onPress={handlePress} className="my-2">
                    <Image
                        source={{ uri: attachment.url }}
                        className="rounded-lg max-w-[300px] max-h-[300px]"
                        style={{ width: 300, height: 200 }}
                        resizeMode="cover"
                    />
                    <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {attachment.filename} • {formatFileSize(attachment.size)}
                    </Text>
                </Pressable>
            );

        case 'video':
            return (
                <VideoAttachment
                    url={attachment.url}
                    filename={attachment.filename}
                    size={attachment.size}
                />
            );

        case 'audio':
            return (
                <AudioAttachment
                    url={attachment.url}
                    filename={attachment.filename}
                    size={attachment.size}
                />
            );

        case 'document':
        default:
            return (
                <Pressable
                    onPress={handlePress}
                    className="my-2 bg-gray-100 dark:bg-[#2b2d31] rounded-lg p-4 flex-row items-center max-w-[300px]"
                >
                    <View className="bg-gray-500 rounded-lg p-3 mr-3">
                        <Text className="text-2xl">{getDocumentIcon(attachment.mimeType)}</Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm font-semibold text-gray-900 dark:text-white" numberOfLines={1}>
                            {attachment.filename}
                        </Text>
                        <Text className="text-xs text-gray-500 dark:text-gray-400">
                            {attachment.mimeType.split('/').pop()?.toUpperCase()} • {formatFileSize(attachment.size)}
                        </Text>
                    </View>
                    <Download size={20} color="#9ca3af" />
                </Pressable>
            );
    }
}

/**
 * Renderiza una lista de attachments
 */
export function AttachmentsList({ attachments }: { attachments: MessageAttachment[] }) {
    if (!attachments || attachments.length === 0) return null;

    return (
        <View className="mt-1">
            {attachments.map((attachment) => (
                <AttachmentRenderer key={attachment.id} attachment={attachment} />
            ))}
        </View>
    );
}
