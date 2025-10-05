# 📦 Guide d'installation complet - RepoSwipe

## Prérequis

- **Node.js** (v16 ou supérieur)
- **MongoDB** (v5 ou supérieur)
- **Redis** (v6 ou supérieur) - Optionnel mais recommandé

## Installation pas à pas

### 1. Cloner le projet

```bash
git clone https://github.com/luoxthedev/reposwipe.git
cd reposwipe
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Installer MongoDB

#### Windows
Télécharge et installe depuis : https://www.mongodb.com/try/download/community

Ou avec Chocolatey :
```bash
choco install mongodb
```

#### macOS
```bash
brew tap mongodb/brew
brew install mongodb-community
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get install mongodb
```

Démarre MongoDB :
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### 4. Installer Redis (Optionnel)

#### Windows
Télécharge depuis : https://github.com/microsoftarchive/redis/releases

Ou utilise WSL2 :
```bash
wsl --install
sudo apt-get install redis-server
sudo service redis-server start
```

#### macOS
```bash
brew install redis
brew services start redis
```

#### Linux
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

### 5. Configuration

Copie le fichier d'exemple :
```bash
copy .env.exemple .env
```

Édite `.env` avec tes valeurs :
```env
PORT=3000
SESSION_SECRET=ton_secret_super_securise_ici
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/reposwipe

# Redis (optionnel)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### 6. Lancer l'application

Mode développement (avec auto-reload) :
```bash
npm run dev
```

Mode production :
```bash
npm start
```

### 7. Accéder à l'application

Ouvre ton navigateur sur : **http://localhost:3000**

## 🔧 Configuration avancée

### Utiliser Supabase (Alternative à MongoDB)

1. Crée un compte sur [Supabase](https://supabase.com)
2. Crée un nouveau projet
3. Récupère tes clés API dans Settings > API
4. Ajoute-les dans `.env` :

```env
SUPABASE_URL=https://ton-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=ta_cle_service_role
SUPABASE_ANON_KEY=ta_cle_anon
```

5. Configure le MCP Supabase dans `.kiro/settings/mcp.json`

### Configuration Redis en production

Pour une meilleure performance en production, utilise Redis :

```env
REDIS_HOST=ton-serveur-redis.com
REDIS_PORT=6379
REDIS_PASSWORD=ton_mot_de_passe_redis
```

## 🐛 Dépannage

### MongoDB ne démarre pas
```bash
# Vérifier le statut
mongod --version

# Vérifier si le service tourne
# Windows
sc query MongoDB

# Linux/macOS
sudo systemctl status mongod
```

### Redis ne se connecte pas
```bash
# Tester la connexion
redis-cli ping
# Devrait retourner "PONG"
```

### Port 3000 déjà utilisé
Change le port dans `.env` :
```env
PORT=3001
```

### Erreur "Cannot find module"
```bash
# Réinstaller les dépendances
rm -rf node_modules
npm install
```

## 📊 Vérifier que tout fonctionne

1. **MongoDB** : Les logs devraient afficher "✅ MongoDB connecté"
2. **Redis** : Les logs devraient afficher "✅ Redis connecté"
3. **Serveur** : Les logs devraient afficher "🚀 Serveur démarré"

Les logs sont disponibles dans le dossier `logs/` :
- `combined.log` : Tous les logs
- `error.log` : Uniquement les erreurs

## 🚀 Prêt à swiper !

Une fois tout installé, tu peux :
1. Créer un compte
2. Te connecter
3. Commencer à swiper des repos GitHub !

Pour toute question, ouvre une issue sur GitHub.
