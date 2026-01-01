import { ImageFile, ImageUploader } from '@/components/image-picker';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { AlertCircleIcon, CheckCircleIcon, Icon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';
import { authApi, User } from '@/lib/api';
import { uploadUserAvatar, uploadUserBanner } from '@/lib/api/upload';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TextInput, View } from 'react-native';

interface MyAccountSectionProps {
  user: User | null;
  updateUser: (updatedUser: User) => void;
}

export function MyAccountSection({ user, updateUser }: MyAccountSectionProps) {
  const toast = useToast();
  
  // Form states
  const [displayName, setDisplayName] = useState(user?.profile?.displayName || user?.name || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [errors, setErrors] = useState<{
    avatar?: string;
    banner?: string;
  }>({});

  // Image states
  const [avatarImage, setAvatarImage] = useState<ImageFile | null>(null);
  const [bannerImage, setBannerImage] = useState<ImageFile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(user?.profile?.avatarUrl || '');
  const [bannerUrl, setBannerUrl] = useState(user?.profile?.bannerUrl || '');

  const showErrorToast = (message: string) => {
    toast.show({
      placement: "top right",
      render: ({ id }) => (
        <Toast nativeID={`toast-${id}`} action="error" variant="outline">
          <HStack space="sm">
            <Icon as={AlertCircleIcon} className="mt-0.5" />
            <ToastTitle>Error</ToastTitle>
          </HStack>
          <ToastDescription>{message}</ToastDescription>
        </Toast>
      )
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setIsUploadingImages(true);
    
    try {
      let newAvatarUrl = avatarUrl;
      let newBannerUrl = bannerUrl;

      // Upload avatar if a new one was selected
      if (avatarImage) {
        try {
          const uploadResult = await uploadUserAvatar(
            avatarImage.uri,
            avatarImage.name,
            avatarImage.type
          );
          newAvatarUrl = uploadResult.publicUrl;
        } catch (error: any) {
          console.error('Failed to upload avatar:', error);
          setErrors({ ...errors, avatar: error.message || 'Failed to upload avatar' });
          showErrorToast('Failed to upload avatar. Please try again.');
          setIsSaving(false);
          setIsUploadingImages(false);
          return;
        }
      }

      // Upload banner if a new one was selected
      if (bannerImage) {
        try {
          const uploadResult = await uploadUserBanner(
            bannerImage.uri,
            bannerImage.name,
            bannerImage.type
          );
          newBannerUrl = uploadResult.publicUrl;
        } catch (error: any) {
          console.error('Failed to upload banner:', error);
          setErrors({ ...errors, banner: error.message || 'Failed to upload banner' });
          showErrorToast('Failed to upload banner. Please try again.');
          setIsSaving(false);
          setIsUploadingImages(false);
          return;
        }
      }

      setIsUploadingImages(false);

      if (!user?.id) {
        showErrorToast('User not found. Please try logging in again.');
        setIsSaving(false);
        return;
      }

      // Call API to update profile
      const updatedUser = await authApi.updateProfile(user.id, {
        profile: {
          displayName,
          bio: bio || null,
          avatarUrl: newAvatarUrl || null,
          bannerUrl: newBannerUrl || null,
        },
      });
      
      // Update context with new user data
      updateUser(updatedUser);
      
      // Update local state
      setAvatarUrl(newAvatarUrl);
      setBannerUrl(newBannerUrl);
      setAvatarImage(null);
      setBannerImage(null);

      // Show success toast
      toast.show({
        placement: "top right",
        render: ({ id }) => (
          <Toast nativeID={`toast-${id}`} action="success" variant="outline">
            <HStack space="sm">
              <Icon as={CheckCircleIcon} className="mt-0.5" />
              <ToastTitle>Success</ToastTitle>
            </HStack>
            <ToastDescription>Profile updated successfully!</ToastDescription>
          </Toast>
        )
      });

      setTimeout(() => {
        setIsSaving(false);
      }, 1000);
    } catch (error) {
      console.error('Error saving profile:', error);
      showErrorToast('Failed to update profile. Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <ScrollView className="flex-1">
      <View className="p-6">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          My Account
        </Text>

        {/* Profile Preview */}
        <View className="mb-6 bg-gray-100 dark:bg-[#2f3136] rounded-lg overflow-hidden">
          {/* Banner */}
          <View className="h-24 w-full bg-indigo-500">
            {(bannerImage?.uri || bannerUrl) ? (
              <Image
                source={{ uri: bannerImage?.uri || bannerUrl }}
                className="w-full h-24"
                resizeMode="cover"
              />
            ) : null}
          </View>
          
          {/* Avatar */}
          <View className="px-4 pb-4 relative">
            <View className="absolute -top-10 left-4 p-1 bg-gray-100 dark:bg-[#2f3136] rounded-full">
              <Avatar size="xl">
                {(avatarImage?.uri || avatarUrl) ? (
                  <AvatarImage source={{ uri: avatarImage?.uri || avatarUrl }} alt={displayName} />
                ) : (
                  <AvatarFallbackText>{displayName}</AvatarFallbackText>
                )}
              </Avatar>
            </View>

            <View className="mt-14">
              <Text className="text-xl font-bold text-gray-900 dark:text-white">
                {displayName || 'Display Name'}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                #{user?.id.substring(0, 4)}
              </Text>
            </View>
          </View>
        </View>

        {/* Display Name */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Display Name
          </Text>
          <Input>
            <InputField
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Enter your display name"
              className="text-gray-900 dark:text-white"
            />
          </Input>
        </View>

        {/* Avatar Upload */}
        <View className="mb-4">
          <ImageUploader
            type="avatar"
            label="Avatar"
            helperText="Upload a new avatar image or keep the current one"
            image={avatarImage}
            onImageSelected={(image) => {
              setAvatarImage(image);
              setErrors({ ...errors, avatar: undefined });
            }}
            onImageRemoved={() => setAvatarImage(null)}
            error={errors.avatar}
            disabled={isSaving}
            onError={showErrorToast}
          />
        </View>

        {/* Banner Upload */}
        <View className="mb-4">
          <ImageUploader
            type="banner"
            label="Banner"
            helperText="Upload a new banner image or keep the current one"
            image={bannerImage}
            onImageSelected={(image) => {
              setBannerImage(image);
              setErrors({ ...errors, banner: undefined });
            }}
            onImageRemoved={() => setBannerImage(null)}
            error={errors.banner}
            disabled={isSaving}
            onError={showErrorToast}
          />
        </View>

        {/* Bio */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Bio
          </Text>
          <View className="border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-[#202225]">
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself..."
              multiline
              numberOfLines={4}
              className="text-gray-900 dark:text-white min-h-[80px]"
              placeholderTextColor="#9ca3af"
            />
          </View>
          <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {bio.length}/190 characters
          </Text>
        </View>

        {/* Upload Progress Indicator */}
        {isUploadingImages && (
          <View className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex-row items-center gap-2">
            <ButtonSpinner />
            <Text className="text-sm text-indigo-600 dark:text-indigo-400">
              Uploading images...
            </Text>
          </View>
        )}

        {/* Save Button */}
        <Button
          onPress={handleSave}
          disabled={isSaving}
          className="bg-indigo-600"
        >
          <ButtonText>{isSaving ? 'Saving...' : 'Save Changes'}</ButtonText>
        </Button>
      </View>
    </ScrollView>
  );
}
