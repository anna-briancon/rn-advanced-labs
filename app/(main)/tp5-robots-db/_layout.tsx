import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
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
      <Slot />
    </QueryClientProvider>
  );
}
