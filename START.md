# 🚀 Démarrage rapide de RepoSwipe

## Option 1 : Avec Docker (Recommandé) 🐳

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer l'environnement
```bash
copy .env.exemple .env
```

### 3. Lancer MongoDB et Redis avec Docker
```bash
npm run docker:up
```

Cette commande démarre automatiquement MongoDB et Redis en arrière-plan.

### 4. Lancer le serveur
```bash
npm run dev
```

### 5. Ouvrir l'application
Ouvre ton navigateur sur : **http://localhost:3000**

### Commandes Docker utiles
```bash
# Arrêter les services
npm run docker:down

# Voir les logs
npm run docker:logs

# Redémarrer les services
npm run docker:down && npm run docker:up
```

---

## Option 2 : Installation manuelle

### 1. Installer les dépendances
```bash
npm install
```

### 2. Installer MongoDB et Redis
Voir le guide complet : [INSTALLATION.md](INSTALLATION.md)

### 3. Configurer l'environnement
```bash
copy .env.exemple .env
```

### 4. Lancer le serveur
```bash
npm run dev
```

### 5. Ouvrir l'application
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
