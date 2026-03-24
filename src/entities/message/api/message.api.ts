import { axiosInstance } from '@/src/shared/api';
import { CreateMessageDto, Message, MessageAttachment } from '../model/message.types';

export const getMessagesByThread = async (
  threadId: string,
  limit: number = 50,
  offset: number = 0,
): Promise<Message[]> => {
  const response = await axiosInstance.get<Message[]>(
    `/api/messages/thread/${threadId}?limit=${limit}&offset=${offset}`,
  );
  return response.data;
};

export const createMessage = async (data: CreateMessageDto): Promise<Message> => {
  const threadId = data.threadId || data.channelId;
  if (!threadId) {
    throw new Error('Either threadId or channelId must be provided');
  }

  const payload: {
    threadId: string;
    content: string;
    attachments?: MessageAttachment[];
  } = {
    threadId,
    content: data.content,
  };

  if (data.attachments && data.attachments.length > 0) {
    payload.attachments = data.attachments;
  }

  const response = await axiosInstance.post<Message>('/api/messages', payload);
  return response.data;
};

export const deleteMessage = async (messageId: string): Promise<{ message: string }> => {
  const response = await axiosInstance.delete<{ message: string }>(
    `/api/messages/${messageId}`,
  );
  return response.data;
};
