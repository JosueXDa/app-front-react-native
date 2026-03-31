import { useChannels } from '@/src/app/providers';
import { createChannel } from '@/src/entities/channel';
import { uploadChannelBanner, uploadChannelIcon } from '@/src/entities/upload';
import { ImageFile } from '@/src/shared/ui/image-uploader';
import { useState } from 'react';

interface UseCreateChannelProps {
    onClose: () => void;
    onError?: (message: string) => void;
    onSuccess?: (message: string) => void;
}

export function useCreateChannel({ onClose, onError, onSuccess }: UseCreateChannelProps) {
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

    const [avatarImage, setAvatarImage] = useState<ImageFile | null>(null);
    const [bannerImage, setBannerImage] = useState<ImageFile | null>(null);
    const [isUploadingImages, setIsUploadingImages] = useState(false);

    const { refreshChannels } = useChannels();

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

    const resetForm = () => {
        setChannelName('');
        setChannelDescription('');
        setCategory('');
        setIsPrivate(false);
        setAvatarImage(null);
        setBannerImage(null);
        setErrors({});
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

            if (avatarImage) {
                try {
                    const uploadResult = await uploadChannelIcon(
                        avatarImage.uri,
                        avatarImage.name,
                        avatarImage.type,
                    );
                    avatarUrl = uploadResult.publicUrl;
                } catch (error: any) {
                    console.error('Failed to upload avatar:', error);
                    setErrors((prev) => ({
                        ...prev,
                        avatar: error.message || 'Failed to upload avatar',
                    }));
                    onError?.('Failed to upload avatar. Please try again.');
                    setIsLoading(false);
                    setIsUploadingImages(false);
                    return;
                }
            }

            if (bannerImage) {
                try {
                    const uploadResult = await uploadChannelBanner(
                        bannerImage.uri,
                        bannerImage.name,
                        bannerImage.type,
                    );
                    bannerUrl = uploadResult.publicUrl;
                } catch (error: any) {
                    console.error('Failed to upload banner:', error);
                    setErrors((prev) => ({
                        ...prev,
                        banner: error.message || 'Failed to upload banner',
                    }));
                    onError?.('Failed to upload banner. Please try again.');
                    setIsLoading(false);
                    setIsUploadingImages(false);
                    return;
                }
            }

            setIsUploadingImages(false);

            await createChannel({
                name: channelName.trim(),
                description: channelDescription.trim() || null,
                category: category.trim() || 'General',
                isPrivate,
                imageUrl: avatarUrl,
                bannerUrl,
            });

            await refreshChannels();

            onSuccess?.(`Channel "${channelName}" created successfully!`);
            resetForm();
            onClose();
        } catch (error: any) {
            console.error('Failed to create channel:', error);
            onError?.(
                error.response?.data?.message || 'Failed to create channel. Please try again.',
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            resetForm();
            onClose();
        }
    };

    return {
        channelName,
        setChannelName,
        channelDescription,
        setChannelDescription,
        category,
        setCategory,
        isPrivate,
        setIsPrivate,
        isLoading,
        errors,
        setErrors,
        avatarImage,
        setAvatarImage,
        bannerImage,
        setBannerImage,
        isUploadingImages,
        handleCreateChannel,
        handleClose,
    };
}

