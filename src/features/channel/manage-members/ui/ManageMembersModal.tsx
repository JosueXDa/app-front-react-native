import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Button, ButtonText } from '@/components/ui/button';
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
import {
  Crown,
  Shield,
  User as UserIcon,
  UserMinus,
  UserPlus,
  X,
} from 'lucide-react-native';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useManageMembers } from '../model/useManageMembers';

interface ManageMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: Channel;
}

const ROLE_LABELS: Record<string, string> = {
  owner: 'Propietario',
  admin: 'Administrador',
  moderator: 'Moderador',
  member: 'Miembro',
};

const ROLE_COLORS: Record<string, string> = {
  owner: '#f59e0b',
  admin: '#ef4444',
  moderator: '#8b5cf6',
  member: '#6b7280',
};

const ROLE_ICONS: Record<string, React.ReactNode> = {
  owner: <Crown size={14} color="#f59e0b" />,
  admin: <Shield size={14} color="#ef4444" />,
  moderator: <Shield size={14} color="#8b5cf6" />,
  member: <UserIcon size={14} color="#6b7280" />,
};

export function ManageMembersModal({
  isOpen,
  onClose,
  channel,
}: ManageMembersModalProps) {
  const {
    members,
    isLoading,
    selectedMember, setSelectedMember,
    showRoleMenu, setShowRoleMenu,
    newMemberUserId, setNewMemberUserId,
    handleChangeRole,
    handleRemoveMember,
    handleAddMember,
  } = useManageMembers({ channel, isOpen });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            Gestión de Miembros
          </Text>
          <ModalCloseButton onPress={onClose}>
            <X size={20} color="#6b7280" />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          {isLoading ? (
            <View className="py-8 items-center justify-center">
              <ActivityIndicator size="large" color="#6366f1" />
            </View>
          ) : (
            <ScrollView className="flex-1">
              <View className="gap-4">
                {/* Add Member Section */}
                <View className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Agregar Miembro
                  </Text>
                  <View className="flex-row gap-2">
                    <View className="flex-1">
                      <Input variant="outline" size="md">
                        <InputField
                          placeholder="ID del usuario"
                          value={newMemberUserId}
                          onChangeText={setNewMemberUserId}
                        />
                      </Input>
                    </View>
                    <Button
                      size="md"
                      onPress={handleAddMember}
                      disabled={!newMemberUserId.trim()}
                    >
                      <UserPlus size={20} color="#ffffff" />
                    </Button>
                  </View>
                </View>

                {/* Members List */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Miembros ({members.length})
                  </Text>

                  {members.map((member) => (
                    <View
                      key={member.id}
                      className="flex-row items-center p-3 bg-white dark:bg-gray-800 rounded-lg mb-2 border border-gray-200 dark:border-gray-700"
                    >
                      <Avatar size="md" className="mr-3">
                        <AvatarFallbackText>
                          {member.displayName || 'U'}
                        </AvatarFallbackText>
                      </Avatar>

                      <View className="flex-1">
                        <Text className="text-sm font-medium text-gray-900 dark:text-white">
                          {member.displayName}
                        </Text>
                        <View className="flex-row items-center mt-1">
                          {ROLE_ICONS[member.role]}
                          <Text
                            className="text-xs ml-1"
                            style={{ color: ROLE_COLORS[member.role] }}
                          >
                            {ROLE_LABELS[member.role] || member.role}
                          </Text>
                        </View>
                      </View>

                      {member.role !== 'owner' && (
                        <View className="flex-row gap-2">
                          <Pressable
                            onPress={() => {
                              setSelectedMember(member);
                              setShowRoleMenu(true);
                            }}
                            className="px-3 py-2 bg-primary-100 dark:bg-primary-900 rounded active:bg-primary-200"
                          >
                            <Text className="text-xs font-medium text-primary-700 dark:text-primary-300">
                              Cambiar Rol
                            </Text>
                          </Pressable>
                          <Pressable
                            onPress={() => handleRemoveMember(member)}
                            className="px-3 py-2 bg-red-100 dark:bg-red-900 rounded active:bg-red-200"
                          >
                            <UserMinus size={16} color="#ef4444" />
                          </Pressable>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" size="md" onPress={onClose} className="w-full">
            <ButtonText>Cerrar</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>

      {/* Role Change Modal */}
      {showRoleMenu && selectedMember && (
        <Modal
          isOpen={showRoleMenu}
          onClose={() => {
            setShowRoleMenu(false);
            setSelectedMember(null);
          }}
          size="md"
        >
          <ModalBackdrop />
          <ModalContent>
            <ModalHeader>
              <Text className="text-lg font-bold text-gray-900 dark:text-white">
                Cambiar Rol
              </Text>
            </ModalHeader>
            <ModalBody>
              <View className="gap-2">
                {['admin', 'moderator', 'member'].map((role) => (
                  <Pressable
                    key={role}
                    onPress={() => handleChangeRole(selectedMember, role)}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg active:bg-gray-100"
                  >
                    <View className="flex-row items-center">
                      {ROLE_ICONS[role]}
                      <Text className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                        {ROLE_LABELS[role]}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="outline"
                size="md"
                onPress={() => {
                  setShowRoleMenu(false);
                  setSelectedMember(null);
                }}
                className="w-full"
              >
                <ButtonText>Cancelar</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Modal>
  );
}
