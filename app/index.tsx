
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

const NAV_KEY = 'NAVIGATION_LAST_PATH_V1';

export default function Index() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(NAV_KEY);
      if (!saved || saved === '/') {
        router.replace('./home');
      }
      setChecked(true);
    })();
  }, [router]);

  return null;
}
