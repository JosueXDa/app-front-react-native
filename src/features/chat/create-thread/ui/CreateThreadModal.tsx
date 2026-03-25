import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Icon, AlertCircleIcon, CheckCircleIcon, CloseIcon } from '@/components/ui/icon';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@/components/ui/modal';
import { useToast, Toast, ToastTitle, ToastDescription } from '@/components/ui/toast';
import { VStack } from '@/components/ui/vstack';
import { Text } from 'react-native';
import { useCreateThread } from '../model/useCreateThread';

interface CreateThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
  onThreadCreated?: () => void;
}

export function CreateThreadModal({
  isOpen,
  onClose,
  channelId,
  onThreadCreated,
}: CreateThreadModalProps) {
  const toast = useToast();

  const showErrorToast = (message: string) => {
    toast.show({
      placement: 'top right',
      render: ({ id }) => (
        <Toast nativeID={`toast-${id}`} action="error" variant="outline">
          <HStack space="sm">
            <Icon as={AlertCircleIcon} className="mt-0.5" />
            <ToastTitle>Error</ToastTitle>
          </HStack>
          <ToastDescription>{message}</ToastDescription>
        </Toast>
      ),
    });
  };

  const showSuccessToast = (message: string) => {
    toast.show({
      placement: 'top right',
      render: ({ id }) => (
        <Toast nativeID={`toast-${id}`} action="success" variant="outline">
          <HStack space="sm">
            <Icon as={CheckCircleIcon} className="mt-0.5" />
            <ToastTitle>Éxito</ToastTitle>
          </HStack>
          <ToastDescription>{message}</ToastDescription>
        </Toast>
      ),
    });
  };

  const {
    threadName,
    setThreadName,
    threadDescription,
    setThreadDescription,
    isLoading,
    errors,
    setErrors,
    handleCreateThread,
    handleClose,
  } = useCreateThread({
    channelId,
    onClose,
    onThreadCreated,
    onError: showErrorToast,
    onSuccess: showSuccessToast,
  });

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader className="justify-between">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            Crear nuevo hilo
          </Text>
          <ModalCloseButton onPress={handleClose}>
            <CloseIcon className="w-5 h-5 text-typography-500" />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <VStack space="md">
            <FormControl isInvalid={!!errors.name}>
              <FormControlLabel>
                <FormControlLabelText>Nombre del hilo *</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="ej. Anuncios importantes"
                  value={threadName}
                  onChangeText={(text) => {
                    setThreadName(text);
                    if (errors.name) {
                      setErrors({ ...errors, name: undefined });
                    }
                  }}
                />
              </Input>
              {errors.name && (
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>{errors.name}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.description}>
              <FormControlLabel>
                <FormControlLabelText>Descripción</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="Describe el propósito del hilo (opcional)"
                  value={threadDescription}
                  onChangeText={(text) => {
                    setThreadDescription(text);
                    if (errors.description) {
                      setErrors({ ...errors, description: undefined });
                    }
                  }}
                  multiline
                  numberOfLines={3}
                />
              </Input>
              {errors.description && (
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>{errors.description}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            size="sm"
            onPress={handleClose}
            className="mr-2"
          >
            <ButtonText>Cancelar</ButtonText>
          </Button>
          <Button size="sm" onPress={handleCreateThread} disabled={isLoading}>
            {isLoading && <ButtonSpinner />}
            <ButtonText>Crear hilo</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
