export interface ChannelMember {
  id: string;
  channelId: string;
  userId: string;
  joinedAt: string;
  role?: string;
}

export interface JoinChannelDto {
  channelId: string;
  userId?: string;
  role?: string;
}
