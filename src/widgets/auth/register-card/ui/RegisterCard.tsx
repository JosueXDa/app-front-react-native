import { RegisterForm } from "@/src/features/auth/register/ui/RegisterForm";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export const RegisterCard = () => {
  return (
     <View className="flex-grow justify-center px-6 py-10">
        <View className="items-center mb-10">
            <View className="bg-brand-100 dark:bg-brand-900 p-4 rounded-full mb-4">
                <Ionicons name="person-add" size={40} color="rgb(var(--color-brand-500))" />
            </View>
            <Text className="text-3xl font-bold text-gray-900 dark:text-white text-center">
                Crear Cuenta
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">
                Únete a la comunidad de mensajería
            </Text>
        </View>
        <View className="w-full max-w-md mx-auto">
          <RegisterForm/>
        </View>

      </View>
  );
};