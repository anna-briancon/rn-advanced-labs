
import { Stack } from 'expo-router';

export default function CameraLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					title: 'Galerie',
					headerShown: false 
				}}
			/>
			<Stack.Screen
				name="camera"
				options={{
					title: 'Caméra',
					presentation: 'modal',
					headerShown: false 
				}}
			/>
			<Stack.Screen
				name="detail/[id]"
				options={{
					title: 'Détail',
					headerShown: false 
				}}
			/>
		</Stack>
	);
}
		<Stack.Screen name="index" options={{ title: 'Robots', headerShown: false }} />
