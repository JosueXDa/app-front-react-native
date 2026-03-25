import { Button, ButtonText } from '@/components/ui/button';
import { FormControl } from '@/components/ui/form-control';
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
import { Thread } from '@/src/entities/thread';
import {
    Archive,
    ArchiveRestore,
    Edit,
    MessageSquare,
    Plus,
    Trash2,
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
import { useManageThreads } from '../model/useManageThreads';

interface ManageThreadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: Channel;
}

export function ManageThreadsModal({
  isOpen,
  onClose,
  channel,
}: ManageThreadsModalProps) {
  const {
    threads,
    isLoading,
    showCreateForm, setShowCreateForm,
    editingThread,
    formData, setFormData,
    activeThreads,
    archivedThreads,
    handleCreateThread,
    handleUpdateThread,
    handleArchiveThread,
    handleDeleteThread,
    startEditThread,
    cancelEdit,
  } = useManageThreads({ channel, isOpen });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            Gestión de Hilos
          </Text>
          <ModalCloseButton onPress={onClose}>
            <X size={20} color="#6b7280" />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          {isLoading && !threads.length ? (
            <View className="py-8 items-center justify-center">
              <ActivityIndicator size="large" color="#6366f1" />
            </View>
          ) : (
            <ScrollView className="flex-1">
              <View className="gap-4">
                {/* Create/Edit Thread Form */}
                {(showCreateForm || editingThread) && (
                  <View className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-primary-300 dark:border-primary-700">
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      {editingThread ? 'Editar Hilo' : 'Crear Nuevo Hilo'}
                    </Text>

                    <FormControl className="mb-3">
                      <Text className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Nombre *
                      </Text>
                      <Input variant="outline" size="md">
                        <InputField
                          placeholder="Ej: Bug Reports"
                          value={formData.name}
                          onChangeText={(text) =>
                            setFormData({ ...formData, name: text })
                          }
                          maxLength={100}
                        />
                      </Input>
                    </FormControl>

                    <FormControl className="mb-3">
                      <Text className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Descripción
                      </Text>
                      <Input variant="outline" size="md">
                        <InputField
                          placeholder="Describe el propósito del hilo"
                          value={formData.description}
                          onChangeText={(text) =>
                            setFormData({ ...formData, description: text })
                          }
                          multiline
                          numberOfLines={2}
                          style={{ minHeight: 60 }}
                          maxLength={300}
                        />
                      </Input>
                    </FormControl>

                    <View className="flex-row gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onPress={editingThread ? handleUpdateThread : handleCreateThread}
                        disabled={!formData.name.trim()}
                      >
                        <ButtonText>
                          {editingThread ? 'Actualizar' : 'Crear'}
                        </ButtonText>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onPress={() => {
                          setShowCreateForm(false);
                          cancelEdit();
                        }}
                      >
                        <ButtonText>Cancelar</ButtonText>
                      </Button>
                    </View>
                  </View>
                )}

                {/* Create Button */}
                {!showCreateForm && !editingThread && (
                  <Button
                    size="md"
                    onPress={() => setShowCreateForm(true)}
                    className="w-full"
                  >
                    <Plus size={20} color="#ffffff" />
                    <ButtonText className="ml-2">Crear Nuevo Hilo</ButtonText>
                  </Button>
                )}

                {/* Active Threads */}
                {activeThreads.length > 0 && (
                  <View>
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hilos Activos ({activeThreads.length})
                    </Text>
                    {activeThreads.map((thread) => (
                      <LocalThreadCard
                        key={thread.id}
                        thread={thread}
                        onEdit={() => startEditThread(thread)}
                        onArchive={() => handleArchiveThread(thread)}
                        onDelete={() => handleDeleteThread(thread)}
                      />
                    ))}
                  </View>
                )}

                {/* Archived Threads */}
                {archivedThreads.length > 0 && (
                  <View>
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hilos Archivados ({archivedThreads.length})
                    </Text>
                    {archivedThreads.map((thread) => (
                      <LocalThreadCard
                        key={thread.id}
                        thread={thread}
                        onEdit={() => startEditThread(thread)}
                        onArchive={() => handleArchiveThread(thread)}
                        onDelete={() => handleDeleteThread(thread)}
                      />
                    ))}
                  </View>
                )}

                {threads.length === 0 && (
                  <View className="py-8 items-center">
                    <MessageSquare size={48} color="#9ca3af" />
                    <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">
                      No hay hilos en este canal
                    </Text>
                  </View>
                )}
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
    </Modal>
  );
}

// Thread Card Component (local for management)
interface ThreadCardProps {
  thread: Thread;
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

function LocalThreadCard({ thread, onEdit, onArchive, onDelete }: ThreadCardProps) {
  return (
    <View
      className={`p-3 rounded-lg mb-2 border ${
        thread.isArchived
          ? 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 opacity-60'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`}
    >
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 mr-2">
          <View className="flex-row items-center">
            <MessageSquare size={16} color="#6366f1" />
            <Text className="text-sm font-semibold text-gray-900 dark:text-white ml-2">
              {thread.name}
            </Text>
          </View>
          {thread.description && (
            <Text className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {thread.description}
            </Text>
          )}
          {thread.isArchived && (
            <View className="flex-row items-center mt-1">
              <Archive size={12} color="#6b7280" />
              <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                Archivado
              </Text>
            </View>
          )}
        </View>

        <View className="flex-row gap-1">
          <Pressable
            onPress={onEdit}
            className="p-2 bg-blue-100 dark:bg-blue-900 rounded active:bg-blue-200"
          >
            <Edit size={14} color="#3b82f6" />
          </Pressable>
          <Pressable
            onPress={onArchive}
            className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded active:bg-yellow-200"
          >
            {thread.isArchived ? (
              <ArchiveRestore size={14} color="#f59e0b" />
            ) : (
              <Archive size={14} color="#f59e0b" />
            )}
          </Pressable>
          <Pressable
            onPress={onDelete}
            className="p-2 bg-red-100 dark:bg-red-900 rounded active:bg-red-200"
          >
            <Trash2 size={14} color="#ef4444" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
