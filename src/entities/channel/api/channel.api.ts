import { axiosInstance } from '@/src/shared/api';
import {
  Channel,
  CreateChannelDto,
  GetChannelsResponse,
  UpdateChannelDto,
} from '../model/channel.types';

export const getChannels = async (
  page: number = 1,
  limit: number = 10,
): Promise<GetChannelsResponse> => {
  const response = await axiosInstance.get<GetChannelsResponse>(
    `/api/channels?page=${page}&limit=${limit}`,
  );
  return response.data;
};

export const getChannelById = async (id: string): Promise<Channel> => {
  const response = await axiosInstance.get<{ channel: Channel }>(
    `/api/channels/${id}`,
  );
  return response.data.channel;
};

export const getUserChannels = async (): Promise<Channel[]> => {
  const response = await axiosInstance.get<Channel[]>('/api/members/joined');
  return response.data;
};

export const createChannel = async (data: CreateChannelDto): Promise<Channel> => {
  const response = await axiosInstance.post<{ channel: Channel }>(
    '/api/channels',
    data,
  );
  return response.data.channel;
};

export const updateChannel = async (
  id: string,
  data: UpdateChannelDto,
): Promise<Channel> => {
  const response = await axiosInstance.patch<{ channel: Channel }>(
    `/api/channels/${id}`,
    data,
  );
  return response.data.channel;
};

export const deleteChannel = async (id: string): Promise<{ message: string }> => {
  const response = await axiosInstance.delete<{ message: string }>(
    `/api/channels/${id}`,
  );
  return response.data;
};
