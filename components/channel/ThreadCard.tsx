import { Thread } from '@/lib/api/chat';
import { MessageCircle } from 'lucide-react-native';
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
            className="p-4 border-b border-gray-200 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-800"
        >
            <View className="flex-row items-start">
                <View className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center mr-3">
                    <MessageCircle size={20} color="#6366f1" />
                </View>
                
                <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                        {thread.name}
                    </Text>
                    
                    {thread.description && (
                        <Text 
                            className="text-sm text-gray-600 dark:text-gray-400 mb-1"
                            numberOfLines={2}
                        >
                            {thread.description}
                        </Text>
                    )}
                    
                    <Text className="text-xs text-gray-500 dark:text-gray-500">
                        {formatDate(thread.createdAt)}
                    </Text>
                </View>
                
                {thread.isArchived && (
                    <View className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded ml-2">
                        <Text className="text-xs text-gray-600 dark:text-gray-400">
                            Archivado
                        </Text>
                    </View>
                )}
            </View>
        </Pressable>
    );
}
