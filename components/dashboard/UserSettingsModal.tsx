import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';
import { Button, ButtonText } from '@/components/ui/button';
import { X } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserSettingsModal({ isOpen, onClose }: UserSettingsModalProps) {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
    >
      <ModalBackdrop />
      <ModalContent className="bg-white dark:bg-[#36393f]">
        <ModalHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            Settings
          </Text>
          <ModalCloseButton>
            <X size={24} className="text-gray-500 dark:text-gray-400" />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <ScrollView className="py-4">
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                My Account
              </Text>
              <View className="bg-gray-100 dark:bg-[#2f3136] p-4 rounded-lg">
                <Text className="text-gray-600 dark:text-gray-300">
                  User settings content will go here.
                </Text>
              </View>
            </View>
            
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                App Settings
              </Text>
              <View className="bg-gray-100 dark:bg-[#2f3136] p-4 rounded-lg">
                <Text className="text-gray-600 dark:text-gray-300">
                  Appearance, Accessibility, Voice & Video, etc.
                </Text>
              </View>
            </View>
          </ScrollView>
        </ModalBody>
        <ModalFooter className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <Button
            variant="outline"
            action="secondary"
            onPress={onClose}
            className="mr-2"
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            action="negative"
            onPress={handleLogout}
          >
            <ButtonText>Log Out</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
