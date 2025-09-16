

import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Validation de l'ID : doit être une string non vide et numérique
  const isValidId = typeof id === 'string' && /^\d+$/.test(id);

  if (!isValidId) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 22, color: 'red', marginBottom: 12 }}>Erreur 404</Text>
        <Text style={{ fontSize: 18 }}>ID manquant ou invalide</Text>
        <Button title="Retour à l'accueil" onPress={() => router.replace('/')} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, marginBottom: 12 }}>Détail de l'élément</Text>
      <Text style={{ fontSize: 32, fontWeight: 'bold' }}>ID : {id}</Text>
    </View>
  );
}
