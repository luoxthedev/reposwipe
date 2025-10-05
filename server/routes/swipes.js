const express = require('express');
const router = express.Router();
const { getSupabase } = require('../config/supabase');
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
        const supabase = getSupabase();
        
        // Vérifier si le swipe existe déjà
        const { data: existingSwipe } = await supabase
            .from('swipes')
            .select('*')
            .eq('user_id', userId)
            .eq('repo_id', repoId)
            .single();
        
        if (existingSwipe) {
            // Mettre à jour le swipe existant
            await supabase
                .from('swipes')
                .update({
                    action,
                    repo_data: repoData,
                    timestamp: new Date().toISOString()
                })
                .eq('id', existingSwipe.id);
            
            logger.info(`Swipe mis à jour: ${action} - Repo ${repoId} - User ${userId}`);
        } else {
            // Créer un nouveau swipe
            await supabase
                .from('swipes')
                .insert([{
                    user_id: userId,
                    repo_id: repoId,
                    action,
                    repo_data: repoData
                }]);
            
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
        const supabase = getSupabase();
        
        const { data: swipes, error } = await supabase
            .from('swipes')
            .select('*')
            .eq('user_id', userId)
            .order('timestamp', { ascending: false });
        
        if (error) throw error;
        
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
        const supabase = getSupabase();
        
        const { data: favorites, error } = await supabase
            .from('swipes')
            .select('*')
            .eq('user_id', userId)
            .in('action', ['like', 'super'])
            .order('timestamp', { ascending: false });
        
        if (error) throw error;
        
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
        const supabase = getSupabase();
        
        await supabase
            .from('swipes')
            .delete()
            .eq('user_id', userId)
            .eq('repo_id', repoId);
        
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
        const supabase = getSupabase();
        
        const { data: swipes, error } = await supabase
            .from('swipes')
            .select('action')
            .eq('user_id', userId);
        
        if (error) throw error;
        
        const formattedStats = {
            total: swipes.length,
            likes: swipes.filter(s => s.action === 'like').length,
            rejects: swipes.filter(s => s.action === 'reject').length,
            supers: swipes.filter(s => s.action === 'super').length
        };
        
        logger.info(`Statistiques récupérées pour l'utilisateur ${userId}`);
        res.json({ stats: formattedStats });
    } catch (error) {
        logger.error(`Erreur lors de la récupération des stats: ${error.message}`);
        res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
});

module.exports = router;
