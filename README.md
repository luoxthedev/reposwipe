# 🔍 RepoSwipe - Tinder pour GitHub

Découvrez des projets GitHub de manière fun et interactive ! Swipez à gauche pour passer, à droite pour aimer, et vers le haut pour un super like !

## ✨ Fonctionnalités

- 🎴 **Interface Tinder-like** - Swipez les repos GitHub
- 🔐 **Authentification** - Créez un compte pour sauvegarder vos swipes
- 💖 **Système de favoris** - Sauvegardez vos repos préférés sur le serveur
- 📊 **Statistiques** - Suivez vos swipes, likes, et taux d'appréciation
- 🌙 **Mode sombre** - Interface adaptative avec sauvegarde de préférence
- 🔍 **Filtres avancés** - Par langage, stars, date
- 🎲 **Randomisation** - Découvrez toujours de nouveaux repos
- 🚦 **Rate limiting** - Protection contre les abus (7 req/s)
- 📱 **Responsive** - Fonctionne sur mobile et desktop
- 🎯 **Drag & Drop** - Interaction naturelle
- ⚡ **Super Like** - Pour les projets exceptionnels
- 💾 **Sauvegarde serveur** - Vos favoris sont synchronisés
- 🐳 **Docker ready** - Déploiement facile en production

## 🚀 Installation rapide

```bash
# 1. Clone le repo
git clone https://github.com/luoxthedev/reposwipe.git
cd reposwipe

# 2. Installe les dépendances
npm install

# 3. Configure Supabase (gratuit, 2 minutes)
# Voir SETUP.md pour le guide complet

# 4. Configure l'environnement
copy .env.exemple .env
# Ajoute tes clés Supabase dans .env

# 5. Lance Redis avec Docker
npm run docker:up

# 6. Démarre le serveur
npm run dev
```

Ouvre ton navigateur sur `http://localhost:3000`

## 🐳 Exécuter avec Docker

Si tu veux exécuter RepoSwipe rapidement sans installer Node.js localement, suis ces étapes :

1) Installer Docker

 - Sur Debian/Ubuntu :

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
	"deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
	$(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io
sudo usermod -aG docker $USER
```

 - Sur macOS / Windows : installe Docker Desktop depuis https://www.docker.com/get-started

2) Construire l'image (optionnel si tu veux utiliser Docker Compose)

```bash
docker build -t ghcr.io/luoxthedev/reposwipe:latest .
```

3) Lancer avec Docker (mode simple)

```bash
docker run -d -p 3000:3000 --name reposwipe \
	-e PORT=3000 \
	-e NODE_ENV=production \
	--env-file .env ghcr.io/luoxthedev/reposwipe:latest
```

4) Lancer avec Docker Compose (recommandé)

Si tu préfères utiliser `docker-compose` (définit les services Redis + app), exécute :

```bash
docker-compose up -d
```

5) Pousser l'image vers GHCR (optionnel)

Si tu veux publier l'image sur GitHub Container Registry :

```bash
# Se connecter (utilise un PAT avec write:packages)
echo $GHCR_PAT | docker login ghcr.io -u <GITHUB_USERNAME> --password-stdin

docker tag reposwipe:local ghcr.io/luoxthedev/reposwipe:latest
docker push ghcr.io/luoxthedev/reposwipe:latest
```

Note : le repository contient un workflow GitHub Actions qui build et publie automatiquement l'image sur `ghcr.io/luoxthedev/reposwipe` quand tu push sur `main`.

📖 **Guides disponibles** :
- [SETUP.md](SETUP.md) - Configuration Supabase
- [GITHUB_TOKEN.md](GITHUB_TOKEN.md) - Obtenir un token GitHub (IMPORTANT)
- [DOCKER.md](DOCKER.md) - Déploiement avec Docker (Production)
- [COMMANDS.md](COMMANDS.md) - Toutes les commandes disponibles
- [START.md](START.md) - Démarrage rapide

## 🎮 Comment utiliser

### Page d'accueil
1. Clique sur "Commencer à swiper"
2. Inscris-toi ou connecte-toi
3. Commence à découvrir des repos !

### Swipe
- **➡️ Swipe à droite** ou cliquez ❤️ = J'aime
- **⬅️ Swipe à gauche** ou cliquez ❌ = Passer
- **⬆️ Swipe vers le haut** ou cliquez ⭐ = Super Like

### Raccourcis clavier
- **→** : Like
- **←** : Skip
- **↑** : Super Like

## 📁 Structure du projet

```
RepoSwipe/
├── server/              # Backend Node.js/Express
│   ├── server.js       # Point d'entrée du serveur
│   └── routes/         # Routes API
│       ├── auth.js     # Authentification
│       └── swipes.js   # Gestion des swipes
├── public/             # Frontend
│   ├── landing.html    # Page d'accueil
│   ├── app.html        # Application de swipe
│   ├── styles/         # CSS
│   │   ├── landing.css
│   │   └── app.css
│   └── scripts/        # JavaScript
│       ├── landing.js
│       └── app.js
├── package.json
├── .env.exemple
└── .gitignore
```

## 🛠️ Technologies utilisées

### Backend
- **Node.js** + **Express** - Serveur web
- **Supabase** - Base de données PostgreSQL (gratuit)
- **Redis** + **connect-redis** - Gestion des sessions (optionnel)
- **bcryptjs** - Hashage des mots de passe
- **Winston** - Système de logs
- **express-session** - Gestion des sessions

### Frontend
- **HTML5** + **CSS3** - Interface utilisateur
- **JavaScript vanilla** - Logique client
- **GitHub API** - Récupération des repos
- **Font Awesome** - Icônes

### DevOps
- **Docker** - Redis en conteneur
- **MCP Supabase** - Intégration Supabase
- **dotenv** - Variables d'environnement

## 📝 TODO

- [x] Ajouter une vraie base de données (Supabase PostgreSQL)
- [x] Améliorer la gestion des sessions avec Redis
- [x] Ajouter des logs avec Winston
- [x] Configuration MCP Supabase
- [x] Docker pour Redis
- [x] Ajouter des statistiques utilisateur dans l'UI
- [x] Mode sombre
- [x] Rate limiting
- [x] GitHub API authentication
- [x] Randomisation des repos
- [x] Docker Compose complet
- [x] Implémenter le partage de favoris
- [x] Export des favoris en JSON
- [x] Tests unitaires et d'intégration
- [x] CI/CD avec GitHub Actions
- [ ] Notifications push
- [ ] PWA (Progressive Web App)
- [ ] Import de favoris JSON

## 🔧 Personnalisation

Vous pouvez modifier :
- Les critères de recherche dans `searchParams`
- Les couleurs dans les variables CSS
- Le nombre de cartes affichées simultanément
- Les animations de swipe

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésite pas à ouvrir une issue ou une pull request.

## 📜 Licence

MIT - Utilisez ce code comme vous voulez !
