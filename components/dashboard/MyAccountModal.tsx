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
import { X } from 'lucide-react-native';
import React from 'react';
import { Text } from 'react-native';

interface MyAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MyAccountModal({ isOpen, onClose }: MyAccountModalProps) {
  const { user, updateUser } = useAuth();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
    >
      <ModalBackdrop />
      <ModalContent className="bg-background-0 max-h-[90vh]">
        <ModalHeader className="border-b border-outline-200 pb-4">
          <Text className="text-xl font-bold text-typography-900">
            Mi Cuenta
          </Text>
          <ModalCloseButton>
            <X size={24} color="rgb(var(--color-typography-500))" />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody className="p-0">
          <MyAccountSection user={user} updateUser={updateUser} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
