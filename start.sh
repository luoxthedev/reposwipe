#!/bin/bash

echo "========================================"
echo "   RepoSwipe - Démarrage automatique"
echo "========================================"
echo ""

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "[ERREUR] Node.js n'est pas installé !"
    echo "Installe-le avec : sudo apt install nodejs npm"
    exit 1
fi

echo "[OK] Node.js détecté"
node --version
echo ""

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo "[INFO] Installation des dépendances..."
    npm install
    if [ $? -ne 0 ]; then
        echo "[ERREUR] Échec de l'installation"
        exit 1
    fi
    echo "[OK] Dépendances installées"
    echo ""
fi

# Vérifier si .env existe
if [ ! -f ".env" ]; then
    echo "[INFO] Création du fichier .env..."
    cp .env.exemple .env
    echo "[ATTENTION] Configure ton fichier .env avec tes clés Supabase et GitHub !"
    echo "Édite le fichier : nano .env"
    read -p "Appuie sur Entrée pour continuer..."
    echo ""
fi

# Vérifier Docker
echo "[INFO] Vérification de Docker..."
if command -v docker &> /dev/null; then
    echo "[OK] Docker détecté"
    echo "[INFO] Démarrage de Redis avec Docker..."
    docker-compose up -d redis
    if [ $? -eq 0 ]; then
        echo "[OK] Redis démarré avec Docker"
    else
        echo "[ATTENTION] Docker est installé mais ne fonctionne pas"
        echo "Redis sera désactivé (sessions en mémoire)"
    fi
else
    echo "[INFO] Docker non détecté - Redis désactivé"
    echo "L'application fonctionnera avec des sessions en mémoire"
    echo "Pour installer Docker : https://docs.docker.com/engine/install/"
fi
echo ""

echo "========================================"
echo "   Démarrage de RepoSwipe..."
echo "========================================"
echo ""
echo "Application disponible sur : http://localhost:3000"
echo "Appuie sur Ctrl+C pour arrêter"
echo ""

# Démarrer le serveur
npm start
