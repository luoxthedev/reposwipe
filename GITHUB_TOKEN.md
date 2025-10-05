# 🔑 Obtenir un token GitHub (5 minutes)

## Pourquoi un token GitHub ?

**Sans token** : 60 requêtes/heure (limite atteinte rapidement)  
**Avec token** : 5000 requêtes/heure (largement suffisant)

## 📝 Étapes pour créer un token

### 1. Va sur GitHub
Connecte-toi sur [github.com](https://github.com)

### 2. Accède aux paramètres
1. Clique sur ton avatar en haut à droite
2. Clique sur **Settings**

### 3. Crée un token
1. Dans le menu de gauche, tout en bas, clique sur **Developer settings**
2. Clique sur **Personal access tokens**
3. Clique sur **Tokens (classic)**
4. Clique sur **Generate new token** > **Generate new token (classic)**

### 4. Configure le token
1. **Note** : Donne un nom, par exemple : `RepoSwipe App`
2. **Expiration** : Choisis `No expiration` (ou 90 days si tu préfères)
3. **Permissions** : Coche uniquement :
   - ✅ `public_repo` (sous la section "repo")
   
   C'est tout ! Pas besoin d'autres permissions.

4. Clique sur **Generate token** en bas de la page

### 5. Copie le token
⚠️ **IMPORTANT** : Le token ne sera affiché qu'une seule fois !

1. Copie le token qui commence par `ghp_...`
2. Garde-le précieusement

### 6. Ajoute-le dans ton .env
Ouvre ton fichier `.env` et ajoute :

```env
GITHUB_TOKEN=ghp_ton_token_ici
```

Remplace `ghp_ton_token_ici` par ton vrai token.

### 7. Redémarre le serveur
```bash
# Arrête le serveur (Ctrl+C)
# Puis relance
npm run dev
```

## ✅ Vérifier que ça fonctionne

Dans la console du serveur, tu devrais voir :
```
GitHub API: 4999/5000 requêtes restantes
```

Dans la console du navigateur (F12), tu verras :
```
GitHub API: 4999/5000 requêtes restantes
```

## 🔒 Sécurité

### ⚠️ NE JAMAIS :
- ❌ Partager ton token
- ❌ Le commit dans Git
- ❌ Le mettre sur GitHub
- ❌ Le montrer en screenshot

### ✅ TOUJOURS :
- ✅ Le garder dans `.env` (qui est dans `.gitignore`)
- ✅ Le régénérer si tu penses qu'il a été compromis
- ✅ Utiliser des permissions minimales

## 🔄 Régénérer un token

Si tu as perdu ton token ou qu'il a été compromis :

1. Va sur GitHub > Settings > Developer settings > Personal access tokens
2. Trouve ton token "RepoSwipe App"
3. Clique sur **Regenerate token**
4. Copie le nouveau token
5. Mets-le à jour dans `.env`
6. Redémarre le serveur

## 🐛 Problèmes courants

### Le serveur ne voit pas le token
```bash
# Vérifie que le token est bien dans .env
type .env

# Redémarre le serveur
npm run dev
```

### "Bad credentials"
- Le token est invalide ou expiré
- Régénère un nouveau token

### Toujours limité à 60 requêtes
- Le token n'est pas chargé
- Vérifie qu'il n'y a pas d'espace avant/après le token dans `.env`
- Redémarre le serveur

## 📊 Voir ton utilisation

Tu peux voir combien de requêtes il te reste :

**Dans le navigateur** (F12 > Console) :
```javascript
// Après avoir chargé quelques repos
console.log(githubRateLimit);
```

**Ou visite** :
```
http://localhost:3000/api/github/rate-limit
```

## 💡 Astuces

### Token pour plusieurs projets
Tu peux utiliser le même token pour plusieurs projets. Pas besoin d'en créer un nouveau à chaque fois.

### Expiration
Si tu choisis une expiration, GitHub t'enverra un email avant qu'il expire.

### Révoquer un token
Si tu n'utilises plus le projet :
1. GitHub > Settings > Developer settings > Personal access tokens
2. Clique sur le token
3. Clique sur **Delete**

---

## 🎉 C'est tout !

Avec ton token, tu peux maintenant swiper autant que tu veux sans limite ! 🚀
