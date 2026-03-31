import { Grid, GridItem } from '@/components/ui/grid';
import { useChannels } from '@/src/app/providers';
import { ChannelGridCard } from '@/src/entities/channel';
import { useExploreChannels } from '@/src/features/explore/channel-feed';
import { ChannelDetailModal } from '@/src/features/explore/join-channel';
import { useExploreSearch } from '@/src/features/explore/search';
import { useSelectedExploreChannel } from '@/src/features/explore/select-channel';
import { Filter, Search } from 'lucide-react-native';
import {
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

export function ExploreScreen() {
  const { refreshChannels } = useChannels();
  const { channels, loading, loadingMore, refreshing, hasMore, loadMore, handleRefresh } =
    useExploreChannels({ limit: 15 });
  const { searchQuery, setSearchQuery, filteredChannels } = useExploreSearch(channels);
  const { selectedChannel, isModalOpen, handleChannelPress, handleCloseModal } =
    useSelectedExploreChannel();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

    if (isCloseToBottom && !loadingMore && hasMore && !loading) {
      void loadMore();
    }
  };

  return (
    <View className="flex-1 bg-background-0">
      <View className="bg-background-0 px-4 py-4 shadow-sm z-10 border-b border-outline-200">
        <Text className="text-2xl font-bold text-typography-900 mb-4">Explore</Text>

        <View className="flex-row items-center space-x-3 gap-3">
          <View className="flex-1 flex-row items-center bg-background-50 rounded-xl px-4 h-12 border border-outline-300">
            <Search size={20} color="rgb(var(--color-typography-600))" />
            <TextInput
              className="flex-1 ml-3 text-base text-typography-900"
              placeholder="Search channels..."
              placeholderTextColor="rgb(var(--color-typography-400))"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <Pressable
            className="h-12 w-12 items-center justify-center bg-background-50 rounded-xl border border-outline-300 active:bg-background-100"
            onPress={() => {
              console.log('Filter pressed');
            }}
          >
            <Filter size={20} color="rgb(var(--color-typography-600))" />
          </Pressable>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="rgb(var(--color-brand-500))" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void handleRefresh()}
              tintColor="rgb(var(--color-brand-500))"
            />
          }
          onScroll={handleScroll}
          scrollEventThrottle={400}
        >
          {filteredChannels.length === 0 ? (
            <View className="items-center justify-center py-20">
              <View className="bg-brand-100 dark:bg-brand-900 p-6 rounded-full mb-4">
                <Text className="text-4xl">🔍</Text>
              </View>
              <Text className="text-typography-600 text-lg font-medium">No se encontraron canales</Text>
            </View>
          ) : (
            <>
              <Grid
                className="gap-4"
                _extra={{
                  className: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
                }}
              >
                {filteredChannels.map((channel) => (
                  <GridItem
                    key={channel.id}
                    _extra={{
                      className: 'col-span-1',
                    }}
                  >
                    <ChannelGridCard channel={channel} onPress={() => handleChannelPress(channel)} />
                  </GridItem>
                ))}
              </Grid>

              {loadingMore && (
                <View className="py-6">
                  <ActivityIndicator size="small" color="rgb(var(--color-brand-500))" />
                </View>
              )}
            </>
          )}
        </ScrollView>
      )}

      <ChannelDetailModal
        channel={selectedChannel}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onJoinedSuccess={refreshChannels}
      />
    </View>
  );
}
