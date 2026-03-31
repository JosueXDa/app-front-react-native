import { useCallback, useState } from 'react';
import { useAuth } from '@/src/app/providers/auth-provider';
import { HStack } from '@/components/ui/hstack';
import { AlertCircleIcon, Icon } from '@/components/ui/icon';
import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';

type UseLoginReturn = {
  login: (email: string, password: string) => Promise<void>;
  loading: boolean;
};

export function useLogin(): UseLoginReturn {
  const { signIn } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const showError = useCallback(
    (description: string) => {
      toast.show({
        placement: 'top right',
        render: ({ id }) => (
          <Toast nativeID={`toast-${id}`} action="error" variant="outline">
            <HStack space="sm">
              <Icon as={AlertCircleIcon} className="mt-0.5" />
              <ToastTitle>Error</ToastTitle>
            </HStack>
            <ToastDescription>{description}</ToastDescription>
          </Toast>
        ),
      });
    },
    [toast]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      if (!email || !password) {
        showError('Por favor completa todos los campos');
        return;
      }

      setLoading(true);
      try {
        await signIn({ email, password });
      } catch (error: any) {
        const description = error?.response?.data?.message || 'Error al iniciar sesión';
        showError(description);
      } finally {
        setLoading(false);
      }
    },
    [showError, signIn]
  );

  return { login, loading };
}
