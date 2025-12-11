import { ChannelCard } from '@/components/explore/ChannelCard';
import { Channel, getChannels } from '@/lib/api/chat';
import { useRouter } from 'expo-router';
import { Filter, Search } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, TextInput, useColorScheme, View } from 'react-native';

export default function Explore() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const LIMIT = 15;

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setLoading(true);
        setPage(1);
        try {
            const response = await getChannels(1, LIMIT);
            // Map the response data structure { channel: ... } to Channel[]
            const channelList = response.data.map(item => item.channel);
            setChannels(channelList);
            setHasMore(response.meta.page < response.meta.totalPages);
        } catch (error) {
            console.error('Error fetching channels:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = async () => {
        if (loadingMore || !hasMore || loading) return;

        setLoadingMore(true);
        const nextPage = page + 1;
        try {
            const response = await getChannels(nextPage, LIMIT);
            const channelList = response.data.map(item => item.channel);

            if (channelList.length > 0) {
                setChannels(prev => [...prev, ...channelList]);
                setPage(nextPage);
                setHasMore(response.meta.page < response.meta.totalPages);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching more channels:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const response = await getChannels(1, LIMIT);
            const channelList = response.data.map(item => item.channel);
            setChannels(channelList);
            setPage(1);
            setHasMore(response.meta.page < response.meta.totalPages);
        } catch (error) {
            console.error('Error refreshing channels:', error);
        } finally {
            setRefreshing(false);
        }
    };

    // Simple client-side filtering for demonstration since API doesn't support search yet
    // const filteredChannels = channels.filter(channel =>
    //     channel.name.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    const renderItem = ({ item }: { item: Channel }) => (
        <ChannelCard channel={item} />
    );

    return (
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
            {/* Header Area */}
            <View className="bg-white dark:bg-gray-900 px-4 py-4 shadow-sm z-10">
                <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Explore
                </Text>

                {/* Search and Filter Row */}
                <View className="flex-row items-center space-x-3 gap-3">
                    <View className="flex-1 flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-4 h-12 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <Search size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
                        <TextInput
                            className="flex-1 ml-3 text-base text-gray-900 dark:text-white"
                            placeholder="Search channels..."
                            placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    <Pressable
                        className="h-12 w-12 items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 active:bg-gray-200 dark:active:bg-gray-700"
                        onPress={() => {
                            // Filter logic placeholder
                            console.log('Filter pressed');
                        }}
                    >
                        <Filter size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
                    </Pressable>
                </View>
            </View>

            {/* Content */}
            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#2563eb" />
                </View>
            ) : (
                <FlatList
                    data={channels}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={isDark ? '#ffffff' : '#000000'} />
                    }
                    ListFooterComponent={
                        loadingMore ? (
                            <View className="py-4">
                                <ActivityIndicator size="small" color="#2563eb" />
                            </View>
                        ) : null
                    }
                    ListEmptyComponent={
                        <View className="items-center justify-center py-20">
                            <Text className="text-gray-500 dark:text-gray-400 text-lg">
                                No channels found
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}
