# 🚀 Démarrage rapide de RepoSwipe

## ⚡ Installation rapide (5 minutes)

### 1️⃣ Installer les dépendances
```bash
npm install
```

### 2️⃣ Configurer Supabase (Base de données gratuite)
📖 **Suis le guide complet** : [SETUP.md](SETUP.md)

En résumé :
1. Crée un compte sur [supabase.com](https://supabase.com) (gratuit)
2. Crée un nouveau projet
3. Exécute le script SQL pour créer les tables
4. Copie tes clés API

### 3️⃣ Installer Docker Desktop (pour Redis)
1. Télécharge [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Installe et lance Docker Desktop

### 4️⃣ Configurer l'environnement
```bash
copy .env.exemple .env
```

Édite `.env` et ajoute tes clés Supabase :
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=ta_cle_ici
SUPABASE_ANON_KEY=ta_cle_ici
```

### 5️⃣ Lancer Redis avec Docker
```bash
npm run docker:up
```

### 6️⃣ Démarrer le serveur
```bash
npm run dev
```

### 7️⃣ Ouvrir l'application
Ouvre ton navigateur sur : **http://localhost:3000** 🎉

---

## 🛠️ Commandes utiles

```bash
# Démarrer Redis
npm run docker:up

# Arrêter Redis
npm run docker:down

# Voir les logs Redis
npm run docker:logs

# Démarrer le serveur en mode dev
npm run dev

# Démarrer le serveur en mode production
npm start
```

---

## 📚 Guides détaillés

- **[SETUP.md](SETUP.md)** - Guide complet étape par étape avec captures d'écran
- **[INSTALLATION.md](INSTALLATION.md)** - Installation manuelle de MongoDB/Redis (si tu ne veux pas Docker)

---

## ❓ Besoin d'aide ?

Si tu rencontres un problème, consulte la section "Problèmes courants" dans [SETUP.md](SETUP.md)

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
