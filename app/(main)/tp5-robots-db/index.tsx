import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import {
	useDeleteRobot,
	useRobotsQuery,
} from "../../tp5-robots-db/hooks/useRobotQueries";
import * as robotRepo from "../../tp5-robots-db/services/robotRepo";

type Robot = robotRepo.Robot;

export default function RobotsListScreen() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"name" | "year">("name");
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: robots = [],
    isLoading,
    refetch,
    isFetching,
  } = useRobotsQuery();

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
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.label}>
          {item.label} • {item.year} • {item.type}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.editBtn}
        onPress={() =>
          router.push({
            pathname: "/tp5-robots-db/edit/[id]",
            params: { id: item.id },
          })
        }
      >
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <Text style={styles.title}>Robots</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity style={styles.exportBtn} onPress={handleExport}>
            <Text style={styles.exportText}>Exporter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.importBtn} onPress={handleImport}>
            <Text style={styles.importText}>Importer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push("/tp5-robots-db/create")}
          >
            <Text style={styles.addText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.searchSort}>
        <TextInput
          style={styles.searchInput}
          placeholder="Recherche..."
          value={q}
          onChangeText={setQ}
          onSubmitEditing={() => refetch()}
        />
        <TouchableOpacity
          onPress={() => setSort(sort === "name" ? "year" : "name")}
        >
          <Text style={styles.sortBtn}>
            Trier: {sort === "name" ? "Nom" : "Année"}
          </Text>
        </TouchableOpacity>
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
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 40 }}>
              Aucun robot
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  title: { fontSize: 24, fontWeight: "bold" },
  addBtn: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  addText: { color: "#fff", fontSize: 28, fontWeight: "bold", marginTop: -2 },
  exportBtn: {
    backgroundColor: "#34C759",
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  exportText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  importBtn: {
    backgroundColor: "#5856D6",
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  importText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  searchSort: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  sortBtn: { color: "#007AFF", fontWeight: "bold" },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  name: { fontSize: 18, fontWeight: "bold" },
  label: { color: "#666" },
  editBtn: {
    marginLeft: 8,
    padding: 6,
    backgroundColor: "#eee",
    borderRadius: 6,
  },
  editText: { color: "#007AFF", fontWeight: "bold" },
  deleteBtn: {
    marginLeft: 8,
    padding: 6,
    backgroundColor: "#ffdddd",
    borderRadius: 6,
  },
  deleteText: { color: "#d00", fontWeight: "bold" },
});
