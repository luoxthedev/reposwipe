# 🔍 RepoSwipe - Tinder pour GitHub

Découvrez des projets GitHub de manière fun et interactive ! Swipez à gauche pour passer, à droite pour aimer, et vers le haut pour un super like !

## ✨ Fonctionnalités

- 🎴 **Interface Tinder-like** - Swipez les repos GitHub
- 🔐 **Authentification** - Créez un compte pour sauvegarder vos swipes
- 💖 **Système de favoris** - Sauvegardez vos repos préférés sur le serveur
- 🔍 **Filtres avancés** - Par langage, stars, date
- 📱 **Responsive** - Fonctionne sur mobile et desktop
- 🎯 **Drag & Drop** - Interaction naturelle
- ⚡ **Super Like** - Pour les projets exceptionnels
- 💾 **Sauvegarde serveur** - Vos favoris sont synchronisés

## 🚀 Installation rapide

```bash
# 1. Clone le repo
git clone https://github.com/luoxthedev/reposwipe.git
cd reposwipe

# 2. Installe les dépendances
npm install

# 3. Configure l'environnement
copy .env.exemple .env

# 4. Lance MongoDB et Redis (voir INSTALLATION.md)

# 5. Démarre le serveur
npm run dev
```

Ouvre ton navigateur sur `http://localhost:3000`

📖 **Guide complet** : Voir [INSTALLATION.md](INSTALLATION.md) pour l'installation détaillée de MongoDB et Redis.

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
- **MongoDB** + **Mongoose** - Base de données
- **Redis** + **connect-redis** - Gestion des sessions
- **bcryptjs** - Hashage des mots de passe
- **Winston** - Système de logs
- **express-session** - Gestion des sessions

### Frontend
- **HTML5** + **CSS3** - Interface utilisateur
- **JavaScript vanilla** - Logique client
- **GitHub API** - Récupération des repos
- **Font Awesome** - Icônes

### DevOps
- **MCP Supabase** - Alternative base de données (optionnel)
- **dotenv** - Variables d'environnement

## 📝 TODO

- [x] Ajouter une vraie base de données (MongoDB)
- [x] Améliorer la gestion des sessions avec Redis
- [x] Ajouter des logs avec Winston
- [x] Configuration MCP Supabase
- [ ] Ajouter des statistiques utilisateur dans l'UI
- [ ] Implémenter le partage de favoris
- [ ] Mode sombre
- [ ] Export des favoris en JSON
- [ ] Notifications push
- [ ] Tests unitaires et d'intégration
- [ ] Docker compose pour faciliter le déploiement

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
