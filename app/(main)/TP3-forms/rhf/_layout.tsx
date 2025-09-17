import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text } from 'react-native';

export default function RHFLayout() {
  const router = useRouter();
  return (
    <Stack
      screenOptions={{
        headerTitle: '',
        headerTransparent: true,
        headerStyle: { backgroundColor: 'transparent' },
        headerShown: true,
        headerLeft: () => (
          <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 16 }}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
        ),
        headerRight: () => (
          <Pressable onPress={() => router.push('/TP3-forms/formik')} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 }}>
            <Ionicons name="swap-horizontal" size={24} color="#007AFF" />
            <Text style={{ color: '#007AFF', fontSize: 16, marginLeft: 6 }}>TP3 – Formik</Text>
          </Pressable>
        ),
      }}
    />
  );
}
