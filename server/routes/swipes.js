const express = require('express');
const router = express.Router();
const Swipe = require('../models/Swipe');
const logger = require('../config/logger');

// Middleware pour vérifier l'authentification
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        logger.warn('Tentative d\'accès non authentifié aux swipes');
        return res.status(401).json({ error: 'Non authentifié' });
    }
    next();
};

// Sauvegarder un swipe
router.post('/', requireAuth, async (req, res) => {
    try {
        const { repoId, action, repoData } = req.body;
        const userId = req.session.userId;
        
        // Vérifier si le swipe existe déjà
        const existingSwipe = await Swipe.findOne({ userId, repoId });
        
        if (existingSwipe) {
            // Mettre à jour le swipe existant
            existingSwipe.action = action;
            existingSwipe.repoData = repoData;
            existingSwipe.timestamp = new Date();
            await existingSwipe.save();
            
            logger.info(`Swipe mis à jour: ${action} - Repo ${repoId} - User ${userId}`);
        } else {
            // Créer un nouveau swipe
            const swipe = new Swipe({
                userId,
                repoId,
                action,
                repoData
            });
            
            await swipe.save();
            logger.info(`Nouveau swipe: ${action} - Repo ${repoId} - User ${userId}`);
        }
        
        res.json({ success: true });
    } catch (error) {
        logger.error(`Erreur lors de la sauvegarde du swipe: ${error.message}`);
        res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
    }
});

// Récupérer les swipes d'un utilisateur
router.get('/', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;
        const swipes = await Swipe.find({ userId }).sort({ timestamp: -1 });
        
        logger.info(`Récupération de ${swipes.length} swipes pour l'utilisateur ${userId}`);
        res.json({ swipes });
    } catch (error) {
        logger.error(`Erreur lors de la récupération des swipes: ${error.message}`);
        res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
});

// Récupérer les favoris
router.get('/favorites', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;
        const favorites = await Swipe.find({ 
            userId, 
            action: { $in: ['like', 'super'] }
        }).sort({ timestamp: -1 });
        
        logger.info(`Récupération de ${favorites.length} favoris pour l'utilisateur ${userId}`);
        res.json({ favorites });
    } catch (error) {
        logger.error(`Erreur lors de la récupération des favoris: ${error.message}`);
        res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
});

// Supprimer un swipe
router.delete('/:repoId', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;
        const { repoId } = req.params;
        
        await Swipe.deleteOne({ userId, repoId });
        
        logger.info(`Swipe supprimé: Repo ${repoId} - User ${userId}`);
        res.json({ success: true });
    } catch (error) {
        logger.error(`Erreur lors de la suppression du swipe: ${error.message}`);
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
});

// Statistiques utilisateur
router.get('/stats', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;
        
        const stats = await Swipe.aggregate([
            { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
            { 
                $group: {
                    _id: '$action',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const formattedStats = {
            total: 0,
            likes: 0,
            rejects: 0,
            supers: 0
        };
        
        stats.forEach(stat => {
            formattedStats.total += stat.count;
            if (stat._id === 'like') formattedStats.likes = stat.count;
            if (stat._id === 'reject') formattedStats.rejects = stat.count;
            if (stat._id === 'super') formattedStats.supers = stat.count;
        });
        
        logger.info(`Statistiques récupérées pour l'utilisateur ${userId}`);
        res.json({ stats: formattedStats });
    } catch (error) {
        logger.error(`Erreur lors de la récupération des stats: ${error.message}`);
        res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
});

module.exports = router;
