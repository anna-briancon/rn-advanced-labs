import React, { forwardRef } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = React.ComponentProps<typeof TextInput> & {
  label: string;
  error?: string;
};

const FormTextInput = forwardRef<TextInput, Props>(
  ({ label, error, ...rest }, ref) => (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={ref}
        style={[styles.input, !!error && styles.inputError]}
        placeholderTextColor="#9ca3af"
        {...rest}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
);

export default FormTextInput;

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: { marginBottom: 6, fontWeight: "600", color: "#111827" },
  input: {
    borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, backgroundColor: "white",
  },
  inputError: { borderColor: "#ef4444" },
  error: { marginTop: 6, color: "#b91c1c" },
});
