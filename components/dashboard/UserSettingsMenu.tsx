import { Settings } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import * as DropdownMenu from 'zeego/dropdown-menu';
import { MyAccountModal } from './MyAccountModal';

interface UserSettingsMenuProps {
    children?: React.ReactNode;
}

type ModalType = 'my-account' | null;

export function UserSettingsMenu({ children }: UserSettingsMenuProps) {
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    const handleSelect = (key: string) => {
        setActiveModal(key as ModalType);
    };

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
                        key="my-account"
                        onSelect={() => handleSelect('my-account')}
                        className="py-2 px-3 rounded-md hover:bg-background-100"
                    >
                        <DropdownMenu.ItemTitle className="text-sm text-typography-900">
                            Mi Cuenta
                        </DropdownMenu.ItemTitle>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>

            {/* Modal */}
            <MyAccountModal
                isOpen={activeModal === 'my-account'}
                onClose={() => setActiveModal(null)}
            />
        </>
    );
}
