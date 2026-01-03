import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { UserProfileModal } from './UserProfileModal';
import { UserSettingsMenu } from './UserSettingsMenu';

export function UserBar() {
    const { user } = useAuth();
    
    const [showProfileModal, setShowProfileModal] = useState(false);

    if (!user) return null;

    return (
        <>
            <View className="absolute bottom-6 left-5 w-60 bg-background-0 p-2 rounded-2xl shadow-xl border border-outline-200 flex-row items-center justify-between z-50">
                <Pressable 
                    className="flex-row items-center flex-1 mr-2 hover:bg-background-50 p-1.5 rounded-xl"
                    onPress={() => setShowProfileModal(true)}
                >
                    <View className="relative">
                        <Avatar size="sm" className="mr-2">
                            {user.profile?.avatarUrl ? (
                                <AvatarImage source={{ uri: user.profile.avatarUrl }} alt={user.profile?.displayName || user.name} />
                            ) : (
                                <AvatarFallbackText>{user.profile?.displayName || user.name}</AvatarFallbackText>
                            )}
                        </Avatar>
                        <View className="absolute bottom-0 right-2 w-2.5 h-2.5 bg-success-500 rounded-full border-2 border-background-0" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-typography-900 text-sm font-semibold" numberOfLines={1}>
                            {user.profile?.displayName || user.name}
                        </Text>
                        <Text className="text-typography-500 text-xs" numberOfLines={1}>
                            Online
                        </Text>
                    </View>
                </Pressable>

                <View className="flex-row items-center gap-1">
                    <UserSettingsMenu />
                </View>
            </View>

            <UserProfileModal 
                isOpen={showProfileModal} 
                onClose={() => setShowProfileModal(false)} 
                user={user}
            />
        </>
    );
}
