import { createThread } from '@/src/entities/thread';
import { useState } from 'react';

interface UseCreateThreadProps {
  channelId: string;
  onClose: () => void;
  onThreadCreated?: () => void;
  onError?: (message: string) => void;
  onSuccess?: (message: string) => void;
}

export function useCreateThread({
  channelId,
  onClose,
  onThreadCreated,
  onError,
  onSuccess,
}: UseCreateThreadProps) {
  const [threadName, setThreadName] = useState('');
  const [threadDescription, setThreadDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!threadName.trim()) {
      newErrors.name = 'El nombre del hilo es requerido';
    } else if (threadName.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    } else if (threadName.trim().length > 100) {
      newErrors.name = 'El nombre debe tener menos de 100 caracteres';
    }

    if (threadDescription && threadDescription.length > 500) {
      newErrors.description = 'La descripción debe tener menos de 500 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setThreadName('');
    setThreadDescription('');
    setErrors({});
  };

  const handleCreateThread = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await createThread({
        channelId,
        name: threadName.trim(),
        description: threadDescription.trim() || undefined,
      });

      onSuccess?.(`Hilo "${threadName}" creado exitosamente!`);
      resetForm();
      onThreadCreated?.();
      onClose();
    } catch (error: any) {
      console.error('Error creating thread:', error);
      onError?.(
        error?.response?.data?.message || 'Failed to create thread. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return {
    threadName,
    setThreadName,
    threadDescription,
    setThreadDescription,
    isLoading,
    errors,
    setErrors,
    handleCreateThread,
    handleClose,
  };
}

