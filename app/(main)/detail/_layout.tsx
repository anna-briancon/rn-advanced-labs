
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';

export default function DetailLayout() {
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
			}}
		/>
	);
}
