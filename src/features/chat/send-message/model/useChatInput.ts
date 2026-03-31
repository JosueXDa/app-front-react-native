import { getAttachmentType, MessageAttachment } from '@/src/entities/message';
import {
  uploadMessageAttachment,
  uploadMessageAudio,
  uploadMessageImage,
  uploadMessageVideo,
} from '@/src/entities/upload';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

export interface LocalAttachment {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

interface UseChatInputProps {
  onSend: (content: string, attachments?: MessageAttachment[]) => void;
  maxAttachments?: number;
  onNotify?: (title: string, message: string) => void;
}

export function useChatInput({
  onSend,
  maxAttachments = 10,
  onNotify,
}: UseChatInputProps) {
  const [message, setMessage] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [attachments, setAttachments] = useState<LocalAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onEmojiClick = (emojiObject: any) => {
    setMessage((prevInput) => prevInput + emojiObject.emoji);
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const asset = result.assets[0];

      if (attachments.length >= maxAttachments) {
        onNotify?.('Límite alcanzado', `Máximo ${maxAttachments} archivos por mensaje`);
        return;
      }

      setAttachments((prev) => [
        ...prev,
        {
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || 'application/octet-stream',
          size: asset.size,
        },
      ]);
    } catch (err) {
      console.error('Error picking document:', err);
      onNotify?.('Error', 'Failed to pick document');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled) return;

      const asset = result.assets[0];

      if (attachments.length >= maxAttachments) {
        onNotify?.('Límite alcanzado', `Máximo ${maxAttachments} archivos por mensaje`);
        return;
      }

      const filename = asset.fileName || asset.uri.split('/').pop() || 'image.jpg';

      setAttachments((prev) => [
        ...prev,
        {
          uri: asset.uri,
          name: filename,
          type: asset.mimeType || (asset.type === 'video' ? 'video/mp4' : 'image/jpeg'),
          size: asset.fileSize,
        },
      ]);
    } catch (err) {
      console.error('Error picking image:', err);
      onNotify?.('Error', 'Failed to pick image');
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendPress = async () => {
    if ((!message.trim() && attachments.length === 0) || isUploading) return;

    setIsUploading(true);
    try {
      let messageAttachments: MessageAttachment[] | undefined;

      if (attachments.length > 0) {
        const uploadedAttachments: MessageAttachment[] = [];

        for (const file of attachments) {
          const isImage = file.type.startsWith('image/');
          const isVideo = file.type.startsWith('video/');
          const isAudio = file.type.startsWith('audio/');

          let result;
          if (isImage) {
            result = await uploadMessageImage(file.uri, file.name, file.type);
          } else if (isVideo) {
            result = await uploadMessageVideo(file.uri, file.name, file.type);
          } else if (isAudio) {
            result = await uploadMessageAudio(file.uri, file.name, file.type);
          } else {
            result = await uploadMessageAttachment(file.uri, file.name, file.type);
          }

          uploadedAttachments.push({
            id: crypto.randomUUID(),
            url: result.publicUrl,
            filename: result.filename,
            mimeType: result.contentType,
            size: result.size,
            type: getAttachmentType(result.contentType),
          });
        }

        messageAttachments = uploadedAttachments;
      }

      onSend(message.trim(), messageAttachments);

      setMessage('');
      setAttachments([]);
      setShowPicker(false);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to send message with attachments';
      onNotify?.('Error', errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    message,
    setMessage,
    showPicker,
    setShowPicker,
    attachments,
    isUploading,
    onEmojiClick,
    pickDocument,
    pickImage,
    removeAttachment,
    handleSendPress,
  };
}

