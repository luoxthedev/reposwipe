# 🪟 Installation Windows - RepoSwipe

## ⚡ Installation rapide (5 minutes)

### Prérequis

**Obligatoire** :
- Windows 10 ou 11
- Connexion Internet

**Optionnel** :
- Docker Desktop (pour Redis)

---

## 📦 Étape 1 : Installer Node.js

### Télécharger Node.js
1. Va sur https://nodejs.org
2. Télécharge la version **LTS** (recommandée)
3. Lance l'installeur `node-v20.x.x-x64.msi`
4. Clique sur "Next" jusqu'à la fin
5. Redémarre ton terminal

### Vérifier l'installation
Ouvre PowerShell ou CMD et tape :
```bash
node --version
npm --version
```

Tu devrais voir :
```
v20.x.x
10.x.x
```

---

## 🐳 Étape 2 : Installer Docker Desktop (Optionnel)

### Pourquoi Docker ?
- Pour avoir Redis (sessions persistantes)
- Pas obligatoire, l'app fonctionne sans

### Installation
1. Va sur https://www.docker.com/products/docker-desktop/
2. Télécharge **Docker Desktop for Windows**
3. Lance l'installeur
4. Redémarre ton PC si demandé
5. Lance Docker Desktop depuis le menu Démarrer

### Vérifier l'installation
```bash
docker --version
```

Tu devrais voir :
```
Docker version 24.x.x
```

---

## 📥 Étape 3 : Télécharger RepoSwipe

### Option A : Avec Git
```bash
git clone https://github.com/luoxthedev/reposwipe.git
cd reposwipe
```

### Option B : Sans Git
1. Va sur https://github.com/luoxthedev/reposwipe
2. Clique sur **Code** > **Download ZIP**
3. Extrais le ZIP
4. Ouvre PowerShell dans le dossier extrait

---

## 🚀 Étape 4 : Lancer l'application

### Méthode automatique (recommandée)
Double-clique sur `start.bat` ou dans PowerShell :
```bash
.\start.bat
```

Le script fait **tout automatiquement** :
- ✅ Installe les dépendances
- ✅ Crée le fichier .env
- ✅ Démarre Redis (si Docker disponible)
- ✅ Lance l'application

### Méthode manuelle
```bash
# 1. Installer les dépendances
npm install

# 2. Créer le fichier .env
copy .env.exemple .env

# 3. Éditer .env (voir étape 5)
notepad .env

# 4. Démarrer Redis (si Docker)
docker-compose up -d

# 5. Lancer l'app
npm start
```

---

## ⚙️ Étape 5 : Configuration

### Créer un compte Supabase (gratuit)
1. Va sur https://supabase.com
2. Clique sur **Start your project**
3. Connecte-toi avec GitHub
4. Crée un nouveau projet
5. Attends 2-3 minutes

### Créer les tables
Dans Supabase, va dans **SQL Editor** et exécute :
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

-- Index
CREATE INDEX idx_swipes_user_id ON swipes(user_id);
CREATE INDEX idx_swipes_action ON swipes(action);
CREATE INDEX idx_users_email ON users(email);
```

### Récupérer les clés API
Dans Supabase > **Settings** > **API** :
- Copie **Project URL**
- Copie **anon public** key
- Copie **service_role** key (secret)

### Créer un token GitHub
1. Va sur GitHub > **Settings** > **Developer settings**
2. **Personal access tokens** > **Tokens (classic)**
3. **Generate new token (classic)**
4. Coche `public_repo`
5. Copie le token `ghp_...`

### Éditer .env
Ouvre `.env` avec Notepad et remplis :
```env
PORT=3000
SESSION_SECRET=change_moi_avec_un_secret_aleatoire
NODE_ENV=development

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
SUPABASE_ANON_KEY=eyJhbGc...

# GitHub
GITHUB_TOKEN=ghp_...

# Redis (laisser comme ça)
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## ✅ Étape 6 : Vérifier que tout fonctionne

### Ouvrir l'application
1. Ouvre ton navigateur
2. Va sur http://localhost:3000
3. Crée un compte
4. Commence à swiper !

### Vérifier les logs
Dans le terminal, tu devrais voir :
```
✅ Supabase connecté
✅ Redis connecté (ou sessions en mémoire)
🚀 Serveur démarré sur http://localhost:3000
```

---

## 🐛 Problèmes courants

### "Node.js n'est pas reconnu"
- Redémarre ton terminal
- Vérifie l'installation : `node --version`
- Réinstalle Node.js si nécessaire

### "Docker ne fonctionne pas"
- Lance Docker Desktop
- Attends qu'il soit complètement démarré (icône verte)
- Ou continue sans Docker (sessions en mémoire)

### "Port 3000 déjà utilisé"
Change le port dans `.env` :
```env
PORT=3001
```

### "Erreur Supabase"
- Vérifie que les clés sont correctes
- Vérifie que les tables sont créées
- Vérifie ta connexion Internet

### Redis ne se connecte pas
C'est normal si Docker Desktop n'est pas lancé. L'app fonctionne quand même !

---

## 🛑 Arrêter l'application

### Arrêter le serveur
Dans le terminal, appuie sur **Ctrl+C**

### Arrêter Redis
```bash
docker-compose down
```

---

## 🔄 Mettre à jour

```bash
git pull origin main
npm install
.\start.bat
```

---

## 💡 Astuces Windows

### Créer un raccourci
1. Clic droit sur `start.bat`
2. **Créer un raccourci**
3. Déplace le raccourci sur le Bureau

### Lancer au démarrage
1. Appuie sur **Win+R**
2. Tape `shell:startup`
3. Copie le raccourci dans ce dossier

### Ouvrir PowerShell ici
Dans l'explorateur :
- **Shift + Clic droit** dans le dossier
- **Ouvrir PowerShell ici**

---

## 📚 Guides complets

- [SETUP.md](SETUP.md) - Configuration Supabase détaillée
- [GITHUB_TOKEN.md](GITHUB_TOKEN.md) - Créer un token GitHub
- [DOCKER.md](DOCKER.md) - Déploiement production

---

## 🎉 C'est tout !

Tu es prêt à swiper ! 🚀

**Besoin d'aide ?** Ouvre une issue sur GitHub.
