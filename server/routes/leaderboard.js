const express = require('express');
const router = express.Router();
const { getSupabase } = require('../config/supabase');
const logger = require('../config/logger');

// Obtenir le leaderboard global
router.get('/', async (req, res) => {
    try {
        const supabase = getSupabase();
        
        // Récupérer tous les utilisateurs
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('id, username, email, created_at');
        
        if (usersError) throw usersError;
        
        // Pour chaque utilisateur, calculer ses stats
        const leaderboard = await Promise.all(users.map(async (user) => {
            const { data: swipes, error: swipesError } = await supabase
                .from('swipes')
                .select('action')
                .eq('user_id', user.id);
            
            if (swipesError) {
                logger.error(`Erreur stats pour ${user.username}: ${swipesError.message}`);
                return null;
            }
            
            const total = swipes.length;
            const likes = swipes.filter(s => s.action === 'like').length;
            const supers = swipes.filter(s => s.action === 'super').length;
            const rejects = swipes.filter(s => s.action === 'reject').length;
            const likeRate = total > 0 ? Math.round(((likes + supers) / total) * 100) : 0;
            
            return {
                username: user.username,
                email: user.email.substring(0, 3) + '***', // Masquer l'email
                joinedAt: user.created_at,
                stats: {
                    total,
                    likes,
                    supers,
                    rejects,
                    likeRate
                },
                score: (likes * 1) + (supers * 3) + (total * 0.1) // Score calculé
            };
        }));
        
        // Filtrer les nulls et trier par score
        const sortedLeaderboard = leaderboard
            .filter(entry => entry !== null)
            .sort((a, b) => b.score - a.score)
            .map((entry, index) => ({
                rank: index + 1,
                ...entry
            }));
        
        logger.info(`Leaderboard récupéré: ${sortedLeaderboard.length} utilisateurs`);
        
        res.json({
            leaderboard: sortedLeaderboard,
            totalUsers: sortedLeaderboard.length,
            updatedAt: new Date().toISOString()
        });
        
    } catch (error) {
        logger.error(`Erreur leaderboard: ${error.message}`);
        res.status(500).json({ error: 'Erreur lors de la récupération du leaderboard' });
    }
});

// Obtenir le rang d'un utilisateur spécifique
router.get('/my-rank', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Non authentifié' });
        }
        
        const supabase = getSupabase();
        
        // Récupérer l'utilisateur
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('username')
            .eq('id', req.session.userId)
            .single();
        
        if (userError) throw userError;
        
        // Récupérer ses stats
        const { data: swipes, error: swipesError } = await supabase
            .from('swipes')
            .select('action')
            .eq('user_id', req.session.userId);
        
        if (swipesError) throw swipesError;
        
        const total = swipes.length;
        const likes = swipes.filter(s => s.action === 'like').length;
        const supers = swipes.filter(s => s.action === 'super').length;
        const score = (likes * 1) + (supers * 3) + (total * 0.1);
        
        // Compter combien d'utilisateurs ont un meilleur score
        const { data: allUsers, error: allUsersError } = await supabase
            .from('users')
            .select('id');
        
        if (allUsersError) throw allUsersError;
        
        let betterScores = 0;
        for (const otherUser of allUsers) {
            if (otherUser.id === req.session.userId) continue;
            
            const { data: otherSwipes } = await supabase
                .from('swipes')
                .select('action')
                .eq('user_id', otherUser.id);
            
            if (otherSwipes) {
                const otherTotal = otherSwipes.length;
                const otherLikes = otherSwipes.filter(s => s.action === 'like').length;
                const otherSupers = otherSwipes.filter(s => s.action === 'super').length;
                const otherScore = (otherLikes * 1) + (otherSupers * 3) + (otherTotal * 0.1);
                
                if (otherScore > score) {
                    betterScores++;
                }
            }
        }
        
        const rank = betterScores + 1;
        
        res.json({
            rank,
            username: user.username,
            score: Math.round(score),
            totalUsers: allUsers.length
        });
        
    } catch (error) {
        logger.error(`Erreur my-rank: ${error.message}`);
        res.status(500).json({ error: 'Erreur lors de la récupération du rang' });
    }
});

module.exports = router;
