import { ExploreScreen } from '@/src/widgets/explore/explore-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExplorePage() {
  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <ExploreScreen />
    </SafeAreaView>
  );
}
