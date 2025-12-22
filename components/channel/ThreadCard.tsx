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
            {/* --- SECCIÓN IZQUIERDA (GRÁFICA) --- */}
            {/* Aumentamos el ancho a w-20 para dar espacio a la curva */}
            <View className="w-20 relative">
                
                {/* 1. La línea vertical principal GRUESA */}
                {/* Se mantiene a la izquierda, ocupando todo el alto */}
                <View 
                    className="absolute left-0 top-0 bottom-0 w-2 bg-black dark:bg-gray-400" 
                />

                {/* 2. La RAMA CURVA */}
                {/* El truco: Un cuadrado con borde inferior e izquierdo, 
                    y la esquina inferior-izquierda redondeada al máximo. */}
                <View 
                    // Posición: justo a la derecha de la línea gruesa (left-2) y arriba (top-0)
                    // Tamaño: w-8 h-8 crea una curva amplia.
                    // Bordes: border-b-2 y border-l-2 del mismo color que la línea/nodo.
                    // Redondeo: rounded-bl-full crea el cuarto de círculo perfecto.
                    className="absolute left-2 top-0 w-8 h-8 border-b-2 border-l-2 border-black dark:border-gray-400 rounded-bl-full bg-transparent"
                />

                {/* 3. El NODO (Círculo) */}
                {/* Lo posicionamos absolutamente para que coincida con el final de la curva */}
                <View 
                    // left-8: Alinea el centro del nodo con el final de la curva de w-8.
                    // top-6: Alinea verticalmente el centro del nodo con el final de la curva de h-8.
                    className="absolute left-8 top-6 w-4 h-4 rounded-full border-[2px] border-black bg-white dark:border-gray-400 dark:bg-gray-900 z-10" 
                />
            </View>

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
