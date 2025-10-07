import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { listPhotos, Photo } from "./lib/camera/storage";

export default function GalleryScreen() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadPhotos = async () => {
    setLoading(true);
    const data = await listPhotos();
    setPhotos(data);
    setLoading(false);
  };

  // 🔄 Recharge à chaque fois que l’écran revient en focus
  useFocusEffect(
    useCallback(() => {
      loadPhotos();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ma Galerie</Text>
      </View>

      {loading ? (
        <Text style={styles.loading}>Chargement des photos...</Text>
      ) : photos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="images-outline" size={60} color="#A0AEC0" />
          <Text style={styles.emptyText}>Aucune photo pour le moment</Text>
        </View>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.gallery}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.photoWrapper}
              onPress={() => router.push(`/TP6-camera/detail/${item.id}`)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: item.uri }} style={styles.photo} />
            </TouchableOpacity>
          )}
        />
      )}

      {/* Bouton flottant pour nouvelle photo */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/TP6-camera/camera")}
        accessibilityLabel="Prendre une nouvelle photo"
        activeOpacity={0.7}
      >
        <Ionicons name="camera" size={32} color="#222" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 28,
    paddingBottom: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    marginBottom: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    letterSpacing: 0.5,
  },
  gallery: {
    paddingBottom: 80,
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  photoWrapper: {
    flex: 1 / 3,
    aspectRatio: 1,
    margin: 4,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f4f4f4',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  loading: {
    textAlign: 'center',
    marginTop: 50,
    color: '#64748B',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 10,
    color: '#94A3B8',
    fontSize: 16,
  },
});
