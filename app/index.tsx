import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';


export default function HomeScreen() {
    const [contador, setContador] = useState(0);
    return (
        <View className='flex-1 bg-white items-center justify-center'>
            <Text className='text-2xl font-bold mb-5 text-gray-800'>Hola desde React Native</Text>
            <Text className='text-6xl text-blue-500 mb-10 font-medium'>{contador}</Text>

            <Pressable
                className='bg-blue-500 py-4 px-8 rounded-xl active:opacity-70'
                onPress={() => setContador(contador + 1)}
            >
                <Text className='text-white text-lg font-semibold'>Incrementar</Text>
            </Pressable>
        </View>
    );
}
