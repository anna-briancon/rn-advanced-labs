
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as robotRepo from '../../tp5-robots-db/services/robotRepo';

type Robot = robotRepo.Robot;

export default function RobotsListScreen() {
	const router = useRouter();
	const [robots, setRobots] = useState<Robot[]>([]);
	const [loading, setLoading] = useState(true);
	const [q, setQ] = useState('');
	const [sort, setSort] = useState<'name' | 'year'>('name');
	const [refreshing, setRefreshing] = useState(false);

	const fetchRobots = useCallback(async () => {
		setLoading(true);
		try {
			const data = await robotRepo.list({ q, sort, archived: false });
			setRobots(data);
		} catch (e) {
			// Ne rien faire si la table est vide ou absente, ignorer l'erreur d'affichage
			setRobots([]);
		} finally {
			setLoading(false);
		}
	}, [q, sort]);

	useEffect(() => {
		fetchRobots();
	}, [fetchRobots]);

	const onRefresh = async () => {
		setRefreshing(true);
		await fetchRobots();
		setRefreshing(false);
	};

	const handleDelete = async (id: string) => {
		Alert.alert('Supprimer', 'Confirmer la suppression ?', [
			{ text: 'Annuler', style: 'cancel' },
			{
				text: 'Supprimer', style: 'destructive', onPress: async () => {
					await robotRepo.remove(id);
					fetchRobots();
				}
			}
		]);
	};

	const renderItem = ({ item }: { item: Robot }) => (
		<View style={styles.item}>
			<View style={{ flex: 1 }}>
				<Text style={styles.name}>{item.name}</Text>
				<Text style={styles.label}>{item.label} • {item.year} • {item.type}</Text>
			</View>
			<TouchableOpacity style={styles.editBtn} onPress={() => router.push({ pathname: '/tp5-robots-db/edit/[id]', params: { id: item.id } })}>
				<Text style={styles.editText}>Edit</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
				<Text style={styles.deleteText}>Delete</Text>
			</TouchableOpacity>
		</View>
	);

	return (
		<View style={{ flex: 1, backgroundColor: '#fff' }}>
			<View style={styles.header}>
				<Text style={styles.title}>Robots</Text>
			<TouchableOpacity style={styles.addBtn} onPress={() => router.push('/tp5-robots-db/create')}>
					<Text style={styles.addText}>+</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.searchSort}>
				<TextInput
					style={styles.searchInput}
					placeholder="Recherche..."
					value={q}
					onChangeText={setQ}
					onSubmitEditing={fetchRobots}
				/>
				<TouchableOpacity onPress={() => setSort(sort === 'name' ? 'year' : 'name')}>
					<Text style={styles.sortBtn}>Trier: {sort === 'name' ? 'Nom' : 'Année'}</Text>
				</TouchableOpacity>
			</View>
			{loading ? (
				<ActivityIndicator style={{ marginTop: 40 }} />
			) : (
				<FlatList
					data={robots}
					keyExtractor={item => item.id}
					renderItem={renderItem}
					refreshing={refreshing}
					onRefresh={onRefresh}
					ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40 }}>Aucun robot</Text>}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
	title: { fontSize: 24, fontWeight: 'bold' },
	addBtn: { backgroundColor: '#007AFF', borderRadius: 20, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
	addText: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginTop: -2 },
	searchSort: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 12 },
	searchInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginRight: 8 },
	sortBtn: { color: '#007AFF', fontWeight: 'bold' },
	item: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
	name: { fontSize: 18, fontWeight: 'bold' },
	label: { color: '#666' },
	editBtn: { marginLeft: 8, padding: 6, backgroundColor: '#eee', borderRadius: 6 },
	editText: { color: '#007AFF', fontWeight: 'bold' },
	deleteBtn: { marginLeft: 8, padding: 6, backgroundColor: '#ffdddd', borderRadius: 6 },
	deleteText: { color: '#d00', fontWeight: 'bold' },
});
