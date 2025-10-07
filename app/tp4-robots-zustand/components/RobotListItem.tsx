import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import type { Robot } from '../types/robot';

type Props = {
	robot: Robot;
	onDelete: (id: string) => void;
};

export default function RobotListItem({ robot, onDelete }: Props) {
	const router = useRouter();
	return (
		<View style={{
			padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 10,
			flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
		}}>
			<View>
				<Text style={{ fontWeight: '700' }}>{robot.name}</Text>
				<Text>{robot.type} • {robot.year}</Text>
			</View>
			<View style={{ flexDirection: 'row', gap: 8 }}>
				<Pressable onPress={() => router.push(`/tp4-robots/edit/${robot.id}`)}>
					<Text style={{ color: '#1f6feb' }}>Edit</Text>
				</Pressable>
				<Pressable onPress={() => {
					Alert.alert('Supprimer', `Supprimer ${robot.name} ?`, [
						{ text: 'Annuler', style: 'cancel' },
						{ text: 'Supprimer', style: 'destructive', onPress: () => onDelete(robot.id) }
					]);
				}}>
					<Text style={{ color: '#d11a2a' }}>Delete</Text>
				</Pressable>
			</View>
		</View>
	);
}
