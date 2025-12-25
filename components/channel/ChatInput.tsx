import EmojiPicker, { Theme } from 'emoji-picker-react';
import { Send, Smile } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, TextInput, View } from 'react-native';

interface ChatInputProps {
    onSend: (message: string) => void;
}

export const ChatInput = ({ onSend }: ChatInputProps) => {
    const [message, setMessage] = useState('');
    const [showPicker, setShowPicker] = useState(false);

    const onEmojiClick = (emojiObject: any) => {
        setMessage((prevInput) => prevInput + emojiObject.emoji);
    };

    const handleSendPress = () => {
        if (message.trim()) {
            onSend(message);
            setMessage('');
            setShowPicker(false);
        }
    };

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
                <View className="flex-row items-center p-3 bg-gray-100 dark:bg-[#2b2d31] border-t border-gray-200 dark:border-[#1f2023]">
                    <View className="flex-1 flex-row items-center bg-white dark:bg-[#383a40] rounded-lg border border-gray-200 dark:border-transparent mr-3">
                        
                        <Pressable 
                            onPress={() => setShowPicker(!showPicker)}
                            className="p-2 ml-1"
                        >
                            <Smile 
                                size={24} 
                                color={showPicker ? "#5865F2" : "#9ca3af"} 
                            />
                        </Pressable>

                        <TextInput
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Message"
                            placeholderTextColor="#9ca3af"
                            className="flex-1 text-base text-gray-900 dark:text-white py-2 px-2 outline-none"
                            multiline
                            onFocus={() => setShowPicker(false)}
                            onKeyPress={e => {
                                if (e.nativeEvent.key === 'Enter') {
                                    e.preventDefault();
                                    handleSendPress();
                                }
                            }}
                        />
                    </View>
                    <Pressable
                        onPress={handleSendPress}
                        className="w-10 h-10 bg-[#5865F2] rounded-full items-center justify-center hover:bg-[#4752c4]"
                    >
                        <Send size={20} color="white" />
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </>
    );
};
