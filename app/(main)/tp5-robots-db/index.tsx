import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, TextInput, View } from "react-native";
import { ThemedText } from '../../../components/themed-text';
import { ThemedView } from '../../../components/themed-view';
import { IconSymbol } from '../../../components/ui/icon-symbol';
import { useDeleteRobot, useRobotsQuery } from "../../tp5-robots-db/hooks/useRobotQueries";
import * as robotRepo from "../../tp5-robots-db/services/robotRepo";



type Robot = robotRepo.Robot;

export default function RobotsListScreen() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"name" | "year">("name");
  const [refreshing, setRefreshing] = useState(false);
  const { data: robots = [], isLoading, refetch, isFetching } = useRobotsQuery({ q, sort });

  // EXPORTER LES ROBOTS EN JSON
  const handleExport = async () => {
    try {
      // 1. Générer le JSON
      const json = JSON.stringify(robots, null, 2);
      // 2. Définir le chemin du fichier
      const file = new FileSystem.File(
        FileSystem.Paths.document,
        "robots-export.json"
      );
      if (file.exists) {
        try {
          file.delete();
        } catch {}
      }
      await file.write(json);
      const fileUri = file.uri;
      // 4. Ouvrir la feuille de partage
      await Sharing.shareAsync(fileUri, { mimeType: "application/json" });
    } catch (e) {
      Alert.alert("Erreur export", String(e));
    }
  };
  const { mutateAsync: deleteRobot } = useDeleteRobot();
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // IMPORTER LES ROBOTS DEPUIS UN JSON
  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets || !result.assets[0]?.uri) return;
      const fileUri = result.assets[0].uri;
      const file = new FileSystem.File(fileUri);
      const content = await file.text();
      const imported = JSON.parse(content);
      if (!Array.isArray(imported)) throw new Error("Format JSON invalide");
      // Fusionner en évitant les doublons sur name
      const existingNames = new Set(robots.map((r) => r.name));
      const toAdd = imported.filter(
        (r: Robot) => r && r.name && !existingNames.has(r.name)
      );
      if (toAdd.length === 0) {
        Alert.alert("Import", "Aucun nouveau robot à importer.");
        return;
      }
      // Ajoute chaque robot (en série)
      for (const robot of toAdd) {
        // Adaptation: robotRepo.create attend un RobotInput (sans id)
        const { id, ...robotInput } = robot;
        await robotRepo.create(robotInput);
      }
      Alert.alert("Import", `${toAdd.length} robot(s) importé(s).`);
      refetch();
    } catch (e) {
      Alert.alert("Erreur import", String(e));
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Supprimer", "Confirmer la suppression ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          await deleteRobot(id);
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Robot }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>{item.name}</ThemedText>
          <ThemedText style={styles.cardSubtitle}>{item.label}</ThemedText>
          <ThemedText style={{ ...styles.cardMeta, fontStyle: 'italic' }}>Année : {item.year}</ThemedText>
          <ThemedText style={{ ...styles.cardMeta, fontStyle: 'italic' }}>Type : {item.type}</ThemedText>
        </View>
        <View style={styles.actions}>
          <Pressable onPress={() => router.push({ pathname: "/tp5-robots-db/edit/[id]", params: { id: item.id } })} style={styles.iconBtn} hitSlop={8}>
            <IconSymbol name="square.and.pencil" size={22} color="#1f6feb" />
          </Pressable>
          <Pressable onPress={() => handleDelete(item.id)} style={styles.iconBtn} hitSlop={8}>
            <IconSymbol name="trash" size={22} color="#d11a2a" />
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.actionsRow}>
        <Pressable style={styles.exportBtn} onPress={handleExport} accessibilityLabel="Exporter">
          <IconSymbol name="square.and.arrow.up" size={28} color="#1f6feb" />
        </Pressable>
        <Pressable style={styles.importBtn} onPress={handleImport} accessibilityLabel="Importer">
          <IconSymbol name="square.and.arrow.down" size={28} color="#6e6e73" />
        </Pressable>
      </View>
      <View style={styles.searchSort}>
        <TextInput
          style={styles.searchInput}
          placeholder="Recherche..."
          value={q}
          onChangeText={setQ}
          onSubmitEditing={() => refetch()}
        />
        <Pressable onPress={() => setSort(sort === "name" ? "year" : "name")}
          style={styles.sortBtn}
        >
          <ThemedText style={{ color: '#1f6feb', fontWeight: 'bold' }}>
            Trier: {sort === "name" ? "Nom" : "Année"}
          </ThemedText>
        </Pressable>
      </View>
      {isLoading || isFetching ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={robots}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={<ThemedText style={{ textAlign: 'center', marginTop: 40 }}>Aucun robot.</ThemedText>}
        />
      )}
      {/* Bouton flottant "Créer" */}
      <Pressable
        style={styles.fab}
        onPress={() => router.push('/tp5-robots-db/create')}
        accessibilityLabel="Créer un robot"
      >
        <IconSymbol name="plus" size={28} color="#fff" />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 8,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#11181C',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    paddingHorizontal: 0,
    marginBottom: 12,
    marginTop: 10,
  },
  exportBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    width: 54,
    height: 54,
  },
  importBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    width: 54,
    height: 54,
  },
  searchSort: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 2,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  sortBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
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
