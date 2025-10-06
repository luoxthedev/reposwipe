# ⚡ Quick Start - RepoSwipe

## 🚀 Démarrage ultra-rapide (1 commande)

### Windows
```bash
start.bat
```

### Linux / macOS
```bash
chmod +x start.sh
./start.sh
```

C'est tout ! Le script fait **tout automatiquement** :
1. ✅ Vérifie Node.js
2. ✅ Installe les dépendances
3. ✅ Crée le fichier .env
4. ✅ Démarre Redis (si Docker disponible)
5. ✅ Lance l'application

---

## 📋 Prérequis minimum

**Obligatoire** :
- Node.js 16+ ([télécharger](https://nodejs.org))

**Optionnel** :
- Docker (pour Redis, sinon sessions en mémoire)

---

## 🎯 Configuration rapide

### 1. Clone le projet
```bash
git clone https://github.com/luoxthedev/reposwipe.git
cd reposwipe
```

### 2. Lance le script
**Windows** :
```bash
start.bat
```

**Linux/macOS** :
```bash
chmod +x start.sh
./start.sh
```

### 3. Configure .env
Le script ouvre automatiquement `.env`. Ajoute :
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=ta_cle_ici
GITHUB_TOKEN=ghp_ton_token_ici
```

### 4. C'est prêt !
Ouvre : **http://localhost:3000**

---

## 🐳 Avec Docker (recommandé)

Si tu as Docker installé, Redis sera automatiquement démarré.

**Vérifier Docker** :
```bash
docker --version
```

**Installer Docker** :
- Windows : [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Linux : `sudo apt install docker.io docker-compose`
- macOS : [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## 🔧 Sans Docker

L'application fonctionne **sans Docker** !

**Différences** :
- ✅ Tout fonctionne normalement
- ⚠️ Sessions en mémoire (perdues au redémarrage)
- ⚠️ Pas de scalabilité horizontale

**Pour la production**, utilise Docker ou un service Redis externe.

---

## 🛑 Arrêter l'application

Appuie sur **Ctrl+C** dans le terminal.

Pour arrêter Redis (si Docker) :
```bash
docker-compose down
```

---

## 🐛 Problèmes courants

### "Node.js n'est pas installé"
Installe Node.js : https://nodejs.org

### "Docker ne fonctionne pas"
- Windows : Lance Docker Desktop
- Linux : `sudo systemctl start docker`
- Ou continue sans Docker (sessions en mémoire)

### "Port 3000 déjà utilisé"
Change le port dans `.env` :
```env
PORT=3001
```

### "Erreur Supabase"
Vérifie que tes clés sont correctes dans `.env`.
Guide : [SETUP.md](SETUP.md)

---

## 📚 Guides complets

- [SETUP.md](SETUP.md) - Configuration Supabase
- [GITHUB_TOKEN.md](GITHUB_TOKEN.md) - Token GitHub
- [DOCKER.md](DOCKER.md) - Déploiement production
- [TESTING.md](TESTING.md) - Tests

---

## 🎉 C'est tout !

Une seule commande et tout fonctionne ! 🚀

**Windows** : `start.bat`  
**Linux/macOS** : `./start.sh`
