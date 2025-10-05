const express = require('express');
const router = express.Router();

// Middleware pour vérifier l'authentification
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Non authentifié' });
    }
    next();
};

// Base de données en mémoire
const swipes = new Map();

// Sauvegarder un swipe
router.post('/', requireAuth, (req, res) => {
    const { repoId, action, repoData } = req.body;
    const userId = req.session.userId;
    
    if (!swipes.has(userId)) {
        swipes.set(userId, []);
    }
    
    const userSwipes = swipes.get(userId);
    userSwipes.push({
        repoId,
        action,
        repoData,
        timestamp: Date.now()
    });
    
    res.json({ success: true });
});

// Récupérer les swipes d'un utilisateur
router.get('/', requireAuth, (req, res) => {
    const userId = req.session.userId;
    const userSwipes = swipes.get(userId) || [];
    res.json({ swipes: userSwipes });
});

// Récupérer les favoris
router.get('/favorites', requireAuth, (req, res) => {
    const userId = req.session.userId;
    const userSwipes = swipes.get(userId) || [];
    const favorites = userSwipes.filter(s => s.action === 'like' || s.action === 'super');
    res.json({ favorites });
});

module.exports = router;
