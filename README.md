# 📱 RN Advanced Labs

Application **Expo React Native** servant de support pour tous les TP du cours.

## 📑 Sommaire
- [🚀 Prérequis](#-prérequis)
- [▶️ Lancer l’application](#️-lancer-lapplication)
- [📂 Structure attendue](#-structure-attendue)
- [1️⃣ TP1 – Profile Card](#tp1--profile-card)


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

## 📂 Structure attendue 
```
rn-advanced-labs/
├─ app/
│  ├─ tp1-profile-card/
│  │   ├─ components/         # composants spécifiques au TP1
│  │   ├─ screens/            # écrans du TP1
│  │   └─ index.tsx           # point d'entrée du TP1
│  └─ ...
├─ App.tsx
└─ ...
```
- **Un dossier par TP** (`tp1-profile-card`, `tp2-navigation`, etc.).
- `components/` et `screens/` dans chaque dossier.
- `index.tsx` exporte l’écran principal du TP.


## 1️⃣ TP1 – Profile Card

- 📂 **Dossier** : [app/tp1-profile-card](./app/tp1-profile-card/)
- 🧾 **Description** :
  - Carte de profil avec **photo**, **nom**, **fonction**
  - Bouton **Follow/Unfollow** qui met à jour le **compteur de followers**
  - **useEffect** : +1 follower automatiquement toutes les **5s**, avec **cleanup** du timer

### Arborescence `app/`
![Arborescence app](./docs/tp1-arborescence.png)

