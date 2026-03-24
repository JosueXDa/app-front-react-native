export type AttachmentType = 'image' | 'document' | 'video' | 'audio';

export interface MessageAttachment {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  type: AttachmentType;
}

export interface UserProfile {
  displayName: string;
  avatarUrl: string | null;
}

export interface MessageSender {
  id: string;
  name: string;
  profile: UserProfile;
}

export interface Message {
  id: string;
  senderId: string;
  threadId: string;
  content: string;
  attachments: MessageAttachment[] | null;
  createdAt: string;
  sender: MessageSender;
  channelId?: string; // DEPRECATED
}

export interface CreateMessageDto {
  threadId?: string;
  content: string;
  attachments?: MessageAttachment[];
  channelId?: string; // DEPRECATED
}

export function getAttachmentType(mimeType: string): AttachmentType {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'document';
}
