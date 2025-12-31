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
import { Icon, AlertCircleIcon, CheckCircleIcon, CloseIcon, AddIcon } from '@/components/ui/icon';
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
import { useToast, Toast, ToastTitle, ToastDescription } from '@/components/ui/toast';
import { VStack } from '@/components/ui/vstack';
import { useChannels } from '@/context/ChannelContex';
import { createChannel } from '@/lib/api/chat';
import { uploadChannelIcon, uploadChannelBanner } from '@/lib/api/upload';
import { useState } from 'react';
import { Switch, Text, Image, TouchableOpacity, Platform, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

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
        avatar?: string;
        banner?: string;
    }>({});

    // Image states
    const [avatarImage, setAvatarImage] = useState<{ uri: string; name: string; type: string } | null>(null);
    const [bannerImage, setBannerImage] = useState<{ uri: string; name: string; type: string } | null>(null);
    const [isUploadingImages, setIsUploadingImages] = useState(false);

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

    const pickImage = async (type: 'avatar' | 'banner') => {
        try {
            // Request permission
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    toast.show({
                        placement: "top right",
                        render: ({ id }) => (
                            <Toast nativeID={`toast-${id}`} action="error" variant="outline">
                                <HStack space="sm">
                                    <Icon as={AlertCircleIcon} className="mt-0.5" />
                                    <ToastTitle>Permission Required</ToastTitle>
                                </HStack>
                                <ToastDescription>Sorry, we need camera roll permissions to make this work!</ToastDescription>
                            </Toast>
                        )
                    });
                    return;
                }
            }

            // Pick image
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: type === 'avatar' ? [1, 1] : [16, 9],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                const imageFile = {
                    uri: asset.uri,
                    name: `${type}-${Date.now()}.jpg`,
                    type: asset.type === 'image' ? 'image/jpeg' : asset.mimeType || 'image/jpeg'
                };

                if (type === 'avatar') {
                    setAvatarImage(imageFile);
                    setErrors({ ...errors, avatar: undefined });
                } else {
                    setBannerImage(imageFile);
                    setErrors({ ...errors, banner: undefined });
                }
            }
        } catch (error) {
            console.error('Error picking image:', error);
            toast.show({
                placement: "top right",
                render: ({ id }) => (
                    <Toast nativeID={`toast-${id}`} action="error" variant="outline">
                        <HStack space="sm">
                            <Icon as={AlertCircleIcon} className="mt-0.5" />
                            <ToastTitle>Error</ToastTitle>
                        </HStack>
                        <ToastDescription>Failed to pick image. Please try again.</ToastDescription>
                    </Toast>
                )
            });
        }
    };

    const removeImage = (type: 'avatar' | 'banner') => {
        if (type === 'avatar') {
            setAvatarImage(null);
        } else {
            setBannerImage(null);
        }
    };

    const handleCreateChannel = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setIsUploadingImages(true);
        
        try {
            let avatarUrl: string | null = null;
            let bannerUrl: string | null = null;

            // Upload avatar if selected
            if (avatarImage) {
                try {
                    const uploadResult = await uploadChannelIcon(
                        avatarImage.uri,
                        avatarImage.name,
                        avatarImage.type
                    );
                    avatarUrl = uploadResult.publicUrl;
                } catch (error: any) {
                    console.error('Failed to upload avatar:', error);
                    setErrors({ ...errors, avatar: error.message || 'Failed to upload avatar' });
                    toast.show({
                        placement: "top right",
                        render: ({ id }) => (
                            <Toast nativeID={`toast-${id}`} action="error" variant="outline">
                                <HStack space="sm">
                                    <Icon as={AlertCircleIcon} className="mt-0.5" />
                                    <ToastTitle>Upload Error</ToastTitle>
                                </HStack>
                                <ToastDescription>Failed to upload avatar. Please try again.</ToastDescription>
                            </Toast>
                        )
                    });
                    setIsLoading(false);
                    setIsUploadingImages(false);
                    return;
                }
            }

            // Upload banner if selected
            if (bannerImage) {
                try {
                    const uploadResult = await uploadChannelBanner(
                        bannerImage.uri,
                        bannerImage.name,
                        bannerImage.type
                    );
                    bannerUrl = uploadResult.publicUrl;
                } catch (error: any) {
                    console.error('Failed to upload banner:', error);
                    setErrors({ ...errors, banner: error.message || 'Failed to upload banner' });
                    toast.show({
                        placement: "top right",
                        render: ({ id }) => (
                            <Toast nativeID={`toast-${id}`} action="error" variant="outline">
                                <HStack space="sm">
                                    <Icon as={AlertCircleIcon} className="mt-0.5" />
                                    <ToastTitle>Upload Error</ToastTitle>
                                </HStack>
                                <ToastDescription>Failed to upload banner. Please try again.</ToastDescription>
                            </Toast>
                        )
                    });
                    setIsLoading(false);
                    setIsUploadingImages(false);
                    return;
                }
            }

            setIsUploadingImages(false);

            // Create channel with uploaded image URLs
            await createChannel({
                name: channelName.trim(),
                description: channelDescription.trim() || null,
                category: category.trim() || 'General',
                isPrivate,
                imageUrl: avatarUrl,
                bannerUrl: bannerUrl,
            });

            // Refresh the channels list
            await refreshChannels();

            // Show success toast
            toast.show({
                placement: "top right",
                render: ({ id }) => (
                    <Toast nativeID={`toast-${id}`} action="success" variant="outline">
                        <HStack space="sm">
                            <Icon as={CheckCircleIcon} className="mt-0.5" />
                            <ToastTitle>Success</ToastTitle>
                        </HStack>
                        <ToastDescription>{`Channel "${channelName}" created successfully!`}</ToastDescription>
                    </Toast>
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
                    <Toast nativeID={`toast-${id}`} action="error" variant="outline">
                        <HStack space="sm">
                            <Icon as={AlertCircleIcon} className="mt-0.5" />
                            <ToastTitle>Error</ToastTitle>
                        </HStack>
                        <ToastDescription>{error.response?.data?.message || 'Failed to create channel. Please try again.'}</ToastDescription>
                    </Toast>
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
        setAvatarImage(null);
        setBannerImage(null);
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
                    <ScrollView showsVerticalScrollIndicator={false}>
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

                            {/* Channel Avatar */}
                            <FormControl isInvalid={!!errors.avatar}>
                                <FormControlLabel>
                                    <FormControlLabelText className="font-semibold">
                                        Channel Avatar (Icon)
                                    </FormControlLabelText>
                                </FormControlLabel>
                                <VStack className="gap-2 mt-2">
                                    {avatarImage ? (
                                        <HStack className="items-center gap-3">
                                            <Image
                                                source={{ uri: avatarImage.uri }}
                                                style={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: 40,
                                                }}
                                                resizeMode="cover"
                                            />
                                            <VStack className="flex-1">
                                                <Text className="text-sm font-medium text-typography-900 dark:text-typography-50">
                                                    {avatarImage.name}
                                                </Text>
                                                <Text className="text-xs text-typography-500">
                                                    Avatar selected
                                                </Text>
                                            </VStack>
                                            <TouchableOpacity
                                                onPress={() => removeImage('avatar')}
                                                disabled={isLoading}
                                            >
                                                <Icon
                                                    as={CloseIcon}
                                                    className="w-6 h-6 text-error-500"
                                                />
                                            </TouchableOpacity>
                                        </HStack>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            onPress={() => pickImage('avatar')}
                                            disabled={isLoading}
                                            size="md"
                                        >
                                            <Icon as={AddIcon} className="mr-2" />
                                            <ButtonText>Choose Avatar</ButtonText>
                                        </Button>
                                    )}
                                </VStack>
                                {errors.avatar && (
                                    <FormControlError className="mt-1">
                                        <FormControlErrorIcon as={AlertCircleIcon} />
                                        <FormControlErrorText>
                                            {errors.avatar}
                                        </FormControlErrorText>
                                    </FormControlError>
                                )}
                                <FormControlHelper className="mt-1">
                                    <FormControlHelperText className="text-sm">
                                        Square image recommended. Max 5MB (JPG, PNG, GIF, WebP)
                                    </FormControlHelperText>
                                </FormControlHelper>
                            </FormControl>

                            {/* Channel Banner */}
                            <FormControl isInvalid={!!errors.banner}>
                                <FormControlLabel>
                                    <FormControlLabelText className="font-semibold">
                                        Channel Banner
                                    </FormControlLabelText>
                                </FormControlLabel>
                                <VStack className="gap-2 mt-2">
                                    {bannerImage ? (
                                        <VStack className="gap-2">
                                            <Image
                                                source={{ uri: bannerImage.uri }}
                                                style={{
                                                    width: '100%',
                                                    height: 120,
                                                    borderRadius: 8,
                                                }}
                                                resizeMode="cover"
                                            />
                                            <HStack className="items-center justify-between">
                                                <VStack className="flex-1">
                                                    <Text className="text-sm font-medium text-typography-900 dark:text-typography-50">
                                                        {bannerImage.name}
                                                    </Text>
                                                    <Text className="text-xs text-typography-500">
                                                        Banner selected
                                                    </Text>
                                                </VStack>
                                                <TouchableOpacity
                                                    onPress={() => removeImage('banner')}
                                                    disabled={isLoading}
                                                >
                                                    <Icon
                                                        as={CloseIcon}
                                                        className="w-6 h-6 text-error-500"
                                                    />
                                                </TouchableOpacity>
                                            </HStack>
                                        </VStack>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            onPress={() => pickImage('banner')}
                                            disabled={isLoading}
                                            size="md"
                                        >
                                            <Icon as={AddIcon} className="mr-2" />
                                            <ButtonText>Choose Banner</ButtonText>
                                        </Button>
                                    )}
                                </VStack>
                                {errors.banner && (
                                    <FormControlError className="mt-1">
                                        <FormControlErrorIcon as={AlertCircleIcon} />
                                        <FormControlErrorText>
                                            {errors.banner}
                                        </FormControlErrorText>
                                    </FormControlError>
                                )}
                                <FormControlHelper className="mt-1">
                                    <FormControlHelperText className="text-sm">
                                        16:9 aspect ratio recommended. Max 5MB (JPG, PNG, GIF, WebP)
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

                            {/* Upload Progress Indicator */}
                            {isUploadingImages && (
                                <HStack className="items-center gap-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                                    <ButtonSpinner />
                                    <Text className="text-sm text-primary-600 dark:text-primary-400">
                                        Uploading images...
                                    </Text>
                                </HStack>
                            )}
                        </VStack>
                    </ScrollView>
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
