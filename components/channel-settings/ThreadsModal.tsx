import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator, Pressable } from 'react-native';
import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
} from '@/components/ui/modal';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { FormControl } from '@/components/ui/form-control';
import {
    Channel,
    Thread,
    getThreadsByChannel,
    createThread,
    updateThread,
    archiveThread,
    unarchiveThread,
    deleteThread,
} from '@/lib/api/chat';
import {
    Archive,
    ArchiveRestore,
    MessageSquare,
    Plus,
    Trash2,
    Edit,
    X,
} from 'lucide-react-native';

interface ThreadsModalProps {
    isOpen: boolean;
    onClose: () => void;
    channel: Channel;
}

interface ThreadFormData {
    name: string;
    description: string;
}

export function ThreadsModal({ isOpen, onClose, channel }: ThreadsModalProps) {
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
            ]
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
                                                onPress={
                                                    editingThread ? handleUpdateThread : handleCreateThread
                                                }
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
                                            <ThreadCard
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
                                            <ThreadCard
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

// Thread Card Component
interface ThreadCardProps {
    thread: Thread;
    onEdit: () => void;
    onArchive: () => void;
    onDelete: () => void;
}

function ThreadCard({ thread, onEdit, onArchive, onDelete }: ThreadCardProps) {
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
