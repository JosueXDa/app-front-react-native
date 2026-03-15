import { RegisterCard } from "@/src/widgets/auth/register-card";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterPage() {
  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <RegisterCard />
    </SafeAreaView>
  )
}