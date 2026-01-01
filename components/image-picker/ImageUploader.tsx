import { Button, ButtonText } from '@/components/ui/button';
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
import { Icon, AlertCircleIcon, CloseIcon, AddIcon } from '@/components/ui/icon';
import { VStack } from '@/components/ui/vstack';
import * as ImagePicker from 'expo-image-picker';
import { Platform, Image, Text, TouchableOpacity } from 'react-native';

export interface ImageFile {
    uri: string;
    name: string;
    type: string;
}

export interface ImageUploaderProps {
    /** Tipo de imagen: avatar (1:1) o banner (16:9) */
    type: 'avatar' | 'banner';
    /** Etiqueta del campo */
    label: string;
    /** Texto de ayuda descriptivo */
    helperText?: string;
    /** Imagen actual seleccionada */
    image: ImageFile | null;
    /** Callback cuando se selecciona una imagen */
    onImageSelected: (image: ImageFile) => void;
    /** Callback cuando se remueve la imagen */
    onImageRemoved: () => void;
    /** Mensaje de error si existe */
    error?: string;
    /** Si el componente está deshabilitado */
    disabled?: boolean;
    /** Callback para mostrar toast de error */
    onError?: (message: string) => void;
}

export function ImageUploader({
    type,
    label,
    helperText,
    image,
    onImageSelected,
    onImageRemoved,
    error,
    disabled = false,
    onError
}: ImageUploaderProps) {
    
    const pickImage = async () => {
        try {
            // Request permission
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    const errorMessage = 'Sorry, we need camera roll permissions to make this work!';
                    if (onError) {
                        onError(errorMessage);
                    }
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
                const imageFile: ImageFile = {
                    uri: asset.uri,
                    name: `${type}-${Date.now()}.jpg`,
                    type: asset.type === 'image' ? 'image/jpeg' : asset.mimeType || 'image/jpeg'
                };

                onImageSelected(imageFile);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            const errorMessage = 'Failed to pick image. Please try again.';
            if (onError) {
                onError(errorMessage);
            }
        }
    };

    const getImageStyle = () => {
        if (type === 'avatar') {
            return {
                width: 80,
                height: 80,
                borderRadius: 40,
            };
        } else {
            return {
                width: '100%' as const,
                height: 120,
                borderRadius: 8,
            };
        }
    };

    const defaultHelperText = type === 'avatar'
        ? 'Square image recommended. Max 5MB (JPG, PNG, GIF, WebP)'
        : '16:9 aspect ratio recommended. Max 5MB (JPG, PNG, GIF, WebP)';

    const typeLabel = type === 'avatar' ? 'Avatar' : 'Banner';

    return (
        <FormControl isInvalid={!!error}>
            <FormControlLabel>
                <FormControlLabelText className="font-semibold">
                    {label}
                </FormControlLabelText>
            </FormControlLabel>
            <VStack className="gap-2 mt-2">
                {image ? (
                    type === 'avatar' ? (
                        <HStack className="items-center gap-3">
                            <Image
                                source={{ uri: image.uri }}
                                style={getImageStyle()}
                                resizeMode="cover"
                            />
                            <VStack className="flex-1">
                                <Text className="text-sm font-medium text-typography-900 dark:text-typography-50">
                                    {image.name}
                                </Text>
                                <Text className="text-xs text-typography-500">
                                    {typeLabel} selected
                                </Text>
                            </VStack>
                            <TouchableOpacity
                                onPress={onImageRemoved}
                                disabled={disabled}
                            >
                                <Icon
                                    as={CloseIcon}
                                    className="w-6 h-6 text-error-500"
                                />
                            </TouchableOpacity>
                        </HStack>
                    ) : (
                        <VStack className="gap-2">
                            <Image
                                source={{ uri: image.uri }}
                                style={getImageStyle()}
                                resizeMode="cover"
                            />
                            <HStack className="items-center justify-between">
                                <VStack className="flex-1">
                                    <Text className="text-sm font-medium text-typography-900 dark:text-typography-50">
                                        {image.name}
                                    </Text>
                                    <Text className="text-xs text-typography-500">
                                        {typeLabel} selected
                                    </Text>
                                </VStack>
                                <TouchableOpacity
                                    onPress={onImageRemoved}
                                    disabled={disabled}
                                >
                                    <Icon
                                        as={CloseIcon}
                                        className="w-6 h-6 text-error-500"
                                    />
                                </TouchableOpacity>
                            </HStack>
                        </VStack>
                    )
                ) : (
                    <Button
                        variant="outline"
                        onPress={pickImage}
                        disabled={disabled}
                        size="md"
                    >
                        <Icon as={AddIcon} className="mr-2" />
                        <ButtonText>Choose {typeLabel}</ButtonText>
                    </Button>
                )}
            </VStack>
            {error && (
                <FormControlError className="mt-1">
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>
                        {error}
                    </FormControlErrorText>
                </FormControlError>
            )}
            <FormControlHelper className="mt-1">
                <FormControlHelperText className="text-sm">
                    {helperText || defaultHelperText}
                </FormControlHelperText>
            </FormControlHelper>
        </FormControl>
    );
}
