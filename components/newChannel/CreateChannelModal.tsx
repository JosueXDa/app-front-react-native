import { ToastAlert } from '@/components/auth/ToastAlert';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import {
    FormControl,
    FormControlError,
    FormControlErrorIcon,
    FormControlErrorText,
    FormControlHelper,
    FormControlHelperText,
    FormControlLabel,
    FormControlLabelText
} from '@/components/ui/form-control';
import { HStack } from '@/components/ui/hstack';
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
import { useChannels } from '@/context/ChannelContex';
import { createChannel } from '@/lib/api/chat';
import { useState } from 'react';
import { Switch, Text } from 'react-native';

interface CreateChannelModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateChannelModal({ isOpen, onClose }: CreateChannelModalProps) {
    const [channelName, setChannelName] = useState('');
    const [channelDescription, setChannelDescription] = useState('');
    const [category, setCategory] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{
        name?: string;
        description?: string;
        category?: string;
    }>({});

    const { refreshChannels } = useChannels();
    const toast = useToast();

    const validateForm = () => {
        const newErrors: typeof errors = {};

        if (!channelName.trim()) {
            newErrors.name = 'Channel name is required';
        } else if (channelName.trim().length < 3) {
            newErrors.name = 'Channel name must be at least 3 characters';
        } else if (channelName.trim().length > 100) {
            newErrors.name = 'Channel name must be less than 100 characters';
        }

        if (channelDescription && channelDescription.length > 500) {
            newErrors.description = 'Description must be less than 500 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateChannel = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            await createChannel({
                name: channelName.trim(),
                description: channelDescription.trim() || null,
                category: category.trim() || 'General',
                isPrivate,
            });

            // Refresh the channels list
            await refreshChannels();

            // Show success toast
            toast.show({
                placement: "top right",
                render: ({ id }) => (
                    <ToastAlert 
                        id={id} 
                        title="Success" 
                        description={`Channel "${channelName}" created successfully!`} 
                    />
                )
            });

