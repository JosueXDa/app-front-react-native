import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import {
    Modal,
    ModalBackdrop,
    ModalCloseButton,
    ModalContent
} from '@/components/ui/modal';
import { User } from '@/lib/api/auth';
import { X } from 'lucide-react-native';
import React from 'react';
import { Image, Text, View } from 'react-native';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export function UserProfileModal({ isOpen, onClose, user }: UserProfileModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
    >
      <ModalBackdrop />
      <ModalContent className="bg-white dark:bg-[#18191c] p-0 overflow-hidden">
        {/* Banner Color */}
        <View className="h-24 w-full">
            <Image
                source={{ uri: user.profile?.bannerUrl || 'https://placehold.co/600x400'}}
                alt="User Banner"
                className="w-full h-24 rounded-lg object-cover"
            />
        </View>
        
        <View className="px-4 pb-4 relative">
            {/* Avatar */}
            <View className="absolute -top-10 left-4 p-1.5 bg-white dark:bg-[#18191c] rounded-full">
                <Avatar size="xl" className="border-4 border-white dark:border-[#18191c]">
                    {user.profile?.avatarUrl ? (
                        <AvatarImage source={{ uri: user.profile.avatarUrl }} alt={user.profile?.displayName || user.name} />
                    ) : (
                        <AvatarFallbackText>{user.profile?.displayName || user.name}</AvatarFallbackText>
                    )}
                </Avatar>
                <View className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-[#18191c]" />
            </View>

            {/* Close Button */}
            <View className="absolute top-2 right-2">
                 <ModalCloseButton>
                    <X size={24} className="text-gray-500 dark:text-gray-400" />
                </ModalCloseButton>
            </View>

            <View className="mt-14">
                <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.profile?.displayName || user.name}
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-sm">
                    #{user.id.substring(0, 4)}
                </Text>

                <View className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                        Member Since
                    </Text>
                    <Text className="text-gray-700 dark:text-gray-300">
                        {new Date(user.createdAt).toLocaleDateString()}
                    </Text>
                </View>
            </View>
        </View>
      </ModalContent>
    </Modal>
  );
}
