import { HStack } from "@/components/ui/hstack";
import { AlertCircleIcon, Icon } from "@/components/ui/icon";
import { Toast, ToastDescription, ToastTitle, useToast } from "@/components/ui/toast";
import { useAuth } from "@/src/app/providers";
import { useCallback, useState } from "react";

type  UseRegisterReturn = {
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  loading: boolean;
}

export function useRegister(): UseRegisterReturn {
  const { signUp } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const showError = useCallback(
    (description: string) => {
      toast.show({
        placement: "top right",
        render: ({ id }) => (
          <Toast nativeID={`toast-${id}`} action="error" variant ="outline">
            <HStack space="sm">
              <Icon as={AlertCircleIcon} className="mt-0.5"/>
              <ToastTitle>Error</ToastTitle>
            </HStack>
            <ToastDescription>{description}</ToastDescription>
          </Toast>
        ),
      });
    },
    [toast]
  );

  const register = useCallback(
    async (name: string, email: string, password: string, confirmPassword: string) => {
      if (!name || !email || !password || !confirmPassword) {
        showError("Por favor completa todos los campos");
        return;
      }

      if (password !== confirmPassword) {
        showError("Las contraseñas no coinciden");
        return;
      }

      setLoading(true);
      try {
        await signUp({ name, email, password });
      } catch (error: any) {
        const description = error?.response?.data?.message || "Error al crear la cuenta";
        showError(description);
      } finally {
        setLoading(false);
      }
    },
    [showError, signUp]
  );
  return { register, loading };
}