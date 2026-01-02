import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { Settings } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { UserProfileModal } from './UserProfileModal';
import { UserSettingsModal } from './UserSettingsModal';

export function UserBar() {
    const { user } = useAuth();
    
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    if (!user) return null;

    return (
        <>
            <View className="absolute bottom-6 left-5 w-60 bg-white dark:bg-[#232428] p-2 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 flex-row items-center justify-between z-50">
                <Pressable 
                    className="flex-row items-center flex-1 mr-2 hover:bg-gray-100 dark:hover:bg-[#3f4147] p-1.5 rounded-xl"
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
                        <View className="absolute bottom-0 right-2 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-[#232428]" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-gray-900 dark:text-white text-sm font-semibold" numberOfLines={1}>
                            {user.profile?.displayName || user.name}
                        </Text>
                        <Text className="text-gray-500 dark:text-gray-400 text-xs" numberOfLines={1}>
                            Online
                        </Text>
                    </View>
                </Pressable>

                <View className="flex-row items-center gap-1">
                    <Pressable
                        onPress={() => setShowSettingsModal(true)}
                        className="p-2 rounded-full hover:bg-background-50"
                    >
                        <Settings size={18} className="text-typography-600" />
                    </Pressable>
                </View>
            </View>

            <UserSettingsModal 
                isOpen={showSettingsModal} 
                onClose={() => setShowSettingsModal(false)} 
            />
            <UserProfileModal 
                isOpen={showProfileModal} 
                onClose={() => setShowProfileModal(false)} 
                user={user}
            />
        </>
    );
}
