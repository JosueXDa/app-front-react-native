import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { CloseIcon, Icon } from '@/components/ui/icon';
import {
    Modal,
    ModalBackdrop,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader
} from '@/components/ui/modal';
import { VStack } from '@/components/ui/vstack';
import { useChannels } from '@/context/ChannelContex';
import { Channel, isJoined as checkIsJoined, getChannelMembers, joinChannel } from '@/lib/api/chat';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';

interface ChannelDetailModalProps {
    channel: Channel | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ChannelDetailModal({ channel, isOpen, onClose }: ChannelDetailModalProps) {
    const router = useRouter();
    const [isJoined, setIsJoined] = useState(false);
    const [memberCount, setMemberCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(false);
    const { refreshChannels } = useChannels();

    const checkJoinStatusAndMembers = useCallback(async () => {
        if (!channel) return;
        
        try {
            setCheckingStatus(true);
            const [joined, members] = await Promise.all([
                checkIsJoined(channel.id),
                getChannelMembers(channel.id)
            ]);
            setIsJoined(joined);
            setMemberCount(members.length);
        } catch (error) {
            console.error('Error checking channel status:', error);
        } finally {
            setCheckingStatus(false);
        }
    }, [channel]);

    useEffect(() => {
        if (channel && isOpen) {
            checkJoinStatusAndMembers();
        }
    }, [channel, isOpen, checkJoinStatusAndMembers]);

    const handleJoin = async () => {
        if (!channel) return;
        
        setLoading(true);
        try {
            await joinChannel(channel.id);
            setIsJoined(true);
            await refreshChannels();
        } catch (error) {
            console.error('Error joining channel:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoToChannel = () => {
        if (!channel) return;
        onClose();
        router.push(`/(app)/channels/${channel.id}`);
    };

    if (!channel) return null;

    const getActionButton = () => {
        if (isJoined) {
            return (
                <Button onPress={handleGoToChannel} className="flex-1">
                    <ButtonText>Ir al canal</ButtonText>
                </Button>
            );
        }

        if (channel.isPrivate) {
            return (
                <Button onPress={handleJoin} isDisabled={loading} className="flex-1">
                    {loading && <ButtonSpinner className="mr-2" />}
                    <ButtonText>{loading ? 'Solicitando...' : 'Solicitar unirse'}</ButtonText>
                </Button>
            );
        }

        return (
            <Button onPress={handleJoin} isDisabled={loading} className="flex-1">
                {loading && <ButtonSpinner className="mr-2" />}
                <ButtonText>{loading ? 'Uniéndose...' : 'Unirse'}</ButtonText>
            </Button>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalBackdrop />
            <ModalContent className="max-w-[500px]">
                <ModalHeader className="border-b border-gray-200 dark:border-gray-700">
                    <Text className="text-xl font-bold text-gray-900 dark:text-white">
                        Información del canal
                    </Text>
                    <ModalCloseButton>
                        <Icon
                            as={CloseIcon}
                            size="md"
                            className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700"
                        />
                    </ModalCloseButton>
                </ModalHeader>

                <ModalBody>
                    <VStack space="lg" className="py-2">
                        {/* Channel Avatar and Name */}
                        <View className="h-24 w-full">
                            <Image
                                source={{ uri: channel.bannerUrl || 'https://placehold.co/600x400'}}
                                alt="Channel Banner"
                                className="w-full h-40 rounded-lg object-cover"
                            />
                        </View>
                        <View className="items-center">
                            <Avatar size="2xl" className="mb-3 border-8 border-white dark:border-[#18191c]">
                                {channel.imageUrl ? (
                                    <AvatarImage 
                                        source={{ uri: channel.imageUrl }} 
                                        alt={channel.name} 
                                    />
                                ) : (
                                    <AvatarFallbackText>{channel.name}</AvatarFallbackText>
                                )}
                            </Avatar>
                            <Text className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
                                {channel.name}
                            </Text>
                        </View>

                        {/* Categories and Privacy */}
                        <View className="flex-row flex-wrap justify-center gap-2">
                            <View className="bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
                                <Text className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                    {channel.isPrivate ? '🔒 Privado' : '🌍 Público'}
                                </Text>
                            </View>
                            {channel.category && (
                                <View className="bg-blue-100 dark:bg-blue-900 px-3 py-1.5 rounded-full">
                                    <Text className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                                        {channel.category}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Description */}
                        {channel.description && (
                            <View>
                                <Text className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                    Descripción
                                </Text>
                                <Text className="text-sm text-gray-600 dark:text-gray-400">
                                    {channel.description}
                                </Text>
                            </View>
                        )}

                        {/* Member Count */}
                        <View className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <View className="flex-row items-center justify-between">
                                <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Miembros
                                </Text>
                                <Text className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                    {checkingStatus ? '...' : memberCount}
                                </Text>
                            </View>
                        </View>
                    </VStack>
                </ModalBody>

                <ModalFooter className="border-t border-gray-200 dark:border-gray-700">
                    <Button
                        variant="outline"
                        action="secondary"
                        onPress={onClose}
                        className="mr-2"
                    >
                        <ButtonText>Cerrar</ButtonText>
                    </Button>
                    {getActionButton()}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
