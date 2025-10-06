# Dockerfile pour RepoSwipe
FROM node:18-alpine

# Créer le répertoire de l'application
WORKDIR /app

# Copier les fichiers package
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY . .

# Créer le dossier logs
RUN mkdir -p logs

# Exposer le port
EXPOSE 3000

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=3000

# Démarrer l'application
CMD ["node", "server/server.js"]
