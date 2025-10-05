const rateLimit = require('express-rate-limit');
const logger = require('../config/logger');

// Rate limiter pour les swipes (7 requêtes par seconde max)
const swipeLimiter = rateLimit({
    windowMs: 1000, // 1 seconde
    max: 7, // 7 requêtes max
    message: {
        error: 'Trop de requêtes ! Attends 10 secondes avant de continuer.',
        retryAfter: 10
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`Rate limit dépassé pour l'utilisateur ${req.session?.userId || 'inconnu'}`);
        res.status(429).json({
            error: 'Trop de requêtes ! Attends 10 secondes avant de continuer.',
            retryAfter: 10
        });
    },
    skip: (req) => {
        // Ne pas limiter en développement si besoin
        return process.env.NODE_ENV === 'development' && process.env.DISABLE_RATE_LIMIT === 'true';
    }
});

// Rate limiter pour l'authentification (5 tentatives par minute)
const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5,
    message: {
        error: 'Trop de tentatives de connexion. Réessaye dans 1 minute.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`Rate limit auth dépassé pour IP ${req.ip}`);
        res.status(429).json({
            error: 'Trop de tentatives de connexion. Réessaye dans 1 minute.'
        });
    }
});

module.exports = { swipeLimiter, authLimiter };
