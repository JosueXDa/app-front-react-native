import { SafeAreaView } from 'react-native-safe-area-context';
import { LoginCard } from '@/src/widgets/auth/login-card';

export default function LoginPage() {
  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <LoginCard />
    </SafeAreaView>
  );
}
