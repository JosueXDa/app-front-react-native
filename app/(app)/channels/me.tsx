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
        <ScrollView className="flex-1 bg-background-0">
            {/* Header */}
            <ImageBackground
                source={{uri: user?.profile?.bannerUrl || undefined }}
                resizeMode='cover'
                className='w-full h-40 px-4 py-6 bg-brand-600'
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
            <View className="flex-row justify-around py-6 bg-background-0 border-b border-outline-200">
                <View className="items-center">
                    <Text className="text-2xl font-bold text-typography-900">
                        {joinedChannels.length}
                    </Text>
                    <Text className="text-sm text-typography-500">Channels</Text>
                </View>
                <View className="items-center">
                    <Text className="text-2xl font-bold text-typography-900">0</Text>
                    <Text className="text-sm text-typography-500">Messages</Text>
                </View>
            </View>

            {/* Recent Channels */}
            <View className="p-4">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-lg font-bold text-typography-900">
                        Your Channels
                    </Text>
                    <Pressable onPress={() => router.push('/explore')}>
                        <Text className="text-brand-500 font-medium">See All</Text>
                    </Pressable>
                </View>

                {isLoading ? (
                    <View className="py-8 items-center">
                        <ActivityIndicator size="large" color="rgb(var(--color-brand-500))" />
                    </View>
                ) : joinedChannels.length === 0 ? (
                    <View className="bg-background-50 rounded-lg p-6 items-center">
                        <View className="bg-brand-100 dark:bg-brand-900 p-4 rounded-full mb-4">
                            <MessageCircle size={48} color="rgb(var(--color-brand-500))" />
                        </View>
                        <Text className="text-typography-600 text-center mt-4 mb-2 font-medium">
                            You haven&apos;t joined any channels yet
                        </Text>
                        <Pressable
                            onPress={() => router.push('/explore')}
                            className="bg-brand-500 px-6 py-3 rounded-full mt-4 active:bg-brand-600"
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
                                className="flex-row items-center p-3 bg-background-0 rounded-lg mb-2 border border-outline-200 active:bg-background-50"
                            >
                                <Avatar size="md" >
                                    <AvatarImage source={{ uri: channel.imageUrl || undefined }} />
                                    <AvatarFallbackText>{channel.name}</AvatarFallbackText>
                                </Avatar>
                                <View className="ml-3 flex-1">
                                    <Text className="font-semibold text-typography-900">
                                        {channel.name}
                                    </Text>
                                    <Text className="text-sm text-typography-500" numberOfLines={1}>
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