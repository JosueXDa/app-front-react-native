import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Channel } from '@/src/entities/channel';
import {
  archiveThread,
  createThread,
  deleteThread,
  getThreadsByChannel,
  Thread,
  unarchiveThread,
  updateThread,
} from '@/src/entities/thread';

interface ThreadFormData {
  name: string;
  description: string;
}

interface UseManageThreadsProps {
  channel: Channel;
  isOpen: boolean;
}

export function useManageThreads({ channel, isOpen }: UseManageThreadsProps) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingThread, setEditingThread] = useState<Thread | null>(null);
  const [formData, setFormData] = useState<ThreadFormData>({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (isOpen) {
      loadThreads();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const loadThreads = async () => {
    setIsLoading(true);
    try {
      const channelThreads = await getThreadsByChannel(channel.id);
      setThreads(channelThreads);
    } catch (error) {
      console.error('Error loading threads:', error);
      Alert.alert('Error', 'No se pudieron cargar los hilos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateThread = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'El nombre del hilo es obligatorio');
      return;
    }

    setIsLoading(true);
    try {
      await createThread({
        channelId: channel.id,
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      });

      setFormData({ name: '', description: '' });
      setShowCreateForm(false);
      await loadThreads();
      Alert.alert('Éxito', 'Hilo creado correctamente');
    } catch (error) {
      console.error('Error creating thread:', error);
      Alert.alert('Error', 'No se pudo crear el hilo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateThread = async () => {
    if (!editingThread || !formData.name.trim()) {
      Alert.alert('Error', 'El nombre del hilo es obligatorio');
      return;
    }

    setIsLoading(true);
    try {
      await updateThread(editingThread.id, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      });

      setFormData({ name: '', description: '' });
      setEditingThread(null);
      await loadThreads();
      Alert.alert('Éxito', 'Hilo actualizado correctamente');
    } catch (error) {
      console.error('Error updating thread:', error);
      Alert.alert('Error', 'No se pudo actualizar el hilo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchiveThread = async (thread: Thread) => {
    try {
      if (thread.isArchived) {
        await unarchiveThread(thread.id);
      } else {
        await archiveThread(thread.id);
      }
      await loadThreads();
    } catch (error) {
      console.error('Error archiving thread:', error);
      Alert.alert('Error', 'No se pudo archivar/desarchivar el hilo');
    }
  };

  const handleDeleteThread = async (thread: Thread) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que quieres eliminar el hilo "${thread.name}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteThread(thread.id);
              await loadThreads();
              Alert.alert('Éxito', 'Hilo eliminado correctamente');
            } catch (error) {
              console.error('Error deleting thread:', error);
              Alert.alert('Error', 'No se pudo eliminar el hilo');
            }
          },
        },
      ],
    );
  };

  const startEditThread = (thread: Thread) => {
    setEditingThread(thread);
    setFormData({
      name: thread.name,
      description: thread.description || '',
    });
    setShowCreateForm(false);
  };

  const cancelEdit = () => {
    setEditingThread(null);
    setFormData({ name: '', description: '' });
  };

  const activeThreads = threads.filter((t) => !t.isArchived);
  const archivedThreads = threads.filter((t) => t.isArchived);

  return {
    threads,
    isLoading,
    showCreateForm, setShowCreateForm,
    editingThread, setEditingThread,
    formData, setFormData,
    activeThreads,
    archivedThreads,
    handleCreateThread,
    handleUpdateThread,
    handleArchiveThread,
    handleDeleteThread,
    startEditThread,
    cancelEdit,
  };
}
