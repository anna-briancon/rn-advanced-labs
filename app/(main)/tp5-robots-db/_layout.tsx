import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { HeaderBack } from '../../../components/HeaderBack';
import { openDatabase } from '../../tp5-robots-db/db/index';

const queryClient = new QueryClient();
export default function Tp5RobotsDbLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    openDatabase().finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Robots', headerShown: false }} />
        <Stack.Screen name="create" options={{ title: 'Créer un robot', headerLeft: () => <HeaderBack /> }} />
        <Stack.Screen name="edit/[id]" options={{ title: 'Modifier un robot', headerLeft: () => <HeaderBack /> }} />
      </Stack>
    </QueryClientProvider>
  );
}
