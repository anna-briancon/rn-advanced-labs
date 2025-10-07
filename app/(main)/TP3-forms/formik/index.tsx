import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useRef } from "react";
import {
  Alert, KeyboardAvoidingView, Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import FormTextInput from "./components/FormTextInput";
import TermsSwitch from "./components/TermsSwitch";
import { formikSchema, type FormikValues } from "./validation/schema";


const initialValues: FormikValues = {
  email: "", password: "", confirmPassword: "",
  displayName: "", termsAccepted: false,
};

export default function TP3FormikScreen() {
  const router = useRouter();
  const refPassword = useRef<TextInput>(null);
  const refConfirm = useRef<TextInput>(null);
  const refDisplay = useRef<TextInput>(null);

  const onSubmit = async (values: FormikValues, { resetForm }: any) => {
    await new Promise((r) => setTimeout(r, 350)); // mock API
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    resetForm();
    Alert.alert("Succès", "Compte créé avec succès ✅");
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
        <Text style={styles.title}>TP3 – Formik + Yup</Text>

        <Formik
          initialValues={initialValues}
          validationSchema={formikSchema}
          onSubmit={onSubmit}
          validateOnBlur={true}
          validateOnChange={true}
        >
          {({
            handleChange, handleBlur, handleSubmit, values, errors, touched, dirty,
            isValid, isSubmitting, setFieldValue,
          }) => {
            const disableSubmit = !isValid || isSubmitting || !dirty;
            const onErrorHaptic = () =>
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            // Afficher l'erreur seulement pour le champ en cours ou déjà rempli
            const showFieldError = (field: keyof typeof values) => {
              const value = values[field];
              if (typeof value === 'string' && value.length === 0) return false;
              if (typeof value === 'boolean' && field === 'termsAccepted' && value === false) return false;
              return touched[field] || (typeof value === 'string' ? value.length > 0 : !!value);
            };
            return (
              <View style={{ gap: 10 }}>
                <FormTextInput
                  label="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                  returnKeyType="next"
                  onSubmitEditing={() => refPassword.current?.focus()}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  error={showFieldError("email") ? errors.email : undefined}
                  placeholder="nom@exemple.com"
                />
                <FormTextInput
                  ref={refPassword}
                  label="Mot de passe"
                  secureTextEntry
                  textContentType="newPassword"
                  returnKeyType="next"
                  onSubmitEditing={() => refConfirm.current?.focus()}
                  onChangeText={(t) => {
                    handleChange("password")(t);
                    if (showFieldError("password") && errors.password) onErrorHaptic();
                  }}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  error={showFieldError("password") ? errors.password : undefined}
                  placeholder="••••••••"
                />
                <FormTextInput
                  ref={refConfirm}
                  label="Confirmer le mot de passe"
                  secureTextEntry
                  textContentType="password"
                  returnKeyType="next"
                  onSubmitEditing={() => refDisplay.current?.focus()}
                  onChangeText={(t) => {
                    handleChange("confirmPassword")(t);
                    if (showFieldError("confirmPassword") && errors.confirmPassword) onErrorHaptic();
                  }}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                  error={showFieldError("confirmPassword") ? errors.confirmPassword : undefined}
                  placeholder="••••••••"
                />
                <FormTextInput
                  ref={refDisplay}
                  label="Nom d’affichage"
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    if (disableSubmit) onErrorHaptic();
                    else handleSubmit();
                  }}
                  onChangeText={handleChange("displayName")}
                  onBlur={handleBlur("displayName")}
                  value={values.displayName}
                  error={showFieldError("displayName") ? errors.displayName : undefined}
                  placeholder="Jean Dupont"
                />
                <TermsSwitch
                  value={values.termsAccepted}
                  onValueChange={(v) => setFieldValue("termsAccepted", v, true)}
                  error={showFieldError("termsAccepted") ? (errors.termsAccepted as string) : undefined}
                />
                <Pressable
                  onPress={() => {
                    if (disableSubmit) return onErrorHaptic();
                    handleSubmit();
                  }}
                  style={[styles.button, disableSubmit && styles.buttonDisabled]}
                  disabled={disableSubmit}
                >
                  <Text style={styles.buttonText}>
                    {isSubmitting ? "Envoi..." : "Créer mon compte"}
                  </Text>
                </Pressable>
              </View>
            );
          }}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 16 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 6 },
  button: {
    marginTop: 8, backgroundColor: "#111827",
    paddingVertical: 14, borderRadius: 12, alignItems: "center",
  },
  buttonDisabled: { backgroundColor: "#9ca3af" },
  buttonText: { color: "white", fontWeight: "700", fontSize: 16 },
});