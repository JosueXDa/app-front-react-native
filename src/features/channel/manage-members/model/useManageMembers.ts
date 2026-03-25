import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  ChannelMember,
  getChannelMembers,
  getMemberRole,
  joinChannel,
  removeMember,
  updateMemberRole,
} from '@/src/entities/channel-member';
import { Channel } from '@/src/entities/channel';

export interface MemberWithRole extends ChannelMember {
  role: string;
  displayName?: string;
}

interface UseManageMembersProps {
  channel: Channel;
  isOpen: boolean;
}

export function useManageMembers({ channel, isOpen }: UseManageMembersProps) {
  const [members, setMembers] = useState<MemberWithRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberWithRole | null>(null);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [newMemberUserId, setNewMemberUserId] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadMembers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const loadMembers = async () => {
    setIsLoading(true);
    try {
      const channelMembers = await getChannelMembers(channel.id);

      // Get roles for all members
      const membersWithRoles = await Promise.all(
        channelMembers.map(async (member) => {
          try {
            const role = await getMemberRole(channel.id, member.userId);
            return {
              ...member,
              role: role || 'member',
              displayName: `Usuario ${member.userId.substring(0, 8)}`,
            };
          } catch {
            return {
              ...member,
              role: 'member',
              displayName: `Usuario ${member.userId.substring(0, 8)}`,
            };
          }
        }),
      );

      // Sort by role hierarchy
      const roleOrder = { owner: 0, admin: 1, moderator: 2, member: 3 };
      membersWithRoles.sort((a, b) => {
        const orderA = roleOrder[a.role as keyof typeof roleOrder] ?? 4;
        const orderB = roleOrder[b.role as keyof typeof roleOrder] ?? 4;
        return orderA - orderB;
      });

      setMembers(membersWithRoles);
    } catch (error) {
      console.error('Error loading members:', error);
      Alert.alert('Error', 'No se pudieron cargar los miembros');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeRole = async (member: MemberWithRole, newRole: string) => {
    if (member.role === 'owner') {
      Alert.alert('Error', 'No puedes cambiar el rol del propietario');
      return;
    }

    try {
      await updateMemberRole(channel.id, member.userId, newRole);
      await loadMembers();
      setShowRoleMenu(false);
      setSelectedMember(null);
    } catch (error) {
      console.error('Error updating role:', error);
      Alert.alert('Error', 'No se pudo actualizar el rol');
    }
  };

  const handleRemoveMember = async (member: MemberWithRole) => {
    if (member.role === 'owner') {
      Alert.alert('Error', 'No puedes expulsar al propietario');
      return;
    }

    Alert.alert(
      'Confirmar expulsión',
      `¿Estás seguro de que quieres expulsar a ${member.displayName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Expulsar',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeMember(channel.id, member.userId);
              await loadMembers();
            } catch (error) {
              console.error('Error removing member:', error);
              Alert.alert('Error', 'No se pudo expulsar al miembro');
            }
          },
        },
      ],
    );
  };

  const handleAddMember = async () => {
    if (!newMemberUserId.trim()) {
      Alert.alert('Error', 'Por favor ingresa un ID de usuario válido');
      return;
    }

    try {
      await joinChannel(channel.id, newMemberUserId.trim(), 'member');
      setNewMemberUserId('');
      await loadMembers();
      Alert.alert('Éxito', 'Miembro agregado correctamente');
    } catch (error) {
      console.error('Error adding member:', error);
      Alert.alert('Error', 'No se pudo agregar al miembro');
    }
  };

  return {
    members,
    isLoading,
    selectedMember, setSelectedMember,
    showRoleMenu, setShowRoleMenu,
    newMemberUserId, setNewMemberUserId,
    handleChangeRole,
    handleRemoveMember,
    handleAddMember,
  };
}
