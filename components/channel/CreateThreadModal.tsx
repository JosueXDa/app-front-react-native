import { ToastAlert } from '@/components/auth/ToastAlert';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import {
    FormControl,
    FormControlError,
    FormControlErrorIcon,
    FormControlErrorText,
    FormControlLabel,
    FormControlLabelText
} from '@/components/ui/form-control';
import { AlertCircleIcon, CloseIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import {
    Modal,
    ModalBackdrop,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader
} from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { VStack } from '@/components/ui/vstack';
import { createThread } from '@/lib/api/chat';
import { useState } from 'react';
import { Text } from 'react-native';

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
    onThreadCreated 
}: CreateThreadModalProps) {
    const [threadName, setThreadName] = useState('');
    const [threadDescription, setThreadDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{
        name?: string;
        description?: string;
    }>({});

    const toast = useToast();

    const validateForm = () => {
        const newErrors: typeof errors = {};

        if (!threadName.trim()) {
            newErrors.name = 'El nombre del hilo es requerido';
        } else if (threadName.trim().length < 3) {
            newErrors.name = 'El nombre debe tener al menos 3 caracteres';
        } else if (threadName.trim().length > 100) {
            newErrors.name = 'El nombre debe tener menos de 100 caracteres';
        }

        if (threadDescription && threadDescription.length > 500) {
            newErrors.description = 'La descripción debe tener menos de 500 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateThread = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            await createThread({
                channelId,
                name: threadName.trim(),
                description: threadDescription.trim() || undefined,
            });

            toast.show({
                placement: "top right",
                render: ({ id }) => (
                    <ToastAlert 
                        id={id} 
                        title="Éxito" 
                        description={`Hilo "${threadName}" creado exitosamente!`} 
                    />
                )
            });

            // Reset form
            setThreadName('');
            setThreadDescription('');
            setErrors({});
            
            // Notify parent component
            onThreadCreated?.();
            
            // Close modal
            onClose();
        } catch (error: any) {
            console.error('Error creating thread:', error);
            toast.show({
                placement: "top right",
                render: ({ id }) => (
                    <ToastAlert 
                        id={id} 
                        title="Error" 
                        description={error?.response?.data?.message || 'Failed to create thread. Please try again.'} 
                    />
                )
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setThreadName('');
        setThreadDescription('');
        setErrors({});
        onClose();
    };

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
                                <FormControlLabelText>
                                    Nombre del hilo *
                                </FormControlLabelText>
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
                                    <FormControlErrorText>
                                        {errors.name}
                                    </FormControlErrorText>
                                </FormControlError>
                            )}
                        </FormControl>

                        <FormControl isInvalid={!!errors.description}>
                            <FormControlLabel>
                                <FormControlLabelText>
                                    Descripción
                                </FormControlLabelText>
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
                                    <FormControlErrorText>
                                        {errors.description}
                                    </FormControlErrorText>
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
                    <Button 
                        size="sm" 
                        onPress={handleCreateThread}
                        disabled={isLoading}
                    >
                        {isLoading && <ButtonSpinner />}
                        <ButtonText>Crear hilo</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
