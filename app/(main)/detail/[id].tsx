

import { Text, View, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, marginBottom: 12 }}>Détail de l'élément</Text>
      <Text style={{ fontSize: 32, fontWeight: 'bold' }}>ID : {id}</Text>
    </View>
  );
}
