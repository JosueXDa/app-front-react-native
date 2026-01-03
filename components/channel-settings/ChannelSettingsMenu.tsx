import { Channel } from '@/lib/api/chat';
import { Settings } from 'lucide-react-native';
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
    isAdmin?: boolean;
}

type ModalType = 'basic-info' | 'members' | 'threads' | null;

export function ChannelSettingsMenu({ 
    channel, 
    onChannelUpdate,
    children,
    isAdmin = false
}: ChannelSettingsMenuProps) {
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    const handleSelect = (key: string) => {
        setActiveModal(key as ModalType);
    };

    // Solo mostrar el menú si el usuario es administrador
    if (!isAdmin) {
        return null;
    }

    return (
        <>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    {children || (
                        <Pressable className="w-10 h-10 items-center justify-center rounded-full bg-background-50 active:bg-background-100">
                            <Settings size={20} color="rgb(var(--color-typography-600))" />
                        </Pressable>
                    )}
                </DropdownMenu.Trigger>

                <DropdownMenu.Content
                    className="bg-background-0 rounded-lg p-2 shadow-lg border border-outline-200"
                >
                    <DropdownMenu.Item
                        key="basic-info"
                        onSelect={() => handleSelect('basic-info')}
                        className="py-2 px-3 rounded-md hover:bg-background-100"
                    >
                        <DropdownMenu.ItemTitle className="text-sm text-typography-900">
                            Información del Canal
                        </DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                        key="members"
                        onSelect={() => handleSelect('members')}
                        className="py-2 px-3 rounded-md hover:bg-background-100"
                    >
                        <DropdownMenu.ItemTitle className="text-sm text-typography-900">
                            Gestión de Miembros
                        </DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                        key="threads"
                        onSelect={() => handleSelect('threads')}
                        className="py-2 px-3 rounded-md hover:bg-background-100"
                    >
                        <DropdownMenu.ItemTitle className="text-sm text-typography-900">
                            Gestión de Hilos
                        </DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="h-px bg-outline-200 my-1" />

                    <DropdownMenu.Item
                        key="delete"
                        destructive
                        onSelect={() => {
                            // TODO: Implementar confirmación de eliminación
                            console.log('Delete channel:', channel.id);
                        }}
                        className="py-2 px-3 rounded-md hover:bg-error-50"
                    >
                        <DropdownMenu.ItemTitle className="text-sm text-error-500">
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
