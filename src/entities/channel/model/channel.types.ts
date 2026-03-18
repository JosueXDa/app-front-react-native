export interface Channel {
  id: string;
  name: string;
  description?: string | null;
  isPrivate: boolean;
  imageUrl?: string | null;
  bannerUrl?: string | null;
  category?: string;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChannelDto {
  name: string;
  description?: string | null;
  isPrivate?: boolean;
  imageUrl?: string | null;
  bannerUrl?: string | null;
  category?: string;
  memberIds?: string[];
  ownerId?: string;
}

export interface UpdateChannelDto {
  name?: string;
  description?: string | null;
  isPrivate?: boolean;
  imageUrl?: string | null;
  bannerUrl?: string | null;
  category?: string;
}

export interface GetChannelsResponse {
  data: Channel[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
