# 📱 RN Advanced Labs

Application **Expo React Native** servant de support pour tous les TP du cours.

## 📑 Sommaire
- [🚀 Prérequis](#-prérequis)
- [▶️ Lancer l’application](#️-lancer-lapplication)
- [📂 Structure attendue](#-structure-attendue)
- [1️⃣ TP1 – Profile Card](#1️⃣-tp1--profile-card)
- [2️⃣ TP2 - Navigation](#2️⃣-tp2---navigation-persistance--deep-linking-avec-expo-router)
- [3️⃣ TP3 – Formulaires avancés (Formik vs React Hook Form)](#3️⃣-tp3--formulaires-avancés-formik-vs-react-hook-form)
- [4️⃣ TP4A – Robots (CRUD + Zustand)](#4️⃣-tp4a--robots-crud--zustand)
- [4️⃣ TP4B – Robots (CRUD + Redux Toolkit)](#4️⃣-tp4b--robots-crud--redux-toolkit)



## 🚀 Prérequis

- **Node.js** ≥ 20.19.4  
- **Git**  
- **VS Code** avec extensions (*React Native Tools*, *Prettier*)  
- **Expo Go** installé sur smartphone  

## ▶️ Lancer l’application

```bash
# Installation des dépendances
npm install

# Démarrage du projet Expo
npx expo start
```


## 1️⃣ TP1 – Profile Card

- 📂 **Dossier** : [app/tp1-profile-card](./app/tp1-profile-card/)
- 🧾 **Description** :
  - Carte de profil avec **photo**, **nom**, **fonction**
  - Bouton **Follow/Unfollow** qui met à jour le **compteur de followers**
  - **useEffect** : +1 follower automatiquement toutes les **5s**, avec **cleanup** du timer

**Arborescence** `app/` : 
<p align="center">
  <img src="./docs/tp1-arborescence.png" alt="Arborescence app TP1" width="220" />
</p>

---

## 2️⃣ TP2 - Navigation, Persistance & Deep Linking avec Expo Router

**Packages installés**

| Package                                 | Rôle principal                                                                 |
|------------------------------------------|-------------------------------------------------------------------------------|
| expo, react-native, react                | Base du projet Expo React Native                                              |
| expo-router                             | Routing avancé, navigation par fichiers et groupes                            |
| @react-navigation/native, bottom-tabs... | Navigation (stack, tabs, etc.)                                                |
| @react-native-async-storage/async-storage| Persistance locale (sauvegarde de la route)                                   |

---

**Schéma d’arborescence `app/` (groupes & écrans)**
<p align="center">
  <img src="./docs/tp2-arborescence.png" alt="Arborescence app TP2" width="220" />
</p>

---

**Table des routes principales**

| Nom                | URL / pattern         | Paramètres      | Description                                 |
|--------------------|----------------------|---------------|---------------------------------------------|
| Accueil            | `/`                  | -             | Page d'accueil principale                   |
| TP1 Profile Card   | `/tp1-profile-card`  | -             | TP1 en page unique                          |
| Détail             | `/detail/[id]`       | id (number)    | Détail d'un élément, 404 si id invalide     |

---

**Scénarios de persistance**

Ce qui est effectivement persistant :

- **La dernière page visitée** est sauvegardée automatiquement à chaque navigation dans l'application (grâce à `AsyncStorage`).
- Lorsque l'application est fermée puis relancée, l'utilisateur est automatiquement redirigé vers la dernière page visitée, même après un redémarrage complet de l'app.
- Cette persistance concerne uniquement le chemin de navigation (route), pas l'état interne des écrans (ex : contenu d'un formulaire non sauvegardé).

Choix UX réalisés :

- **Expérience fluide** : la restauration de la navigation est totalement transparente pour l'utilisateur, il retrouve l'écran où il s'était arrêté sans action manuelle.
- **Pas d'écran de chargement spécifique** : l'écran d'accueil (`app/index.tsx`) ne force plus de redirection, ce qui évite les conflits avec la restauration automatique.
- **Fallback** : si aucune page n'a été sauvegardée (premier lancement), l'utilisateur arrive sur la page d'accueil par défaut.

_Implémentation : voir le hook `useRoutePersistence` dans `lib/nav-persistence.ts` et son intégration dans `app/_layout.tsx`._

**Deep linking**

- **Froid** (appli tuée, relancée) : l'utilisateur revient sur la dernière page visitée (route restaurée via AsyncStorage).
- **Tiède** (appli en arrière-plan, puis reprise) : l'utilisateur reste sur la page courante (comportement natif).
- **Chaud** (navigation interne) : navigation immédiate, la route est sauvegardée à chaque changement.

---

## 3️⃣ TP3 – Formulaires avancés (Formik vs React Hook Form)

**Formik VS RHF**
|                | Formik (+Yup)      | RHF (+Zod)         |
|----------------|--------------------|--------------------|
| DX             | Simple, classique  | Moderne, typé      |
| Perf/re-rendus | Plus de re-rendus  | Moins de re-rendus |
| Typage         | Moins strict       | Très strict        |
| Verbosité      | Plus de code       | Plus concis        |

Les deux : validation temps réel, erreurs contextuelles, bouton désactivé si invalide, focus auto, haptique, reset après succès, switch dans le header.

_Voir `app/(main)/TP3-forms/formik/` et `app/(main)/TP3-forms/rhf/`._


**Schéma d’arborescence `app/`**
<p align="center">
  <img src="./docs/tp3-arborescence.png" alt="Arborescence app TP3" width="220" />
</p>


---

**Routes principales**

| Nom                | URL / pattern                        | Description                                 |
|--------------------|--------------------------------------|---------------------------------------------|
| Accueil            | `/`                                  | Page d'accueil principale                   |
| TP1 Profile Card   | `/tp1-profile-card`                  | TP1 en page unique                          |
| TP3 Formik         | `/TP3-forms/formik`                  | Formulaire avancé (Formik + Yup)            |
| TP3 RHF            | `/TP3-forms/rhf`                     | Formulaire avancé (React Hook Form + Zod)   |
| Détail             | `/detail/[id]`                       | Détail d'un élément                         |

---

**Choix techniques**

- **Expo + React Native** : base du projet, rapidité de prototypage.
- **expo-router** : navigation par fichiers, gestion avancée des routes et groupes.
- **Formik + Yup** : gestion de formulaire classique, validation déclarative.
- **React Hook Form + Zod** : gestion de formulaire moderne, typage strict, validation performante.
- **AsyncStorage** : persistance de la dernière route visitée.
- **Haptique** : feedback utilisateur natif lors des actions importantes.
- **Factorisation** : composants de champ réutilisables (`FormTextInput`, `TermsSwitch`), schémas de validation isolés.
- **Aucune logique métier dans les layouts** : seuls les écrans principaux gèrent la logique, les layouts ne font que du routage/navigation.

---
**Captures**

| Formik — vide | Formik — valide | Formik — après envoi |
|---|---|---|
| <img src="./docs/captures/FORMIK.PNG" width="220" /> | <img src="./docs/captures/FORMIK_GOOD.PNG" width="220" /> | <img src="./docs/captures/FORMIK_SEND.PNG" width="220" /> |

| RHF — formulaire | Accueil |
|---|---|
| <img src="./docs/captures/RHF.PNG" width="220" /> | <img src="./docs/captures/HOME.PNG" width="220" /> |

---

## 4️⃣ TP4A – Robots (CRUD + Zustand)

**Choix de stack formulaire**

- Stack : React Hook Form (RHF) + Zod
- Pourquoi ? RHF = performant et simple (peu de re-rendus). Zod = schémas typés, validation claire et réutilisable.

---

**Schéma d’arborescence**

```
app/(main)/tp4-robots/
  index.tsx            # Liste des robots
  create.tsx           # Création
  edit/[id].tsx        # Édition
app/tp4-robots-zustand/
  store/
    robotsStore.ts       # Zustand : state + actions (CRUD) + persistance
  validation/
    robotSchema.ts       # Zod : schéma de validation
  types/
    robot.ts             # Types TypeScript pour Robot
  components/
    RobotForm.tsx        # Formulaire réutilisable (create/edit)
    RobotListItem.tsx    # Item de liste (nom, type, année, actions)
```

---

**Routes principales**
- `/tp4-robots` : liste
- `/tp4-robots/create` : création
- `/tp4-robots/edit/[id]` : édition

---

**Règles de validation**
- `name` : string, min 2, unique (pas de doublon dans la collection)
- `label` : string, min 3
- `year` : entier, 1950 ≤ year ≤ année courante
- `type` : enum obligatoire (`industrial`, `service`, `medical`, `educational`, `other`)

---

**Persistance Zustand**
- Utilisation du middleware `persist` de Zustand avec `AsyncStorage`.
- Toute modification (create, update, delete) est immédiatement persistée.
- Les robots restent présents après redémarrage de l’application.

---

**Plan de tests manuels**

- **Create** :
    - Succès → nouvel item dans la liste
    - Échec (name dupliqué, year invalide) → erreurs affichées, pas de création
- **Edit** :
    - Charger un robot existant, modifier, sauvegarder → retour à la liste mise à jour
- **Delete** :
    - Suppression confirmée → l’item disparaît, feedback visuel/haptique
- **Persistance** :
    - Créer 2 robots, redémarrer l’app → robots toujours présents
- **UX** :
    - Clavier ne masque pas le bouton submit
    - Submit désactivé tant que formulaire invalide

---

**Captures**

| Liste robots | Créer robot | Modifier robot |
|---|---|---|
| <img src="./docs/captures/TP4/LISTE.PNG" width="220" /> | <img src="./docs/captures/TP4/CREATE.PNG" width="220" /> | <img src="./docs/captures/TP4/EDIT.PNG" width="220" /> |

## 4️⃣ TP4B – Robots (CRUD + Redux Toolkit)

**Dépendances & rôles**
| Package                | Rôle principal                                                                 |
|------------------------|-------------------------------------------------------------------------------|
| @reduxjs/toolkit (RTK) | State management, reducers, actions, slices                                   |
| react-redux            | Liaison React <-> Redux (hooks, Provider)                                     |
| redux-persist          | Persistance du state Redux (AsyncStorage)                                     |

---

**Arborescence**
```
app/(main)/tp4-robots-rtk/
  index.tsx            # Liste des robots
  create.tsx           # Création
  edit/[id].tsx        # Édition
  _layout.tsx          # Stack navigation
app/tp4-robots-rtk/
  store.ts             # Store Redux + persistance
  rootReducer.ts       # combineReducers
  robots/robotsSlice.ts# Slice robots (CRUD)
  robots/selectors.ts  # Selecteurs
  hooks.ts             # Typed hooks
  validation/robotSchema.ts # Zod : schéma de validation
  components/RobotForm.tsx  # Formulaire réutilisable
```
**Routes principales**
- `/tp4-robots-rtk` : liste
- `/tp4-robots-rtk/create` : création
- `/tp4-robots-rtk/edit/[id]` : édition

---

**Règles de validation**
- `name` : string, min 2, unique (pas de doublon)
- `label` : string, min 3
- `year` : entier, 1950 ≤ year ≤ année courante
- `type` : enum obligatoire (`industrial`, `service`, `medical`, `educational`, `other`)

---

**Choix de stack formulaire**
- **Formik** + Zod
- **Justification** : Il est plus simple à intégrer et pour faire l'autre solution que pour le TP4-A

---

**Plan de tests manuels exécutés**
- **Create** :
  - Succès → nouvel item dans la liste
  - Échec (name dupliqué, year invalide) → erreurs affichées, pas de création
- **Edit** :
  - Charger un robot existant, modifier, sauvegarder → retour à la liste mise à jour
- **Delete** :
  - Suppression confirmée → l’item disparaît, feedback visuel/haptique
- **Persistance** :
  - Créer 2 robots, redémarrer l’app → robots toujours présents
- **UX** :
  - Clavier ne masque pas le bouton submit
  - Submit désactivé tant que formulaire invalide
