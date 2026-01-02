import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Switch, Alert, Image, TextInput } from 'react-native';
import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
} from '@/components/ui/modal';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Channel, updateChannel } from '@/lib/api/chat';
import { ImageFile, ImageUploader } from '@/components/image-picker';
import { uploadChannelIcon, uploadChannelBanner } from '@/lib/api/upload';
import { Hash, Lock, X } from 'lucide-react-native';

interface BasicInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    channel: Channel;
    onChannelUpdate?: (channel: Channel) => void;
}

export function BasicInfoModal({
    isOpen,
    onClose,
    channel,
    onChannelUpdate,
}: BasicInfoModalProps) {
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
                        avatarImage.type
                    );
                    newImageUrl = uploadResult.publicUrl;
                } catch (error: any) {
                    console.error('Failed to upload channel image:', error);
                    setErrors({ ...errors, avatar: error.message || 'Failed to upload image' });
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
                        bannerImage.type
                    );
                    newBannerUrl = uploadResult.publicUrl;
                } catch (error: any) {
                    console.error('Failed to upload banner:', error);
                    setErrors({ ...errors, banner: error.message || 'Failed to upload banner' });
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

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="xl">
            <ModalBackdrop />
            <ModalContent className="bg-white dark:bg-[#36393f] max-h-[90vh]">
                <ModalHeader className="border-b border-gray-200 dark:border-gray-700">
                    <Text className="text-xl font-bold text-gray-900 dark:text-white">
                        Información del Canal
                    </Text>
                    <ModalCloseButton onPress={handleClose}>
                        <X size={20} color="#6b7280" />
                    </ModalCloseButton>
                </ModalHeader>

                <ModalBody className="p-0">
                    <View className="flex-row flex-1">
                        {/* Left Column - Preview */}
                        <View className="w-80 bg-gray-50 dark:bg-[#2f3136] border-r border-gray-200 dark:border-gray-700">
                            <ScrollView className="p-6">
                                <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-4">
                                    Vista Previa
                                </Text>
                                
                                {/* Channel Preview */}
                                <View className="bg-white dark:bg-[#36393f] rounded-lg overflow-hidden shadow-sm">
                                    {/* Banner */}
                                    <View className="h-24 w-full bg-primary-500">
                                        {(bannerImage?.uri || bannerUrl) ? (
                                            <Image
                                                source={{ uri: bannerImage?.uri || bannerUrl }}
                                                className="w-full h-24"
                                                resizeMode="cover"
                                            />
                                        ) : null}
                                    </View>
                                    
                                    {/* Channel Icon/Avatar */}
                                    <View className="px-4 pb-4 relative">
                                        <View className="absolute -top-10 left-4 p-1 bg-white dark:bg-[#36393f] rounded-full">
                                            <Avatar size="xl">
                                                {(avatarImage?.uri || imageUrl) ? (
                                                    <AvatarImage 
                                                        source={{ uri: avatarImage?.uri || imageUrl }} 
                                                        alt={name} 
                                                    />
                                                ) : (
                                                    <View className="w-full h-full items-center justify-center bg-primary-100 dark:bg-primary-900 rounded-full">
                                                        {isPrivate ? (
                                                            <Lock size={32} color="#6366f1" />
                                                        ) : (
                                                            <Hash size={32} color="#6366f1" />
                                                        )}
                                                    </View>
                                                )}
                                            </Avatar>
                                        </View>

                                        <View className="mt-14">
                                            <Text className="text-xl font-bold text-gray-900 dark:text-white">
                                                {name || 'Nombre del Canal'}
                                            </Text>
                                            {description && (
                                                <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1" numberOfLines={3}>
                                                    {description}
                                                </Text>
                                            )}
                                            {category && (
                                                <View className="flex-row flex-wrap mt-2">
                                                    {category.split(',').map((cat, index) => (
                                                        <View 
                                                            key={index}
                                                            className="bg-primary-100 dark:bg-primary-900 px-2 py-1 mr-2 mb-1 rounded"
                                                        >
                                                            <Text className="text-xs font-medium text-primary-700 dark:text-primary-300">
                                                                {cat.trim()}
                                                            </Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </View>

                                {/* Privacy Badge */}
                                <View className="mt-4 p-3 bg-white dark:bg-[#36393f] rounded-lg">
                                    <View className="flex-row items-center">
                                        {isPrivate ? (
                                            <>
                                                <Lock size={16} color="#6b7280" />
                                                <Text className="text-sm text-gray-700 dark:text-gray-300 ml-2">
                                                    Canal Privado
                                                </Text>
                                            </>
                                        ) : (
                                            <>
                                                <Hash size={16} color="#6b7280" />
                                                <Text className="text-sm text-gray-700 dark:text-gray-300 ml-2">
                                                    Canal Público
                                                </Text>
                                            </>
                                        )}
                                    </View>
                                </View>
                            </ScrollView>
                        </View>

                        {/* Right Column - Form */}
                        <View className="flex-1 bg-white dark:bg-[#36393f]">
                            <ScrollView className="p-6">
                                <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-4">
                                    Información del Canal
                                </Text>

                                {/* Channel Name */}
                                <View className="mb-4">
                                    <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Nombre del Canal *
                                    </Text>
                                    <Input>
                                        <InputField
                                            value={name}
                                            onChangeText={setName}
                                            placeholder="Ej: Desarrollo General"
                                            maxLength={100}
                                            className="text-gray-900 dark:text-white"
                                        />
                                    </Input>
                                </View>

                                {/* Description */}
                                <View className="mb-4">
                                    <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Descripción
                                    </Text>
                                    <View className="border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-[#202225]">
                                        <TextInput
                                            value={description}
                                            onChangeText={setDescription}
                                            placeholder="Describe el propósito del canal..."
                                            multiline
                                            numberOfLines={3}
                                            className="text-gray-900 dark:text-white min-h-[60px]"
                                            placeholderTextColor="#9ca3af"
                                            maxLength={500}
                                        />
                                    </View>
                                    <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {description.length}/500 caracteres
                                    </Text>
                                </View>

                                {/* Category */}
                                <View className="mb-4">
                                    <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Categoría
                                    </Text>
                                    <Input>
                                        <InputField
                                            value={category}
                                            onChangeText={setCategory}
                                            placeholder="Ej: Tecnología, Marketing"
                                            maxLength={100}
                                            className="text-gray-900 dark:text-white"
                                        />
                                    </Input>
                                    <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Separa múltiples categorías con comas
                                    </Text>
                                </View>

                                {/* Privacy Toggle */}
                                <View className="mb-6">
                                    <View className="flex-row items-center justify-between py-3 px-4 bg-gray-50 dark:bg-[#2f3136] rounded-lg">
                                        <View className="flex-1 mr-4">
                                            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                Canal Privado
                                            </Text>
                                            <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Solo los miembros pueden ver este canal
                                            </Text>
                                        </View>
                                        <Switch
                                            value={isPrivate}
                                            onValueChange={setIsPrivate}
                                            trackColor={{ false: '#d1d5db', true: '#6366f1' }}
                                            thumbColor="#ffffff"
                                        />
                                    </View>
                                </View>

                                <View className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                                    <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-4">
                                        Imágenes
                                    </Text>

                                    {/* Channel Image Upload */}
                                    <View className="mb-4">
                                        <ImageUploader
                                            type="avatar"
                                            label="Imagen del Canal"
                                            helperText="Sube un icono para el canal"
                                            image={avatarImage}
                                            onImageSelected={(image) => {
                                                setAvatarImage(image);
                                                setErrors({ ...errors, avatar: undefined });
                                            }}
                                            onImageRemoved={() => setAvatarImage(null)}
                                            error={errors.avatar}
                                            disabled={isLoading}
                                            onError={(msg) => Alert.alert('Error', msg)}
                                        />
                                    </View>

                                    {/* Banner Upload */}
                                    <View className="mb-4">
                                        <ImageUploader
                                            type="banner"
                                            label="Banner"
                                            helperText="Sube un banner para el canal"
                                            image={bannerImage}
                                            onImageSelected={(image) => {
                                                setBannerImage(image);
                                                setErrors({ ...errors, banner: undefined });
                                            }}
                                            onImageRemoved={() => setBannerImage(null)}
                                            error={errors.banner}
                                            disabled={isLoading}
                                            onError={(msg) => Alert.alert('Error', msg)}
                                        />
                                    </View>
                                </View>

                                {/* Upload Progress Indicator */}
                                {isUploadingImages && (
                                    <View className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex-row items-center gap-2">
                                        <ButtonSpinner />
                                        <Text className="text-sm text-indigo-600 dark:text-indigo-400">
                                            Subiendo imágenes...
                                        </Text>
                                    </View>
                                )}
                            </ScrollView>
                        </View>
                    </View>
                </ModalBody>

                <ModalFooter className="border-t border-gray-200 dark:border-gray-700">
                    <View className="flex-row gap-3 w-full">
                        <Button
                            variant="outline"
                            size="md"
                            className="flex-1"
                            onPress={handleClose}
                            disabled={isLoading}
                        >
                            <ButtonText>Cancelar</ButtonText>
                        </Button>
                        <Button
                            size="md"
                            className="flex-1 bg-indigo-600"
                            onPress={handleSave}
                            disabled={isLoading || !name.trim()}
                        >
                            {isLoading ? (
                                <ButtonText>Guardando...</ButtonText>
                            ) : (
                                <ButtonText>Guardar Cambios</ButtonText>
                            )}
                        </Button>
                    </View>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
