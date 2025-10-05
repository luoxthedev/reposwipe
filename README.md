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

## 🚀 Installation

1. Clone le repo :
```bash
git clone https://github.com/luoxthedev/reposwipe.git
cd reposwipe
```

2. Installe les dépendances :
```bash
npm install
```

3. Configure les variables d'environnement :
```bash
cp .env.exemple .env
```
Édite le fichier `.env` avec tes propres valeurs.

4. Lance le serveur :
```bash
npm start
```

Pour le développement avec auto-reload :
```bash
npm run dev
```

5. Ouvre ton navigateur sur `http://localhost:3000`

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
- Node.js
- Express
- express-session
- bcryptjs
- dotenv

### Frontend
- HTML5
- CSS3 (animations, transitions)
- JavaScript vanilla
- API GitHub
- Font Awesome

## 📝 TODO

- [ ] Ajouter une vraie base de données (MongoDB/PostgreSQL)
- [ ] Améliorer la gestion des sessions avec Redis
- [ ] Ajouter des statistiques utilisateur
- [ ] Implémenter le partage de favoris
- [ ] Mode sombre
- [ ] Export des favoris en JSON
- [ ] Notifications push

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
