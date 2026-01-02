import { MyAccountSection } from '@/components/settings';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from '@/components/ui/modal';
import { useAuth } from '@/context/AuthContext';
import { User, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingSection = 'my-account';

export function UserSettingsModal({ isOpen, onClose }: UserSettingsModalProps) {
  const [activeSection, setActiveSection] = useState<SettingSection>('my-account');
  const { user, updateUser } = useAuth();

  const renderContent = () => {
    switch (activeSection) {
      case 'my-account':
        return <MyAccountSection user={user} updateUser={updateUser} />;
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
    >
      <ModalBackdrop />
      <ModalContent className="bg-white dark:bg-[#36393f] max-h-[90vh]">
        <ModalHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            User Settings
          </Text>
          <ModalCloseButton>
            <X size={24} className="text-gray-500 dark:text-gray-400" />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody className="p-0 m-0">
          <View className="flex-row flex-1">
            <View className="w-56 bg-gray-50 dark:bg-[#2f3136] border-r border-gray-200 dark:border-gray-700">
              <ScrollView className="py-4">
                <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase px-4 mb-2">
                  User Settings
                </Text>
                <TouchableOpacity
                  onPress={() => setActiveSection('my-account')}
                  className={`px-4 py-2 mx-2 rounded-md ${
                    activeSection === 'my-account'
                      ? 'bg-gray-200 dark:bg-[#40444b]'
                      : ''
                  }`}
                >
                  <View className="flex-row items-center">
                    <User size={18} className="text-gray-700 dark:text-gray-300 mr-2" />
                    <Text className="text-gray-900 dark:text-white font-medium">
                      My Account
                    </Text>
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </View>
            {/* Sidebar Navigation */}

            {/* Content Area */}
            <View className="flex-1 bg-white dark:bg-[#36393f]">
              {renderContent()}
            </View>
          </View>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
