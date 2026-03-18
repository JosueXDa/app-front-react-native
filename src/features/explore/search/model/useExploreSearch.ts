import { Channel } from '@/src/entities/channel';
import { useMemo, useState } from 'react';

type UseExploreSearchReturn = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filteredChannels: Channel[];
};

export function useExploreSearch(channels: Channel[]): UseExploreSearchReturn {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChannels = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return channels;
    }

    return channels.filter((channel) => {
      const nameMatch = channel.name.toLowerCase().includes(normalizedQuery);
      const descriptionMatch = channel.description?.toLowerCase().includes(normalizedQuery) ?? false;
      const categoryMatch = channel.category?.toLowerCase().includes(normalizedQuery) ?? false;

      return nameMatch || descriptionMatch || categoryMatch;
    });
  }, [channels, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredChannels,
  };
}
