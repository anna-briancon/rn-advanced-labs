import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

export function HeaderBack() {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 16 }}>
      <Ionicons name="arrow-back" size={24} color="black" />
    </Pressable>
  );
}
