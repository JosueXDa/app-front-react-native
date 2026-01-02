import { Channel } from '@/lib/api/chat';
import { Info, Settings, Trash2, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import * as DropdownMenu from 'zeego/dropdown-menu';
import { BasicInfoModal } from './BasicInfoModal';
import { MembersModal } from './MembersModal';
import { ThreadsModal } from './ThreadsModal';

interface ChannelSettingsMenuProps {
    channel: Channel;
    onChannelUpdate?: (channel: Channel) => void;
    children?: React.ReactNode;
}

type ModalType = 'basic-info' | 'members' | 'threads' | null;

export function ChannelSettingsMenu({ 
    channel, 
    onChannelUpdate,
    children 
}: ChannelSettingsMenuProps) {
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    const handleSelect = (key: string) => {
        setActiveModal(key as ModalType);
    };

    return (
        <>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    {children || (
                        <Pressable className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700">
                            <Settings size={20} color="#6b7280" />
                        </Pressable>
                    )}
                </DropdownMenu.Trigger>

                <DropdownMenu.Content
                    className=" bg-white dark:bg-gray-800 rounded-lg p-2 shadow-lg"
                >
                    <DropdownMenu.Item
                        key="basic-info"
                        onSelect={() => handleSelect('basic-info')}
                    >
                        <DropdownMenu.ItemIcon 
                            ios={{ 
                                name: 'info.circle',
                                pointSize: 16,
                            }}
                        >
                            <Info size={16} color="#6b7280" />
                        </DropdownMenu.ItemIcon>
                        <DropdownMenu.ItemTitle>
                            Información del Canal
                        </DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                        key="members"
                        onSelect={() => handleSelect('members')}
                    >
                        <DropdownMenu.ItemIcon 
                            ios={{ 
                                name: 'person.2',
                                pointSize: 16,
                            }}
                        >
                            <Users size={16} color="#6b7280" />
                        </DropdownMenu.ItemIcon>
                        <DropdownMenu.ItemTitle>
                            Gestión de Miembros
                        </DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                        key="threads"
                        onSelect={() => handleSelect('threads')}
                    >
                        <DropdownMenu.ItemIcon 
                            ios={{ 
                                name: 'bubble.left.and.bubble.right',
                                pointSize: 16,
                            }}
                        >
                            <Settings size={16} color="#6b7280" />
                        </DropdownMenu.ItemIcon>
                        <DropdownMenu.ItemTitle>
                            Gestión de Hilos
                        </DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator 
                        className="h-px bg-gray-200 dark:bg-gray-700 my-1"
                    />

                    <DropdownMenu.Item
                        key="delete"
                        destructive
                        onSelect={() => {
                            // TODO: Implementar confirmación de eliminación
                            console.log('Delete channel:', channel.id);
                        }}
                    >
                        <DropdownMenu.ItemIcon 
                            ios={{ 
                                name: 'trash',
                                pointSize: 16,
                                hierarchicalColor: 'red',
                            }}
                        >
                            <Trash2 size={16} color="#ef4444" />
                        </DropdownMenu.ItemIcon>
                        <DropdownMenu.ItemTitle 
                            className="text-red-500"
                        >
                            Eliminar Canal
                        </DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>

            {/* Modals */}
            <BasicInfoModal
                isOpen={activeModal === 'basic-info'}
                onClose={() => setActiveModal(null)}
                channel={channel}
                onChannelUpdate={onChannelUpdate}
            />

            <MembersModal
                isOpen={activeModal === 'members'}
                onClose={() => setActiveModal(null)}
                channel={channel}
            />

            <ThreadsModal
                isOpen={activeModal === 'threads'}
                onClose={() => setActiveModal(null)}
                channel={channel}
            />
        </>
    );
}
