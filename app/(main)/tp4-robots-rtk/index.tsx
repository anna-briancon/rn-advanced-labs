import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, Pressable, View } from 'react-native';
import { ThemedText } from '../../../components/themed-text';
import { ThemedView } from '../../../components/themed-view';
import { IconSymbol } from '../../../components/ui/icon-symbol';
import { useAppDispatch, useAppSelector } from '../../tp4-robots-rtk/hooks';
import { deleteRobot } from '../../tp4-robots-rtk/robots/robotsSlice';
import { selectRobotsSortedByName } from '../../tp4-robots-rtk/robots/selectors';

export default function RobotsListScreen() {
		const router = useRouter();
		const dispatch = useAppDispatch();
		const robots = useAppSelector(selectRobotsSortedByName);

		const handleDelete = (id: string) => {
			dispatch(deleteRobot(id));
		};

		return (
			<ThemedView style={styles.container}>
				<FlatList
					data={robots}
					keyExtractor={item => item.id}
					contentContainerStyle={{ paddingBottom: 100 }}
					renderItem={({ item }) => (
						<View style={styles.card}>
							<View style={styles.cardContent}>
								<View style={{ flex: 1 }}>
									<ThemedText type="defaultSemiBold" style={styles.cardTitle}>{item.name}</ThemedText>
									<ThemedText style={styles.cardSubtitle}>{item.label}</ThemedText>
									<ThemedText style={{ ...styles.cardMeta, fontStyle: 'italic' }}>Année : {item.year}</ThemedText>
									<ThemedText style={{ ...styles.cardMeta, fontStyle: 'italic' }}>Type : {item.type}</ThemedText>
								</View>
								<View style={styles.actions}>
									<Pressable onPress={() => router.push(`/tp4-robots-rtk/edit/${item.id}`)} style={styles.iconBtn} hitSlop={8}>
										<IconSymbol name="square.and.pencil" size={22} color="#1f6feb" />
									</Pressable>
									<Pressable
										onPress={() => {
											Alert.alert(
												'Supprimer',
												`Supprimer ${item.name} ?`,
												[
													{ text: 'Annuler', style: 'cancel' },
													{ text: 'Supprimer', style: 'destructive', onPress: () => handleDelete(item.id) }
												]
											);
										}}
										style={styles.iconBtn}
										hitSlop={8}
									>
										<IconSymbol name="trash" size={22} color="#d11a2a" />
									</Pressable>
								</View>
							</View>
						</View>
					)}
					ListEmptyComponent={<ThemedText style={{ textAlign: 'center', marginTop: 40 }}>Aucun robot.</ThemedText>}
				/>
				{/* Bouton flottant "Créer" */}
				<Pressable
					style={styles.fab}
					onPress={() => router.push('/tp4-robots-rtk/create')}
					accessibilityLabel="Ajouter un robot"
				>
					<IconSymbol name="plus" size={28} color="#fff" />
				</Pressable>
			</ThemedView>
		);

}

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F2F2F7',
		paddingHorizontal: 0,
		paddingTop: 0,
	},
	card: {
		backgroundColor: '#fff',
		borderRadius: 18,
		marginHorizontal: 18,
		marginTop: 18,
		paddingVertical: 18,
		paddingHorizontal: 22,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.10,
		shadowRadius: 12,
		elevation: 3,
	},
	cardContent: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	cardTitle: {
		fontSize: 19,
		color: '#11181C',
		marginBottom: 2,
	},
	cardSubtitle: {
		color: '#6e6e73',
		fontSize: 15,
		marginBottom: 2,
	},
	cardMeta: {
		color: '#C7C7CC',
		fontSize: 13,
		marginTop: 2,
	},
	actions: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		marginLeft: 12,
	},
	iconBtn: {
		padding: 6,
		borderRadius: 20,
	},
	fab: {
		position: 'absolute',
		right: 24,
		bottom: 32,
		backgroundColor: '#1f6feb',
		borderRadius: 32,
		width: 56,
		height: 56,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.18,
		shadowRadius: 12,
		elevation: 6,
	},
});
