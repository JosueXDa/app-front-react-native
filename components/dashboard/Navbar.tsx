import { ChevronDownIcon, MessageCircleIcon, SettingsIcon } from '@/components/ui/icon';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Compass, EllipsisVertical, MessageCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

export function Navbar({ isDesktop }: { isDesktop: boolean }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user, signOut } = useAuth();
    const router = useRouter();


    const handleLogout = async () => {
        setIsDropdownOpen(false);
        await signOut();
    };

    return (
        <View className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50 overflow-visible">
            <View className="flex-row items-center justify-between px-4 py-3 md:px-6 md:py-4">
                {/* Logo */}
                <View className="flex-row items-center">
                    <MessageCircleIcon
                        className="text-blue-600 dark:text-blue-400 stroke-blue-600 dark:stroke-blue-400 w-6 h-6"
                    />
                    <Text className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                        ChatApp
                    </Text>
                </View>

                {/* Navigation */}
                {isDesktop && (
                    <View className={"flex-1 flex-row items-center justify-center"}>
                        <Pressable
                            onPress={() => router.push('/')}
                            className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            {({ pressed }) => (
                                <Text className={`text-base font-medium ${pressed
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-gray-700 dark:text-gray-300'
                                    }`}>
                                    <MessageCircle />
                                </Text>
                            )}
                        </Pressable>
                        <Pressable
                            onPress={() => router.push('/explore')}
                            className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            {({ pressed }) => (
                                <Text className={`text-base font-medium ${pressed
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-gray-700 dark:text-gray-300'
                                    }`}>
                                    <Compass />
                                </Text>
                            )}
                        </Pressable>
                    </View>
                )}
                {/* User Menu */}
                <View className="relative z-50">
                    <Pressable
                        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex-row items-center space-x-2"
                    >
                        {({ pressed }) => (
                            <>
                                {/* User Avatar */}
                                {isDesktop && (
                                    <View className={`w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center ${pressed ? 'opacity-80' : ''
                                        }`}>
                                        {user?.avatar ? (
                                            <Image
                                                source={{ uri: user.avatar }}
                                                className="w-10 h-10 rounded-full"
                                            />
                                        ) : (
                                            <Ionicons
                                                name="person-circle"
                                                size={40}
                                                color="#9ca3af"
                                            />
                                        )}
                                    </View>
                                )}
                                {/* Dropdown Icon */}
                                {isDesktop ? (
                                    <ChevronDownIcon
                                        className={`text-gray-600 dark:text-gray-400 stroke-gray-600 dark:stroke-gray-400 transition-transform w-4 h-4 ${isDropdownOpen ? 'rotate-180' : ''
                                            }`}
                                    />
                                ) : (
                                    <EllipsisVertical
                                        className={'text-gray-600 dark:text-gray-400 stroke-gray-600 dark:stroke-gray-400 transition-transform w-4 h-4'}
                                    />
                                )}
                            </>
                        )}
                    </Pressable>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <>
                            {/* Backdrop for mobile 
                            */}
                            <Pressable
                                onPress={() => setIsDropdownOpen(false)}
                                className="fixed inset-0 z-10 md:hidden"
                            />
                            {/* Dropdown Content */}
                            <View className="absolute right-0 top-12 z-20 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                {/* Settings Option */}
                                <Pressable
                                    onPress={() => {
                                        setIsDropdownOpen(false);
                                        router.push('/perfil');
                                    }}
                                    className="flex-row items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    {({ pressed }) => (
                                        <>
                                            <SettingsIcon
                                                className={`mr-3 w-[18px] h-[18px] ${pressed
                                                    ? 'text-blue-600 dark:text-blue-400 stroke-blue-600 dark:stroke-blue-400'
                                                    : 'text-gray-600 dark:text-gray-400 stroke-gray-600 dark:stroke-gray-400'
                                                    }`}
                                            />
                                            <Text className={`text-base ${pressed
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : 'text-gray-700 dark:text-gray-300'
                                                }`}>
                                                Settings
                                            </Text>
                                        </>
                                    )}
                                </Pressable>

                                {/* Divider */}
                                <View className="h-px bg-gray-200 dark:bg-gray-700" />

                                {/* Logout Option */}
                                <Pressable
                                    onPress={handleLogout}
                                    className="flex-row items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    {({ pressed }) => (
                                        <>
                                            <Ionicons
                                                name="log-out-outline"
                                                size={18}
                                                color={pressed ? '#dc2626' : '#6b7280'}
                                                style={{ marginRight: 12 }}
                                            />
                                            <Text className={`text-base ${pressed
                                                ? 'text-red-600 dark:text-red-400'
                                                : 'text-gray-700 dark:text-gray-300'
                                                }`}>
                                                Logout
                                            </Text>
                                        </>
                                    )}
                                </Pressable>
                            </View>
                        </>
                    )}
                </View>
            </View>
        </View>
    );
}
