import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";

export default function TP1ProfileCardScreen() {
  const [followers, setFollowers] = useState(120);
  const [isFollowing, setIsFollowing] = useState(false);

  // Effet: +1 follower automatiquement toutes les 5s
  useEffect(() => {
    const id = setInterval(() => {
      setFollowers((n) => n + 1);
    }, 5000);

    // Nettoyage quand l'écran est démonté
    return () => clearInterval(id);
  }, []);

  const onToggleFollow = () => {
    setIsFollowing((prev) => {
      const next = !prev;
      // Si on suit -> +1 ; si on se désabonne -> -1
      setFollowers((n) => n + (next ? 1 : -1));
      return next;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card} accessible accessibilityRole="summary">
        <Image
          source={{ uri: "https://i.pravatar.cc/300?img=26" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Axelle Morgan</Text>
        <Text style={styles.role}>Mobile Engineer</Text>

        <Text style={styles.followers} accessibilityLabel={`${followers} followers`}>
          {followers} followers
        </Text>

        <Pressable
          onPress={onToggleFollow}
          style={({ pressed }) => [
            styles.button,
            isFollowing ? styles.unfollow : styles.follow,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={isFollowing ? "Unfollow" : "Follow"}
        >
          <Text style={styles.buttonText}>{isFollowing ? "Unfollow" : "Follow"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F6F7FB" },
  card: {
    width: "86%",
    alignItems: "center",
    padding: 24,
    borderRadius: 18,
    backgroundColor: "#FFF",
    // Ombre iOS
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    // Élévation Android
    elevation: 6,
  },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 14 },
  name: { fontSize: 22, fontWeight: "700" },
  role: { fontSize: 14, color: "#666", marginTop: 4, marginBottom: 12 },
  followers: { fontSize: 16, fontWeight: "600", marginBottom: 16 },
  button: { paddingVertical: 12, paddingHorizontal: 28, borderRadius: 999 },
  follow: { backgroundColor: "#2563EB" },
  unfollow: { backgroundColor: "#EF4444" },
  pressed: { opacity: 0.9 },
  buttonText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
});
