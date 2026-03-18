import { axiosInstance } from '@/src/shared/api';
import { ChannelMember, JoinChannelDto } from '../model/channel-member.types';

export const getChannelMembers = async (channelId: string): Promise<ChannelMember[]> => {
  const response = await axiosInstance.get<ChannelMember[]>(
    `/api/members/${channelId}`,
  );
  return response.data;
};

export const joinChannel = async (
  channelId: string,
  userId?: string,
  role: string = 'member',
): Promise<ChannelMember> => {
  const payload: JoinChannelDto = { channelId, userId, role };
  const response = await axiosInstance.post<ChannelMember>('/api/members', payload);
  return response.data;
};

export const leaveChannel = async (channelId: string): Promise<{ message: string }> => {
  const response = await axiosInstance.delete<{ message: string }>(
    `/api/members/${channelId}`,
  );
  return response.data;
};

export const isJoined = async (channelId: string): Promise<boolean> => {
  const response = await axiosInstance.get<{ isJoined: boolean }>(
    `/api/members/is-joined/${channelId}`,
  );
  return response.data.isJoined;
};

export const getMemberRole = async (
  channelId: string,
  userId: string,
): Promise<string> => {
  const response = await axiosInstance.get<{ role: string }>(
    `/api/members/${channelId}/role/${userId}`,
  );
  return response.data.role;
};

export const updateMemberRole = async (
  channelId: string,
  userId: string,
  role: string,
): Promise<void> => {
  await axiosInstance.patch(`/api/members/${channelId}/${userId}/role`, { role });
};

export const removeMember = async (
  channelId: string,
  userId: string,
): Promise<{ message: string }> => {
  const response = await axiosInstance.delete<{ message: string }>(
    `/api/members/${channelId}/${userId}`,
  );
  return response.data;
};
