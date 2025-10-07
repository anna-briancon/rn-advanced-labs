
import { CameraView } from "expo-camera";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Button, Linking, StyleSheet, Text, View } from "react-native";
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
        <Text style={{ marginBottom: 16, textAlign: "center" }}>
          L'accès à la caméra est refusé. Vous pouvez l'activer dans les réglages de votre appareil.
        </Text>
        <Button title="Ouvrir les réglages" onPress={() => Linking.openSettings()} />
        <Button title="Réessayer" onPress={requestPermission} />
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
    <View style={{ flex: 1 }}>
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} />

      <View style={styles.buttonsContainer}>
        <Button
          title="Basculer"
          onPress={() => setFacing(facing === "back" ? "front" : "back")}
        />
        <Button title="Prendre photo" onPress={takePhoto} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
