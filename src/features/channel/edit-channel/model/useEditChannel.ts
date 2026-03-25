import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { uploadChannelBanner, uploadChannelIcon } from '@/lib/api/upload';
import { Channel, updateChannel } from '@/src/entities/channel';
import { ImageFile } from '@/src/shared/ui/image-uploader';

interface UseEditChannelProps {
  channel: Channel;
  onClose: () => void;
  onChannelUpdate?: (channel: Channel) => void;
}

export function useEditChannel({ channel, onClose, onChannelUpdate }: UseEditChannelProps) {
  const [name, setName] = useState(channel.name);
  const [description, setDescription] = useState(channel.description || '');
  const [category, setCategory] = useState(channel.category || '');
  const [isPrivate, setIsPrivate] = useState(channel.isPrivate);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  // Image states
  const [avatarImage, setAvatarImage] = useState<ImageFile | null>(null);
  const [bannerImage, setBannerImage] = useState<ImageFile | null>(null);
  const [imageUrl, setImageUrl] = useState(channel.imageUrl || '');
  const [bannerUrl, setBannerUrl] = useState(channel.bannerUrl || '');
  const [errors, setErrors] = useState<{
    avatar?: string;
    banner?: string;
  }>({});

  // Sincronizar el estado con el prop channel cuando cambie
  useEffect(() => {
    setName(channel.name);
    setDescription(channel.description || '');
    setCategory(channel.category || '');
    setIsPrivate(channel.isPrivate);
    setImageUrl(channel.imageUrl || '');
    setBannerUrl(channel.bannerUrl || '');
  }, [channel]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre del canal es obligatorio');
      return;
    }

    setIsLoading(true);
    setIsUploadingImages(true);

    try {
      let newImageUrl = imageUrl;
      let newBannerUrl = bannerUrl;

      // Upload channel image if a new one was selected
      if (avatarImage) {
        try {
          const uploadResult = await uploadChannelIcon(
            avatarImage.uri,
            avatarImage.name,
            avatarImage.type,
          );
          newImageUrl = uploadResult.publicUrl;
        } catch (error: any) {
          console.error('Failed to upload channel image:', error);
          setErrors({
            ...errors,
            avatar: error.message || 'Failed to upload image',
          });
          Alert.alert('Error', 'No se pudo subir la imagen del canal');
          setIsLoading(false);
          setIsUploadingImages(false);
          return;
        }
      }

      // Upload banner if a new one was selected
      if (bannerImage) {
        try {
          const uploadResult = await uploadChannelBanner(
            bannerImage.uri,
            bannerImage.name,
            bannerImage.type,
          );
          newBannerUrl = uploadResult.publicUrl;
        } catch (error: any) {
          console.error('Failed to upload banner:', error);
          setErrors({
            ...errors,
            banner: error.message || 'Failed to upload banner',
          });
          Alert.alert('Error', 'No se pudo subir el banner');
          setIsLoading(false);
          setIsUploadingImages(false);
          return;
        }
      }

      setIsUploadingImages(false);

      const updatedChannel = await updateChannel(channel.id, {
        name: name.trim(),
        description: description.trim() || null,
        category: category.trim() || undefined,
        isPrivate,
        imageUrl: newImageUrl || null,
        bannerUrl: newBannerUrl || null,
      });

      // Update local state
      setImageUrl(newImageUrl);
      setBannerUrl(newBannerUrl);
      setAvatarImage(null);
      setBannerImage(null);

      onChannelUpdate?.(updatedChannel);
      Alert.alert('Éxito', 'Canal actualizado correctamente');
      onClose();
    } catch (error) {
      console.error('Error updating channel:', error);
      Alert.alert('Error', 'No se pudo actualizar el canal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form to original values
    setName(channel.name);
    setDescription(channel.description || '');
    setCategory(channel.category || '');
    setIsPrivate(channel.isPrivate);
    setImageUrl(channel.imageUrl || '');
    setBannerUrl(channel.bannerUrl || '');
    setAvatarImage(null);
    setBannerImage(null);
    setErrors({});
    onClose();
  };

  return {
    name, setName,
    description, setDescription,
    category, setCategory,
    isPrivate, setIsPrivate,
    isLoading,
    isUploadingImages,
    avatarImage, setAvatarImage,
    bannerImage, setBannerImage,
    imageUrl,
    bannerUrl,
    errors, setErrors,
    handleSave,
    handleClose,
  };
}