            // Reset form and close modal
            resetForm();
            onClose();
        } catch (error: any) {
            console.error('Failed to create channel:', error);
            toast.show({
                placement: "top right",
                render: ({ id }) => (
                    <ToastAlert 
                        id={id} 
                        title="Error" 
                        description={error.response?.data?.message || 'Failed to create channel. Please try again.'} 
                    />
                )
            });
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setChannelName('');
        setChannelDescription('');
        setCategory('');
        setIsPrivate(false);
        setErrors({});
    };

    const handleClose = () => {
        if (!isLoading) {
            resetForm();
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="md">
            <ModalBackdrop />
            <ModalContent className="max-h-[90%]">
                <ModalHeader className="border-b border-outline-100 pb-4">
                    <HStack className="justify-between items-center flex-1">
                        <Text className="text-xl font-bold text-typography-900 dark:text-typography-50">
                            Create New Channel
                        </Text>
                        <ModalCloseButton onPress={handleClose} disabled={isLoading}>
                            <CloseIcon className="w-5 h-5 text-typography-500" />
                        </ModalCloseButton>
                    </HStack>
                </ModalHeader>

                <ModalBody>
                    <VStack className="gap-5 py-2">
                        {/* Channel Name */}
                        <FormControl
                            isInvalid={!!errors.name}
                            isRequired
                        >
                            <FormControlLabel>
                                <FormControlLabelText className="font-semibold">
                                    Channel Name
                                </FormControlLabelText>
                            </FormControlLabel>
                            <Input size="md" variant="outline" className="mt-1">
                                <InputField
                                    placeholder="e.g., General, Tech Talk, Random"
                                    value={channelName}
                                    onChangeText={(text) => {
                                        setChannelName(text);
                                        if (errors.name) {
                                            setErrors({ ...errors, name: undefined });
                                        }
                                    }}
                                    maxLength={100}
                                    autoCapitalize="words"
                                />
                            </Input>
                            {errors.name && (
                                <FormControlError className="mt-1">
                                    <FormControlErrorIcon as={AlertCircleIcon} />
                                    <FormControlErrorText>
                                        {errors.name}
                                    </FormControlErrorText>
                                </FormControlError>
                            )}
                            <FormControlHelper className="mt-1">
                                <FormControlHelperText className="text-sm">
                                    {channelName.length}/100 characters
                                </FormControlHelperText>
                            </FormControlHelper>
                        </FormControl>

                        {/* Channel Description */}
                        <FormControl isInvalid={!!errors.description}>
                            <FormControlLabel>
                                <FormControlLabelText className="font-semibold">
                                    Description
                                </FormControlLabelText>
                            </FormControlLabel>
                            <Input size="md" variant="outline" className="mt-1">
                                <InputField
                                    placeholder="Describe what this channel is about (optional)"
                                    value={channelDescription}
                                    onChangeText={(text) => {
                                        setChannelDescription(text);
                                        if (errors.description) {
                                            setErrors({ ...errors, description: undefined });
                                        }
                                    }}
                                    maxLength={500}
                                    multiline
                                    numberOfLines={3}
                                />
                            </Input>
                            {errors.description && (
                                <FormControlError className="mt-1">
                                    <FormControlErrorIcon as={AlertCircleIcon} />
                                    <FormControlErrorText>
                                        {errors.description}
                                    </FormControlErrorText>
                                </FormControlError>
                            )}
                            <FormControlHelper className="mt-1">
                                <FormControlHelperText className="text-sm">
                                    {channelDescription.length}/500 characters
                                </FormControlHelperText>
                            </FormControlHelper>
                        </FormControl>

                        {/* Category */}
                        <FormControl>
                            <FormControlLabel>
                                <FormControlLabelText className="font-semibold">
                                    Category
                                </FormControlLabelText>
                            </FormControlLabel>
                            <Input size="md" variant="outline" className="mt-1">
                                <InputField
                                    placeholder="e.g., General, Technology, Sports (optional)"
                                    value={category}
                                    onChangeText={setCategory}
                                    autoCapitalize="words"
                                />
                            </Input>
                            <FormControlHelper className="mt-1">
                                <FormControlHelperText className="text-sm">
                                    Helps organize channels. Defaults to &quot;General&quot;
                                </FormControlHelperText>
                            </FormControlHelper>
                        </FormControl>

                        {/* Private Channel Toggle */}
                        <FormControl>
                            <HStack className="items-center justify-between py-2">
                                <VStack className="flex-1 mr-4">
                                    <FormControlLabel className="mb-0">
                                        <FormControlLabelText className="font-semibold">
                                            Private Channel
                                        </FormControlLabelText>
                                    </FormControlLabel>
                                    <FormControlHelper className="mt-1">
                                        <FormControlHelperText className="text-sm">
                                            Only invited members can see and join this channel
                                        </FormControlHelperText>
                                    </FormControlHelper>
                                </VStack>
                                <Switch
                                    value={isPrivate}
                                    onValueChange={setIsPrivate}
                                    trackColor={{ 
                                        false: '#d1d5db', 
                                        true: '#3b82f6' 
                                    }}
                                    thumbColor={isPrivate ? '#ffffff' : '#f3f4f6'}
                                />
                            </HStack>
                        </FormControl>
                    </VStack>
                </ModalBody>

                <ModalFooter className="border-t border-outline-100 pt-4">
                    <HStack className="gap-3 justify-end w-full">
                        <Button
                            variant="outline"
                            onPress={handleClose}
                            disabled={isLoading}
                            size="md"
                        >
                            <ButtonText>Cancel</ButtonText>
                        </Button>
                        <Button
                            action="primary"
                            onPress={handleCreateChannel}
                            disabled={isLoading || !channelName.trim()}
                            size="md"
                        >
                            {isLoading && <ButtonSpinner />}
                            <ButtonText>
                                {isLoading ? 'Creating...' : 'Create Channel'}
                            </ButtonText>
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
