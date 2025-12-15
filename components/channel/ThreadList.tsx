import { Button, ButtonText } from '@/components/ui/button';
import { Thread } from '@/lib/api/chat';
import { Plus } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { ThreadCard } from './ThreadCard';

interface ThreadListProps {
    threads: Thread[];
    isLoading: boolean;
    isAdmin: boolean;
    onThreadPress: (thread: Thread) => void;
    onCreateThread: () => void;
}

export function ThreadList({ 
    threads, 
    isLoading, 
    isAdmin, 
    onThreadPress, 
    onCreateThread 
}: ThreadListProps) {
    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#6366f1" />
                <Text className="text-gray-600 dark:text-gray-400 mt-2">
                    Cargando hilos...
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1">
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                    Hilos del canal
                </Text>
                {isAdmin && (
                    <Button 
                        size="sm" 
                        onPress={onCreateThread}
                        className="flex-row items-center"
                    >
                        <Plus size={16} color="white" />
                        <ButtonText className="ml-1">Crear hilo</ButtonText>
                    </Button>
                )}
            </View>

            {threads.length === 0 ? (
                <View className="flex-1 items-center justify-center p-8">
                    <Text className="text-gray-500 dark:text-gray-400 text-center mb-4">
                        No hay hilos disponibles
                    </Text>
                    {isAdmin && (
                        <Button onPress={onCreateThread}>
                            <ButtonText>Crear el primer hilo</ButtonText>
                        </Button>
                    )}
                </View>
            ) : (
                <FlatList
                    data={threads}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ThreadCard 
                            thread={item} 
                            onPress={() => onThreadPress(item)} 
                        />
                    )}
                    contentContainerStyle={{ flexGrow: 1 }}
                />
            )}
        </View>
    );
}
