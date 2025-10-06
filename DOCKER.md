# 🐳 Déploiement Docker - RepoSwipe

## 🚀 Déploiement rapide (Production)

### Prérequis
- Docker et Docker Compose installés
- Compte Supabase configuré
- Token GitHub (optionnel mais recommandé)

### 1. Cloner le projet
```bash
git clone https://github.com/luoxthedev/reposwipe.git
cd reposwipe
```

### 2. Configurer les variables d'environnement
```bash
cp .env.exemple .env
```

Édite `.env` avec tes vraies valeurs :
```env
PORT=3000
SESSION_SECRET=ton_secret_super_securise_ici
NODE_ENV=production

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=ta_cle_service_role
SUPABASE_ANON_KEY=ta_cle_anon

# GitHub API
GITHUB_TOKEN=ghp_ton_token_ici

# Redis (laisser comme ça pour Docker)
REDIS_HOST=redis
REDIS_PORT=6379
```

### 3. Lancer l'application
```bash
docker-compose up -d
```

### 4. Vérifier que tout fonctionne
```bash
# Voir les logs
docker-compose logs -f

# Vérifier les conteneurs
docker-compose ps
```

Tu devrais voir :
```
reposwipe-app    Up      0.0.0.0:3000->3000/tcp
reposwipe-redis  Up      0.0.0.0:6379->6379/tcp
```

### 5. Accéder à l'application
Ouvre ton navigateur sur : **http://localhost:3000**

---

## 🛠️ Commandes utiles

### Démarrer
```bash
docker-compose up -d
```

### Arrêter
```bash
docker-compose down
```

### Redémarrer
```bash
docker-compose restart
```

### Voir les logs
```bash
# Tous les logs
docker-compose logs -f

# Logs de l'app uniquement
docker-compose logs -f app

# Logs de Redis uniquement
docker-compose logs -f redis
```

### Reconstruire après modification du code
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Nettoyer complètement
```bash
# Arrêter et supprimer tout
docker-compose down -v

# Supprimer les images
docker rmi reposwipe-app
```

---

## 📦 Déploiement sur un serveur

### Option 1 : VPS (DigitalOcean, AWS, etc.)

1. **Connecte-toi à ton serveur** :
```bash
ssh user@ton-serveur.com
```

2. **Installe Docker** :
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

3. **Clone et configure** :
```bash
git clone https://github.com/luoxthedev/reposwipe.git
cd reposwipe
cp .env.exemple .env
nano .env  # Édite avec tes valeurs
```

4. **Lance l'application** :
```bash
docker-compose up -d
```

5. **Configure le pare-feu** :
```bash
sudo ufw allow 3000/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### Option 2 : Avec Nginx (Reverse Proxy)

1. **Installe Nginx** :
```bash
sudo apt install nginx
```

2. **Configure Nginx** :
```bash
sudo nano /etc/nginx/sites-available/reposwipe
```

Contenu :
```nginx
server {
    listen 80;
    server_name ton-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. **Active la configuration** :
```bash
sudo ln -s /etc/nginx/sites-available/reposwipe /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

4. **SSL avec Let's Encrypt** :
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d ton-domaine.com
```

---

## 🔧 Configuration avancée

### Changer le port
Dans `.env` :
```env
PORT=8080
```

Dans `docker-compose.yml` :
```yaml
ports:
  - "8080:8080"
```

### Limiter les ressources
Dans `docker-compose.yml`, ajoute sous `app:` :
```yaml
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 512M
    reservations:
      cpus: '0.5'
      memory: 256M
```

### Logs persistants
Les logs sont déjà montés dans `./logs` sur l'hôte.

### Backup Redis
```bash
# Sauvegarder
docker exec reposwipe-redis redis-cli SAVE
docker cp reposwipe-redis:/data/dump.rdb ./backup-redis.rdb

# Restaurer
docker cp ./backup-redis.rdb reposwipe-redis:/data/dump.rdb
docker-compose restart redis
```

---

## 🐛 Troubleshooting

### L'app ne démarre pas
```bash
# Voir les logs détaillés
docker-compose logs app

# Vérifier les variables d'environnement
docker-compose exec app env | grep SUPABASE
```

### Redis ne se connecte pas
```bash
# Tester Redis
docker-compose exec redis redis-cli ping
# Devrait retourner "PONG"
```

### Port déjà utilisé
```bash
# Trouver ce qui utilise le port 3000
sudo lsof -i :3000

# Ou change le port dans .env
```

### Reconstruire complètement
```bash
docker-compose down -v
docker system prune -a
docker-compose build --no-cache
docker-compose up -d
```

---

## 📊 Monitoring

### Voir l'utilisation des ressources
```bash
docker stats
```

### Voir les processus
```bash
docker-compose top
```

### Inspecter un conteneur
```bash
docker inspect reposwipe-app
```

---

## 🔒 Sécurité

### Bonnes pratiques

1. **Ne jamais commit .env** (déjà dans .gitignore)
2. **Utiliser des secrets forts** pour SESSION_SECRET
3. **Mettre à jour régulièrement** :
```bash
docker-compose pull
docker-compose up -d
```

4. **Limiter l'accès Redis** :
Dans `docker-compose.yml`, retire l'exposition du port Redis si pas nécessaire :
```yaml
# Retire cette ligne si tu n'as pas besoin d'accéder à Redis depuis l'extérieur
# ports:
#   - "6379:6379"
```

5. **Utiliser HTTPS** en production (voir section Nginx)

---

## 🎉 C'est tout !

Ton application RepoSwipe tourne maintenant dans Docker !

Pour toute question, ouvre une issue sur GitHub.
