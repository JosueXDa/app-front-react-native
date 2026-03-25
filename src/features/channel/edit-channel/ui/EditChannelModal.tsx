import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
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
import { Channel } from '@/src/entities/channel';
import { ImageUploader } from '@/src/shared/ui/image-uploader';
import { Hash, Lock, X } from 'lucide-react-native';
import React from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useEditChannel } from '../model/useEditChannel';

interface EditChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: Channel;
  onChannelUpdate?: (channel: Channel) => void;
}

export function EditChannelModal({
  isOpen,
  onClose,
  channel,
  onChannelUpdate,
}: EditChannelModalProps) {
  const {
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
  } = useEditChannel({ channel, onClose, onChannelUpdate });

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
                    {bannerImage?.uri || bannerUrl ? (
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
                        {avatarImage?.uri || imageUrl ? (
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
                        <Text
                          className="text-gray-500 dark:text-gray-400 text-sm mt-1"
                          numberOfLines={3}
                        >
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
