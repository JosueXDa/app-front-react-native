import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { useChannels } from '@/context/ChannelContex';
import { useRouter } from 'expo-router';
import { Compass, MessageCircle } from 'lucide-react-native';
import { ActivityIndicator, ImageBackground, Pressable, ScrollView, Text, View } from 'react-native';

export default function MeChannel() {
    const { user } = useAuth();
    const { joinedChannels, isLoading } = useChannels();
    const router = useRouter();

    return (
        <ScrollView className="flex-1 bg-white dark:bg-gray-900">
            {/* Header */}
            <ImageBackground
                source={{uri: user?.profile?.bannerUrl || undefined }}
                resizeMode='cover'
                className='w-full h-40 px-4 py-6 bg-gray-800'
            >

                <View className="flex-row items-center">
                    <Avatar size='xl'>
                        <AvatarImage source={{ uri: user?.profile?.avatarUrl || undefined }} />
                        <AvatarFallbackText>{user?.profile?.displayName || user?.name || 'UNDF'}</AvatarFallbackText>
                    </Avatar>
                    <View className="ml-4">
                        <Text className="text-white text-2xl font-bold">
                            {user?.profile?.displayName || user?.name || 'User'}
                        </Text>
                        <Text className="text-white/80 text-sm">
                            Welcome back!
                        </Text>
                    </View>
                </View>
            </ImageBackground>

            {/* Quick Stats */}
            <View className="flex-row justify-around py-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <View className="items-center">
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                        {joinedChannels.length}
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400">Channels</Text>
                </View>
                <View className="items-center">
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white">0</Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400">Messages</Text>
                </View>
            </View>

            {/* Recent Channels */}
            <View className="p-4">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-lg font-bold text-gray-900 dark:text-white">
                        Your Channels
                    </Text>
                    <Pressable onPress={() => router.push('/explore')}>
                        <Text className="text-[#00a884] font-medium">See All</Text>
                    </Pressable>
                </View>

                {isLoading ? (
                    <View className="py-8 items-center">
                        <ActivityIndicator size="large" color="#00a884" />
                    </View>
                ) : joinedChannels.length === 0 ? (
                    <View className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 items-center">
                        <MessageCircle size={48} color="#9ca3af" />
                        <Text className="text-gray-500 dark:text-gray-400 text-center mt-4 mb-2">
                            You haven&apos;t joined any channels yet
                        </Text>
                        <Pressable
                            onPress={() => router.push('/explore')}
                            className="bg-[#00a884] px-6 py-3 rounded-full mt-4"
                        >
                            <View className="flex-row items-center">
                                <Compass size={18} color="white" />
                                <Text className="text-white font-medium ml-2">Explore Channels</Text>
                            </View>
                        </Pressable>
                    </View>
                ) : (
                    <View>
                        {joinedChannels.slice(0, 5).map((channel) => (
                            <Pressable
                                key={channel.id}
                                onPress={() => router.push(`/channels/${channel.id}`)}
                                className="flex-row items-center p-3 bg-white dark:bg-gray-800 rounded-lg mb-2 active:bg-gray-50 dark:active:bg-gray-700"
                            >
                                <Avatar size="md" >
                                    <AvatarImage source={{ uri: channel.imageUrl || undefined }} />
                                    <AvatarFallbackText>{channel.name}</AvatarFallbackText>
                                </Avatar>
                                <View className="ml-3 flex-1">
                                    <Text className="font-semibold text-gray-900 dark:text-white">
                                        {channel.name}
                                    </Text>
                                    <Text className="text-sm text-gray-500 dark:text-gray-400" numberOfLines={1}>
                                        {channel.description || 'No description'}
                                    </Text>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
}