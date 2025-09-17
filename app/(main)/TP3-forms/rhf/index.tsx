import { zodResolver } from "@hookform/resolvers/zod";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Alert, KeyboardAvoidingView, Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import FormTextInput from "../formik/components/FormTextInput";
import TermsSwitch from "../formik/components/TermsSwitch";

import { rhfSchema, type RhfValues } from "./validation/schema";

export default function TP3RHFScreen() {
  const router = useRouter();
  const refPassword = useRef<TextInput>(null);
  const refConfirm = useRef<TextInput>(null);
  const refDisplay = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isDirty, touchedFields },
    reset,
    getValues,
  } = useForm<RhfValues>({
    mode: "onChange", // validation temps réel
    resolver: zodResolver(rhfSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      displayName: "",
      termsAccepted: false,
    },
  });

  const onSubmit = async (_values: RhfValues) => {
    await new Promise((r) => setTimeout(r, 350));
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    reset(); // reset sur succès
    Alert.alert("Succès", "Compte créé avec succès ✅");
  };

  const onError = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  };

  const disableSubmit = !isValid || isSubmitting || !isDirty;

  // Afficher l'erreur seulement pour le champ en cours ou déjà rempli, mais pas si vide
  const showFieldError = (field: keyof RhfValues) => {
    const value = getValues(field);
    if (typeof value === 'string' && value.length === 0) return false;
    if (typeof value === 'boolean' && field === 'termsAccepted' && value === false) return false;
    return touchedFields[field] || (typeof value === 'string' ? value.length > 0 : !!value);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 30, marginBottom: 8 }}>
            {/* Old link removed */}
        </View>
        <Text style={styles.title}>TP3 – React Hook Form + Zod</Text>

        <View style={{ gap: 10 }}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextInput
                label="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                returnKeyType="next"
                onSubmitEditing={() => refPassword.current?.focus()}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={showFieldError("email") ? errors.email?.message : undefined}
                placeholder="nom@exemple.com"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextInput
                ref={refPassword}
                label="Mot de passe"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => refConfirm.current?.focus()}
                onChangeText={(t) => {
                  onChange(t);
                  if (showFieldError("password") && errors.password) onError();
                }}
                onBlur={onBlur}
                value={value}
                error={showFieldError("password") ? errors.password?.message : undefined}
                placeholder="••••••••"
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextInput
                ref={refConfirm}
                label="Confirmer le mot de passe"
                secureTextEntry
                textContentType="password"
                returnKeyType="next"
                onSubmitEditing={() => refDisplay.current?.focus()}
                onChangeText={(t) => {
                  onChange(t);
                  if (showFieldError("confirmPassword") && errors.confirmPassword) onError();
                }}
                onBlur={onBlur}
                value={value}
                error={showFieldError("confirmPassword") ? errors.confirmPassword?.message : undefined}
                placeholder="••••••••"
              />
            )}
          />

          <Controller
            control={control}
            name="displayName"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextInput
                ref={refDisplay}
                label="Nom d’affichage"
                returnKeyType="done"
                onSubmitEditing={() => {
                  if (disableSubmit) onError();
                  else handleSubmit(onSubmit, onError)();
                }}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={showFieldError("displayName") ? errors.displayName?.message : undefined}
                placeholder="Jean Dupont"
              />
            )}
          />

          <Controller
            control={control}
            name="termsAccepted"
            render={({ field: { onChange, value } }) => (
              <TermsSwitch
                value={value}
                onValueChange={onChange}
                error={showFieldError("termsAccepted") ? (errors.termsAccepted?.message as string | undefined) : undefined}
              />
            )}
          />

          <Pressable
            onPress={() => {
              if (disableSubmit) return onError();
              handleSubmit(onSubmit, onError)();
            }}
            style={[styles.button, disableSubmit && styles.buttonDisabled]}
            disabled={disableSubmit}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? "Envoi..." : "Créer mon compte"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 16 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 6 },
  button: {
    marginTop: 8,
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: "#9ca3af" },
  buttonText: { color: "white", fontWeight: "700", fontSize: 16 },
});
