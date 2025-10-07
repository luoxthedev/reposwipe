# 🐧 Installation Linux - RepoSwipe

## ⚡ Installation rapide (5 minutes)

### Prérequis

**Obligatoire** :
- Ubuntu 20.04+ / Debian 11+ / Fedora 35+ / Arch Linux
- Connexion Internet
- Terminal

**Optionnel** :
- Docker (pour Redis)

---

## 📦 Étape 1 : Installer Node.js

### Ubuntu / Debian
```bash
# Installer Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier
node --version
npm --version
```

### Fedora
```bash
# Installer Node.js
sudo dnf install nodejs npm

# Vérifier
node --version
npm --version
```

### Arch Linux
```bash
# Installer Node.js
sudo pacman -S nodejs npm

# Vérifier
node --version
npm --version
```

### Alternative : nvm (recommandé)
```bash
# Installer nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recharger le shell
source ~/.bashrc

# Installer Node.js
nvm install 20
nvm use 20

# Vérifier
node --version
```

---

## 🐳 Étape 2 : Installer Docker (Optionnel)

### Pourquoi Docker ?
- Pour avoir Redis (sessions persistantes)
- Pas obligatoire, l'app fonctionne sans

### Ubuntu / Debian
```bash
# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Ajouter ton user au groupe docker
sudo usermod -aG docker $USER

# Installer Docker Compose
sudo apt-get install docker-compose-plugin

# Redémarrer la session
newgrp docker

# Vérifier
docker --version
docker compose version
```

### Fedora
```bash
# Installer Docker
sudo dnf install docker docker-compose

# Démarrer Docker
sudo systemctl start docker
sudo systemctl enable docker

# Ajouter ton user
sudo usermod -aG docker $USER
newgrp docker
```

### Arch Linux
```bash
# Installer Docker
sudo pacman -S docker docker-compose

# Démarrer Docker
sudo systemctl start docker
sudo systemctl enable docker

# Ajouter ton user
sudo usermod -aG docker $USER
newgrp docker
```

---

## 📥 Étape 3 : Télécharger RepoSwipe

```bash
# Cloner le repo
git clone https://github.com/luoxthedev/reposwipe.git

# Entrer dans le dossier
cd reposwipe
```

---

## 🚀 Étape 4 : Lancer l'application

### Méthode automatique (recommandée)
```bash
# Rendre le script exécutable
chmod +x start.sh

# Lancer
./start.sh
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
cp .env.exemple .env

# 3. Éditer .env (voir étape 5)
nano .env

# 4. Démarrer Redis (si Docker)
docker compose up -d

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
```bash
nano .env
```

Remplis avec tes valeurs :
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

Sauvegarde : **Ctrl+O** puis **Entrée**, quitte : **Ctrl+X**

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

### "node: command not found"
```bash
# Vérifier l'installation
which node

# Réinstaller si nécessaire
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### "Permission denied" pour Docker
```bash
# Ajouter ton user au groupe docker
sudo usermod -aG docker $USER

# Recharger
newgrp docker

# Ou redémarrer la session
```

### "Port 3000 déjà utilisé"
```bash
# Trouver le processus
sudo lsof -i :3000

# Tuer le processus
sudo kill -9 <PID>

# Ou changer le port dans .env
nano .env
# PORT=3001
```

### "Erreur Supabase"
- Vérifie que les clés sont correctes
- Vérifie que les tables sont créées
- Vérifie ta connexion Internet

### Redis ne se connecte pas
```bash
# Vérifier Docker
docker ps

# Redémarrer Redis
docker compose down
docker compose up -d

# Ou continue sans (sessions en mémoire)
```

---

## 🛑 Arrêter l'application

### Arrêter le serveur
Dans le terminal, appuie sur **Ctrl+C**

### Arrêter Redis
```bash
docker compose down
```

---

## 🔄 Mettre à jour

```bash
git pull origin main
npm install
./start.sh
```

---

## 🚀 Lancer au démarrage (systemd)

### Créer un service
```bash
sudo nano /etc/systemd/system/reposwipe.service
```

Contenu :
```ini
[Unit]
Description=RepoSwipe Application
After=network.target docker.service

[Service]
Type=simple
User=ton_user
WorkingDirectory=/chemin/vers/reposwipe
ExecStart=/usr/bin/npm start
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

### Activer le service
```bash
sudo systemctl daemon-reload
sudo systemctl enable reposwipe
sudo systemctl start reposwipe

# Vérifier le statut
sudo systemctl status reposwipe

# Voir les logs
sudo journalctl -u reposwipe -f
```

---

## 💡 Astuces Linux

### Alias pratique
Ajoute dans `~/.bashrc` :
```bash
alias reposwipe='cd ~/reposwipe && ./start.sh'
```

Recharge :
```bash
source ~/.bashrc
```

Utilise :
```bash
reposwipe
```

### Ouvrir automatiquement le navigateur
Modifie `start.sh`, ajoute avant `npm start` :
```bash
xdg-open http://localhost:3000 &
```

### Logs en temps réel
```bash
tail -f logs/combined.log
```

---

## 📚 Guides complets

- [SETUP.md](SETUP.md) - Configuration Supabase détaillée
- [GITHUB_TOKEN.md](GITHUB_TOKEN.md) - Créer un token GitHub
- [DOCKER.md](DOCKER.md) - Déploiement production

---

## 🎉 C'est tout !

Tu es prêt à swiper ! 🚀

**Besoin d'aide ?** Ouvre une issue sur GitHub.
