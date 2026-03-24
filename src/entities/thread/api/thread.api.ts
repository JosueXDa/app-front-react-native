import { axiosInstance } from '@/src/shared/api';
import { CreateThreadDto, Thread, UpdateThreadDto } from '../model/thread.types';

export const getThreadsByChannel = async (channelId: string): Promise<Thread[]> => {
  const response = await axiosInstance.get<Thread[]>(`/api/threads/channel/${channelId}`);
  return response.data;
};

export const getActiveThreadsByChannel = async (channelId: string): Promise<Thread[]> => {
  const response = await axiosInstance.get<Thread[]>(`/api/threads/channel/${channelId}/active`);
  return response.data;
};

export const getThreadById = async (threadId: string): Promise<Thread> => {
  const response = await axiosInstance.get<Thread>(`/api/threads/${threadId}`);
  return response.data;
};

export const createThread = async (data: CreateThreadDto): Promise<Thread> => {
  const response = await axiosInstance.post<Thread>('/api/threads', data);
  return response.data;
};

export const updateThread = async (
  threadId: string,
  data: UpdateThreadDto,
): Promise<Thread> => {
  const response = await axiosInstance.patch<Thread>(`/api/threads/${threadId}`, data);
  return response.data;
};

export const archiveThread = async (threadId: string): Promise<Thread> => {
  const response = await axiosInstance.post<Thread>(`/api/threads/${threadId}/archive`);
  return response.data;
};

export const unarchiveThread = async (threadId: string): Promise<Thread> => {
  const response = await axiosInstance.post<Thread>(`/api/threads/${threadId}/unarchive`);
  return response.data;
};

export const deleteThread = async (threadId: string): Promise<{ message: string }> => {
  const response = await axiosInstance.delete<{ message: string }>(`/api/threads/${threadId}`);
  return response.data;
};
