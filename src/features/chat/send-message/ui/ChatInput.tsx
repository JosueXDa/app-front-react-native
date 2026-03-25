import { MessageAttachment } from '@/src/entities/message';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import {
  File as FileIcon,
  Image as ImageIcon,
  Paperclip,
  Send,
  Smile,
  X,
} from 'lucide-react-native';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useChatInput } from '../model/useChatInput';

interface ChatInputProps {
  onSend: (content: string, attachments?: MessageAttachment[]) => void;
}

export const ChatInput = ({ onSend }: ChatInputProps) => {
  const {
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
  } = useChatInput({
    onSend,
    onNotify: (title, msg) => Alert.alert(title, msg),
  });

  return (
    <>
      {showPicker && (
        <View className="absolute bottom-20 left-4 z-50 shadow-xl rounded-xl">
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            theme={Theme.AUTO}
            searchDisabled={false}
            width={300}
            height={400}
            previewConfig={{ showPreview: false }}
          />
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <View className="p-3 bg-background-50 border-t border-outline-200 flex-row flex-wrap gap-2">
            {attachments.map((file, index) => (
              <View
                key={index}
                className="relative bg-background-0 p-2 rounded-lg border border-outline-200 flex-row items-center"
              >
                {file.type.startsWith('image/') ? (
                  <Image
                    source={{ uri: file.uri }}
                    className="w-10 h-10 rounded mr-2"
                  />
                ) : (
                  <FileIcon size={24} color="#9ca3af" className="mr-2" />
                )}
                <View className="max-w-[100px]">
                  <Text numberOfLines={1} className="text-xs text-typography-900">
                    {file.name}
                  </Text>
                  <Text className="text-[10px] text-typography-500">
                    {file.size ? (file.size / 1024).toFixed(1) + ' KB' : ''}
                  </Text>
                </View>
                <Pressable
                  onPress={() => removeAttachment(index)}
                  className="absolute -top-2 -right-2 bg-error-500 rounded-full p-1"
                >
                  <X size={12} color="white" />
                </Pressable>
              </View>
            ))}
          </View>
        )}

        <View className="flex-row items-center p-3 bg-background-50 border-t border-outline-200">
          <View className="flex-1 flex-row items-center bg-background-0 rounded-lg border border-outline-200 mr-3">
            <Pressable onPress={pickDocument} className="p-2 ml-1">
              <Paperclip size={20} color="#9ca3af" />
            </Pressable>

            <Pressable onPress={pickImage} className="p-2">
              <ImageIcon size={20} color="#9ca3af" />
            </Pressable>

            <Pressable onPress={() => setShowPicker(!showPicker)} className="p-2">
              <Smile size={20} color={showPicker ? '#5865F2' : '#9ca3af'} />
            </Pressable>

            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Message"
              placeholderTextColor="rgb(var(--color-typography-400))"
              className="flex-1 text-base text-typography-900 py-2 px-2 outline-none"
              multiline
              onFocus={() => setShowPicker(false)}
              onKeyPress={(e) => {
                if (e.nativeEvent.key === 'Enter') {
                  e.preventDefault();
                  handleSendPress();
                }
              }}
            />
          </View>
          <Pressable
            onPress={handleSendPress}
            disabled={isUploading}
            className={`w-10 h-10 rounded-full items-center justify-center ${isUploading ? 'bg-typography-400' : 'bg-brand-500 hover:bg-brand-600 active:bg-brand-700'}`}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Send size={20} color="white" />
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};
