import { z } from "zod";

export const rhfSchema = z
  .object({
    email: z
      .string()
      .trim()
      .nonempty("Email requis")
      .email("Email invalide"),
    password: z
      .string()
      .nonempty("Mot de passe requis")
      .min(8, "Au moins 8 caractères")
      .regex(/[A-Z]/, "1 majuscule min.")
      .regex(/[a-z]/, "1 minuscule min.")
      .regex(/[0-9]/, "1 chiffre min."),
    confirmPassword: z
      .string()
      .nonempty("Confirmation requise"),
    displayName: z
      .string()
      .trim()
      .nonempty("Nom d’affichage requis")
      .min(2, "Au moins 2 caractères"),
    termsAccepted: z
      .boolean()
      .refine(val => val === true, { message: "Vous devez accepter les CGU" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type RhfValues = z.infer<typeof rhfSchema>;
