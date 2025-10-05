const express = require('express');
const router = express.Router();
const logger = require('../config/logger');

// Middleware pour vérifier l'authentification
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Non authentifié' });
    }
    next();
};

// Proxy pour l'API GitHub avec authentification
router.get('/search/repositories', requireAuth, async (req, res) => {
    try {
        const { q, sort, order, per_page, page } = req.query;
        
        // Construire l'URL de l'API GitHub
        const params = new URLSearchParams({
            q: q || 'stars:>100',
            sort: sort || 'stars',
            order: order || 'desc',
            per_page: per_page || '30',
            page: page || '1'
        });
        
        const url = `https://api.github.com/search/repositories?${params}`;
        
        // Headers avec authentification si disponible
        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'RepoSwipe-App'
        };
        
        // Ajouter le token GitHub si disponible
        if (process.env.GITHUB_TOKEN) {
            headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
        }
        
        const response = await fetch(url, { headers });
        
        // Vérifier le rate limit (celui de la recherche, pas le global)
        const searchRemaining = response.headers.get('x-ratelimit-remaining');
        const searchLimit = response.headers.get('x-ratelimit-limit');
        const reset = response.headers.get('x-ratelimit-reset');
        
        // Note: Le rate limit de recherche est de 30/min, pas 5000/h
        // Le rate limit global (5000/h) est différent
        
        if (!response.ok) {
            if (response.status === 403) {
                const resetDate = new Date(reset * 1000);
                logger.warn(`Rate limit GitHub search atteint. Reset à ${resetDate.toLocaleTimeString()}`);
                return res.status(429).json({ 
                    error: 'Limite API GitHub atteinte',
                    resetAt: resetDate.toISOString(),
                    remaining: 0,
                    limit: parseInt(searchLimit)
                });
            }
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Ajouter les infos de rate limit dans la réponse
        res.json({
            ...data,
            rateLimit: {
                searchRemaining: parseInt(searchRemaining),
                searchLimit: parseInt(searchLimit),
                reset: new Date(reset * 1000).toISOString()
            }
        });
        
    } catch (error) {
        logger.error(`Erreur proxy GitHub: ${error.message}`);
        res.status(500).json({ error: 'Erreur lors de la récupération des repos' });
    }
});

// Endpoint pour vérifier le rate limit
router.get('/rate-limit', requireAuth, async (req, res) => {
    try {
        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'RepoSwipe-App'
        };
        
        if (process.env.GITHUB_TOKEN) {
            headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
        }
        
        const response = await fetch('https://api.github.com/rate_limit', { headers });
        const data = await response.json();
        
        logger.info(`Rate limit check: ${data.rate.remaining}/${data.rate.limit}`);
        
        res.json({
            core: {
                limit: data.rate.limit,
                remaining: data.rate.remaining,
                reset: new Date(data.rate.reset * 1000).toISOString(),
                used: data.rate.used
            },
            authenticated: !!process.env.GITHUB_TOKEN
        });
        
    } catch (error) {
        logger.error(`Erreur vérification rate limit: ${error.message}`);
        res.status(500).json({ error: 'Erreur lors de la vérification' });
    }
});

module.exports = router;
