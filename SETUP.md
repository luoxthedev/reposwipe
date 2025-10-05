# 🚀 Guide de configuration RepoSwipe

## Étape 1 : Créer un compte Supabase (Gratuit)

### 1.1 Inscription
1. Va sur [supabase.com](https://supabase.com)
2. Clique sur "Start your project"
3. Connecte-toi avec GitHub (recommandé)

### 1.2 Créer un projet
1. Clique sur "New Project"
2. Choisis un nom : `reposwipe`
3. Crée un mot de passe pour la base de données (garde-le précieusement !)
4. Choisis une région proche de toi
5. Clique sur "Create new project"
6. ⏳ Attends 2-3 minutes que le projet soit créé

### 1.3 Créer les tables

Une fois le projet créé, va dans l'onglet **SQL Editor** et exécute ce script :

```sql
-- Table des utilisateurs
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Table des swipes
CREATE TABLE swipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  repo_id BIGINT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('like', 'reject', 'super')),
  repo_data JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, repo_id)
);

-- Index pour améliorer les performances
CREATE INDEX idx_swipes_user_id ON swipes(user_id);
CREATE INDEX idx_swipes_action ON swipes(action);
CREATE INDEX idx_users_email ON users(email);
```

### 1.4 Récupérer les clés API

1. Va dans **Settings** > **API**
2. Tu verras :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon public** : `eyJhbGc...` (clé publique)
   - **service_role** : `eyJhbGc...` (clé secrète - NE JAMAIS PARTAGER)

---

## Étape 2 : Installer Docker Desktop (pour Redis)

### 2.1 Télécharger Docker
1. Va sur [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
2. Télécharge **Docker Desktop for Windows**
3. Installe-le (redémarre si nécessaire)
4. Lance Docker Desktop

### 2.2 Vérifier l'installation
Ouvre PowerShell et tape :
```bash
docker --version
```

Tu devrais voir : `Docker version 24.x.x`

---

## Étape 3 : Configurer le projet

### 3.1 Installer les dépendances
```bash
npm install
```

### 3.2 Créer le fichier .env
```bash
copy .env.exemple .env
```

### 3.3 Éditer le fichier .env

Ouvre `.env` et remplis avec tes valeurs Supabase :

```env
PORT=3000
SESSION_SECRET=change_moi_avec_un_secret_aleatoire_123456
NODE_ENV=development

# Supabase (copie depuis Supabase Dashboard > Settings > API)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...ta_cle_service_role
SUPABASE_ANON_KEY=eyJhbGc...ta_cle_anon

# Redis (laisser comme ça)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

---

## Étape 4 : Lancer l'application

### 4.1 Démarrer Redis avec Docker
```bash
npm run docker:up
```

Attends quelques secondes, puis vérifie que Redis fonctionne :
```bash
docker ps
```

Tu devrais voir `reposwipe-redis` dans la liste.

### 4.2 Démarrer le serveur
```bash
npm run dev
```

Tu devrais voir dans la console :
```
✅ Supabase connecté
✅ Redis connecté
✅ Sessions configurées avec Redis
🚀 Serveur démarré sur http://localhost:3000
```

### 4.3 Ouvrir l'application
Ouvre ton navigateur sur : **http://localhost:3000**

---

## 🎉 C'est prêt !

Tu peux maintenant :
1. Créer un compte
2. Te connecter
3. Commencer à swiper des repos GitHub !

---

## 🐛 Problèmes courants

### Redis ne démarre pas
```bash
# Arrêter et redémarrer
npm run docker:down
npm run docker:up
```

### Docker Desktop n'est pas lancé
Lance Docker Desktop depuis le menu Démarrer, puis réessaie.

### Erreur Supabase
Vérifie que :
- Les clés API sont correctes dans `.env`
- Les tables ont bien été créées (va dans Supabase > Table Editor)

### Port 3000 déjà utilisé
Change le port dans `.env` :
```env
PORT=3001
```

---

## 📊 Vérifier que tout fonctionne

### Tester Redis
```bash
docker exec -it reposwipe-redis redis-cli ping
```
Devrait retourner : `PONG`

### Voir les logs Redis
```bash
npm run docker:logs
```

### Voir les données dans Supabase
Va sur Supabase Dashboard > Table Editor > users ou swipes

---

## 🛑 Arrêter l'application

```bash
# Arrêter le serveur Node.js
Ctrl + C dans le terminal

# Arrêter Redis
npm run docker:down
```

---

## 💡 Astuces

### Redis est optionnel
Si tu ne veux pas utiliser Redis, l'app fonctionnera quand même avec des sessions en mémoire (mais tu perdras ta session à chaque redémarrage du serveur).

### Supabase gratuit
Le plan gratuit de Supabase offre :
- 500 MB de base de données
- 1 GB de stockage
- 2 GB de bande passante
- Largement suffisant pour ce projet !

### Voir les logs de l'application
Les logs sont dans le dossier `logs/` :
- `combined.log` : Tous les logs
- `error.log` : Uniquement les erreurs
