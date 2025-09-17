import { StyleSheet, Switch, Text, View } from "react-native";

export default function TermsSwitch({
  value, onValueChange, error,
}: { value: boolean; onValueChange: (val: boolean) => void; error?: string }) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>J’accepte les CGU</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginTop: 8, padding: 14, borderRadius: 12, borderWidth: 1,
    borderColor: "#e5e7eb", backgroundColor: "white", flexDirection: "row",
    alignItems: "center", gap: 12,
  },
  label: { fontWeight: "600", color: "#111827" },
  error: { marginTop: 6, color: "#b91c1c" },
});
