import { AlertCircleIcon, Icon } from "@/components/ui/icon";
import { Toast, ToastDescription, ToastTitle } from "@/components/ui/toast";
import { View } from "react-native";
interface ToastAlertProps {
    id: string;
    title: string;
    description: string;
}

export function ToastAlert({ id, title, description }: ToastAlertProps) {
    return (
        <Toast nativeID={`toast-${id}`} className="dark:bg-gray-800 p-4 rounded-xl shadow-lg border-l-8 border-red-800 flex-row gap-4 items-center">

            {/* Ícono Grande y Blanco */}
            <Icon as={AlertCircleIcon} className="text-white w-8 h-8" />

            <View className="flex-1">
                <ToastTitle className="text-white font-bold text-lg mb-1">
                    {title}
                </ToastTitle>
                {/* Usamos opacity para jerarquía visual sin perder legibilidad */}
                <ToastDescription className="text-red-50 text-sm">
                    {description}
                </ToastDescription>
            </View>
        </Toast>
    );
}