import { Thread } from '@/lib/api/chat';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface ThreadCardProps {
    thread: Thread;
    onPress: () => void;
}

export function ThreadCard({ thread, onPress }: ThreadCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) {
            return 'Hace unos minutos';
        } else if (diffInHours < 24) {
            return `Hace ${diffInHours}h`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `Hace ${diffInDays}d`;
        }
    };

    return (
<Pressable
            onPress={onPress}
            className="flex-row active:bg-gray-50 dark:active:bg-gray-800 overflow-hidden"
        >

            {/* --- SECCIÓN DERECHA (CONTENIDO) --- */}
            {/* Aumentamos el padding superior (pt-5) para alinear el texto con el nuevo nodo más abajo */}
            <View className="flex-1 pb-8 pt-5 pr-4">
                <View className="flex-row justify-between items-start">
                    <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {thread.name}
                    </Text>
                    
                    <Text className="text-xs text-gray-500 mt-1">
                        {formatDate(thread.createdAt)}
                    </Text>
                </View>

                {thread.description && (
                    <Text 
                        className="text-sm text-gray-600 dark:text-gray-400 mb-2"
                        numberOfLines={2}
                    >
                        {thread.description}
                    </Text>
                )}

                {/* ... (Badge de Archivado sigue igual) ... */}
            </View>
        </Pressable>
    );
}
