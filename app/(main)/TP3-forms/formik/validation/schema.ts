import * as Yup from "yup";

export const formikSchema = Yup.object({
  email: Yup.string().trim().email("Email invalide").required("Email requis"),
  password: Yup.string()
    .min(8, "Au moins 8 caractères")
    .matches(/[A-Z]/, "1 majuscule min.")
    .matches(/[a-z]/, "1 minuscule min.")
    .matches(/[0-9]/, "1 chiffre min.")
    .required("Mot de passe requis"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Les mots de passe ne correspondent pas")
    .required("Confirmation requise"),
  displayName: Yup.string().trim().min(2, "Au moins 2 caractères").required("Nom d’affichage requis"),
  termsAccepted: Yup.boolean().oneOf([true], "Vous devez accepter les CGU").required(),
});

export type FormikValues = Yup.InferType<typeof formikSchema>;
