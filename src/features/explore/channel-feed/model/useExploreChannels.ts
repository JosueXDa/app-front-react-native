import { Channel, getChannels } from '@/src/entities/channel';
import { useCallback, useEffect, useState } from 'react';

type UseExploreChannelsOptions = {
  limit?: number;
};

type UseExploreChannelsReturn = {
  channels: Channel[];
  loading: boolean;
  loadingMore: boolean;
  refreshing: boolean;
  hasMore: boolean;
  loadInitialData: () => Promise<void>;
  loadMore: () => Promise<void>;
  handleRefresh: () => Promise<void>;
};

export function useExploreChannels({ limit = 15 }: UseExploreChannelsOptions = {}): UseExploreChannelsReturn {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setPage(1);
    try {
      const response = await getChannels(1, limit);
      const channelList = response.data;
      setChannels(channelList);
      setHasMore(response.meta.page < response.meta.totalPages);
    } catch (error) {
      console.error('Error fetching channels:', error);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || loading) {
      return;
    }

    setLoadingMore(true);
    const nextPage = page + 1;

    try {
      const response = await getChannels(nextPage, limit);
      const channelList = response.data;

      if (channelList.length > 0) {
        setChannels((prev) => [...prev, ...channelList]);
        setPage(nextPage);
        setHasMore(response.meta.page < response.meta.totalPages);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, limit, loading, loadingMore, page]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      const response = await getChannels(1, limit);
      const channelList = response.data;
      setChannels(channelList);
      setPage(1);
      setHasMore(response.meta.page < response.meta.totalPages);
    } catch (error) {
      console.error('Error refreshing channels:', error);
    } finally {
      setRefreshing(false);
    }
  }, [limit]);

  useEffect(() => {
    void loadInitialData();
  }, [loadInitialData]);

  return {
    channels,
    loading,
    loadingMore,
    refreshing,
    hasMore,
    loadInitialData,
    loadMore,
    handleRefresh,
  };
}
