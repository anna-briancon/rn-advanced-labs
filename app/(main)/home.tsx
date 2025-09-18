import { Image } from "expo-image";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => router.push("/detail/42")}
        >
          <View style={styles.cardContent}>
            <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
              Détail de l'élément 42
            </ThemedText>
            <IconSymbol
              name="chevron.right"
              size={15}
              color="#C7C7CC"
              style={styles.chevron}
            />
          </View>
          <ThemedText style={styles.cardSubtitle}>
            Voir les informations détaillées
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => router.push("/TP3-forms/formik")}
        >
          <View style={styles.cardContent}>
            <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
              TP3 – Formik
            </ThemedText>
            <IconSymbol
              name="chevron.right"
              size={15}
              color="#C7C7CC"
              style={styles.chevron}
            />
          </View>
          <ThemedText style={styles.cardSubtitle}>
            Formulaire avec Formik
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => router.push("/TP3-forms/rhf")}
        >
          <View style={styles.cardContent}>
            <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
              TP3 – RHF
            </ThemedText>
            <IconSymbol
              name="chevron.right"
              size={15}
              color="#C7C7CC"
              style={styles.chevron}
            />
          </View>
          <ThemedText style={styles.cardSubtitle}>
            Formulaire avec React Hook Form
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => router.push("/tp4-robots")}
        >
          <View style={styles.cardContent}>
            <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
              TP4 – Robots Zustand
            </ThemedText>
            <IconSymbol
              name="chevron.right"
              size={15}
              color="#C7C7CC"
              style={styles.chevron}
            />
          </View>
          <ThemedText style={styles.cardSubtitle}>
            CRUD de robots avec Zustand
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => router.push("/tp4-robots-rtk")}
        >
          <View style={styles.cardContent}>
            <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
              TP4 – Robots RTK
            </ThemedText>
            <IconSymbol
              name="chevron.right"
              size={15}
              color="#C7C7CC"
              style={styles.chevron}
            />
          </View>
          <ThemedText style={styles.cardSubtitle}>
            CRUD de robots avec Redux Toolkit
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  cardsContainer: {
    marginTop: 32,
    gap: 18,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    width: 340,
    paddingVertical: 18,
    paddingHorizontal: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 0,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 19,
    color: "#11181C",
  },
  cardSubtitle: {
    color: "#6e6e73",
    fontSize: 15,
    marginTop: 4,
    marginLeft: 2,
  },
  chevron: {
    marginLeft: 8,
  },
});
