
import { Ionicons } from '@expo/vector-icons';
import { CameraView } from "expo-camera";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCameraPermission } from "./lib/hooks/useCameraPermission";
import { usePhotoStorage } from "./lib/hooks/usePhotoStorage";


export default function CameraScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<"front" | "back">("back");
  const { status, requestPermission } = useCameraPermission();
  const router = useRouter();
  const { addPhoto } = usePhotoStorage();

  // Pendant le chargement de la permission
  if (status === "undetermined") return null;

  // Permission non accordée
  if (status === "denied") {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          L'accès à la caméra est refusé. Vous pouvez l'activer dans les réglages de votre appareil.
        </Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#2563EB' }]} onPress={() => Linking.openSettings()}>
          <Text style={styles.buttonText}>Ouvrir les réglages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#1E3A8A' }]} onPress={requestPermission}>
          <Text style={styles.buttonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync();

    // Sauvegarde locale de la photo
    await addPhoto(photo.uri);

    // ✅ Redirection vers la galerie (TP6 index)
    router.replace("/TP6-camera");
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraWrapper}>
        <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
        {/* Switch camera icon en haut à droite */}
        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
          accessibilityLabel="Basculer la caméra"
        >
          <Ionicons name="camera-reverse-outline" size={32} color="#fff" />
        </TouchableOpacity>
        {/* Bouton rond pour prendre la photo */}
        <View style={styles.shutterContainer} pointerEvents="box-none">
          <TouchableOpacity
            style={styles.shutterButton}
            onPress={takePhoto}
            accessibilityLabel="Prendre une photo"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  switchButton: {
    position: 'absolute',
    top: 40,
    right: 30,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 24,
    padding: 8,
    zIndex: 10,
  },
  shutterContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  shutterButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    borderWidth: 6,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FBFF',
    padding: 24,
  },
  errorText: {
    marginBottom: 16,
    textAlign: 'center',
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '500',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 3,
    marginVertical: 6,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
