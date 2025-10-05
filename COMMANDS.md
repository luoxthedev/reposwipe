# 🛠️ Commandes disponibles

## Commandes de développement

### Démarrer le serveur
```bash
# Mode développement (avec auto-reload)
npm run dev

# Mode production
npm start
```

### Docker (Redis)
```bash
# Démarrer Redis
npm run docker:up

# Arrêter Redis
npm run docker:down

# Voir les logs Redis
npm run docker:logs
```

## Commandes de maintenance

### Clear Database (Supprimer tous les swipes)
```bash
npm run clear-db
```

⚠️ **ATTENTION** : Cette commande supprime **TOUS les swipes** de **TOUS les utilisateurs** !

**Ce qui est supprimé** :
- ✅ Tous les swipes (likes, rejects, super likes)

**Ce qui est conservé** :
- ✅ Les comptes utilisateurs
- ✅ Les emails et mots de passe

**Utilisation** :
1. Lance la commande : `npm run clear-db`
2. Tape `OUI` (en majuscules) pour confirmer
3. Les swipes sont supprimés instantanément

**Exemple** :
```bash
$ npm run clear-db

⚠️  ATTENTION : Cette action va supprimer TOUS les swipes de TOUS les utilisateurs !
Les comptes utilisateurs seront conservés.

Êtes-vous sûr de vouloir continuer ? (tapez "OUI" pour confirmer) : OUI

🗑️  Suppression des swipes en cours...
✅ 1234 swipes ont été supprimés avec succès !
```

## Fonctionnalités de sécurité

### Rate Limiting

L'application inclut un système de rate limiting pour éviter les abus :

#### Swipes
- **Limite** : 7 requêtes par seconde
- **Pénalité** : Blocage de 10 secondes
- **Message** : "Trop de requêtes ! Attends 10 secondes avant de continuer."

#### Authentification
- **Limite** : 5 tentatives par minute
- **Pénalité** : Blocage de 1 minute
- **Message** : "Trop de tentatives de connexion. Réessaye dans 1 minute."

### Désactiver le rate limiting (développement uniquement)

Ajoute dans ton `.env` :
```env
DISABLE_RATE_LIMIT=true
```

⚠️ **Ne JAMAIS faire ça en production !**

## Randomisation des repos

L'application utilise plusieurs techniques pour éviter de montrer toujours les mêmes repos :

1. **Mots-clés aléatoires** : Ajoute des mots-clés variés à chaque recherche
2. **Pages aléatoires** : Charge des pages aléatoires (1-10) de résultats
3. **Mélange des résultats** : Utilise l'algorithme Fisher-Yates pour mélanger les repos

**Mots-clés utilisés** :
- Technologies : react, vue, angular, node, python, java, go
- Catégories : framework, library, tool, api, app, web, mobile
- Concepts : docker, kubernetes, cloud, serverless, microservices
- Et plus encore...

## Logs

Les logs sont automatiquement créés dans le dossier `logs/` :

```bash
logs/
├── combined.log    # Tous les logs
└── error.log       # Uniquement les erreurs
```

**Voir les logs en temps réel** :
```bash
# Windows
type logs\combined.log

# Linux/macOS
tail -f logs/combined.log
```

## Troubleshooting

### Redis ne démarre pas
```bash
npm run docker:down
npm run docker:up
```

### Voir les erreurs
```bash
type logs\error.log
```

### Réinitialiser complètement
```bash
# 1. Arrêter Redis
npm run docker:down

# 2. Supprimer les données Redis
docker volume rm reposwipe_redis_data

# 3. Supprimer tous les swipes
npm run clear-db

# 4. Redémarrer
npm run docker:up
npm run dev
```

## Variables d'environnement

Voir `.env.exemple` pour la liste complète des variables disponibles.

**Variables importantes** :
- `PORT` : Port du serveur (défaut: 3000)
- `SESSION_SECRET` : Secret pour les sessions (IMPORTANT en production)
- `SUPABASE_URL` : URL de ton projet Supabase
- `SUPABASE_SERVICE_ROLE_KEY` : Clé service role Supabase
- `NODE_ENV` : Environment (development/production)
- `DISABLE_RATE_LIMIT` : Désactiver le rate limiting (dev uniquement)
