import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { deletePhoto, getPhoto, Photo } from "../lib/camera/storage";

export default function PhotoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      if (id) {
        const data = await getPhoto(id);
        setPhoto(data || null);
      }
    };
    load();
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      "Supprimer cette photo ?",
      "Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            if (!photo) return;
            await deletePhoto(photo.id);
            router.replace("/TP6-camera"); // ✅ redirige vers la galerie
          },
        },
      ]
    );
  };

  if (!photo) {
    return (
      <View style={styles.center}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  const formattedDate = new Date(photo.createdAt).toLocaleString();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Photo</Text>
      </View>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: photo.uri }} style={styles.image} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Date</Text>
        <Text style={styles.infoValue}>{formattedDate}</Text>
        <Text style={styles.infoLabel}>Taille</Text>
        <Text style={styles.infoValue}>{photo.size ? (photo.size / 1024).toFixed(1) : "?"} Ko</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#f4f4f4', borderColor: '#e5e7eb', borderWidth: 1 }]}
          onPress={() => router.replace("/TP6-camera")}
        >
          <Ionicons name="arrow-back" size={22} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#fff', borderColor: '#DC2626', borderWidth: 2 }]}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={22} color="#DC2626" />
        </TouchableOpacity>
      </View>
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
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    letterSpacing: 0.5,
  },
  imageWrapper: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: 340,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  image: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
    borderRadius: 18,
    backgroundColor: '#f4f4f4',
  },
  infoContainer: {
    paddingHorizontal: 32,
    paddingVertical: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    color: '#888',
    fontSize: 15,
    fontWeight: '500',
    marginRight: 8,
  },
  infoValue: {
    color: '#222',
    fontSize: 15,
    fontWeight: '600',
    marginRight: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    gap: 24,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
