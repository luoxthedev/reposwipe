# 🚀 Démarrage rapide de RepoSwipe

## Étapes pour lancer l'application

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer l'environnement
Copie le fichier `.env.exemple` en `.env` :
```bash
copy .env.exemple .env
```

Le fichier `.env` contient déjà des valeurs par défaut qui fonctionnent pour le développement local.

### 3. Lancer le serveur
```bash
npm start
```

Ou pour le développement avec auto-reload :
```bash
npm run dev
```

### 4. Ouvrir l'application
Ouvre ton navigateur sur : **http://localhost:3000**

## 🎯 Utilisation

1. Sur la page d'accueil, clique sur **"Commencer à swiper"**
2. Inscris-toi avec :
   - Un nom d'utilisateur
   - Un email
   - Un mot de passe (minimum 6 caractères)
3. Tu seras redirigé vers l'application de swipe
4. Commence à découvrir des repos GitHub !

## 🔑 Fonctionnalités disponibles

- **Swipe** : Glisse les cartes ou utilise les boutons
- **Filtres** : Clique sur l'icône filtre pour personnaliser ta recherche
- **Favoris** : Clique sur le cœur pour voir tes repos sauvegardés
- **Déconnexion** : Clique sur l'icône de déconnexion en haut à droite

## ⚠️ Notes importantes

- Les données sont stockées en mémoire (redémarrer le serveur efface tout)
- Pour une utilisation en production, il faut ajouter une vraie base de données
- L'API GitHub a une limite de 60 requêtes/heure sans authentification

## 🐛 Problèmes courants

### Le serveur ne démarre pas
- Vérifie que le port 3000 n'est pas déjà utilisé
- Change le port dans le fichier `.env` si nécessaire

### Erreur "Cannot find module"
- Assure-toi d'avoir lancé `npm install`

### Les repos ne se chargent pas
- Vérifie ta connexion internet
- L'API GitHub peut avoir des limites de taux

Bon swipe ! 🎉
