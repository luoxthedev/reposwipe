require('dotenv').config();
const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const cors = require('cors');
const path = require('path');

const { connectSupabase } = require('./config/supabase');
const { connectRedis } = require('./config/redis');
const logger = require('./config/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à Supabase
connectSupabase();

// Fonction pour initialiser le serveur
const startServer = async () => {
    // Tentative de connexion à Redis
    const redisClient = await connectRedis();
    
    // Middleware
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));
    
    // Middleware de logging
    app.use((req, res, next) => {
        logger.info(`${req.method} ${req.path} - IP: ${req.ip}`);
        next();
    });
    
    // Configuration de session avec Redis si disponible
    const sessionConfig = {
        secret: process.env.SESSION_SECRET || 'dev-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: { 
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24h
        }
    };
    
    if (redisClient) {
        sessionConfig.store = new RedisStore({ client: redisClient });
        logger.info('✅ Sessions configurées avec Redis');
    } else {
        logger.warn('⚠️  Sessions en mémoire (non recommandé en production)');
    }
    
    app.use(session(sessionConfig));
    
    // Rate limiters
    const { swipeLimiter, authLimiter } = require('./middleware/rateLimiter');
    
    // Routes
    app.use('/api/auth', authLimiter, require('./routes/auth'));
    app.use('/api/swipes', swipeLimiter, require('./routes/swipes'));
    app.use('/api/github', require('./routes/github'));
    app.use('/api/leaderboard', require('./routes/leaderboard'));
    
    // Route principale
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/landing.html'));
    });
    
    app.get('/app', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/app.html'));
    });
    
    // Gestion des erreurs 404
    app.use((req, res) => {
        logger.warn(`404 - Route non trouvée: ${req.path}`);
        res.status(404).json({ error: 'Route non trouvée' });
    });
    
    // Gestion des erreurs globales
    app.use((err, req, res, next) => {
        logger.error(`Erreur serveur: ${err.message}`, { stack: err.stack });
        res.status(500).json({ error: 'Erreur serveur interne' });
    });
    
    app.listen(PORT, () => {
        logger.info(`🚀 Serveur démarré sur http://localhost:${PORT}`);
        logger.info(`📝 Environnement: ${process.env.NODE_ENV || 'development'}`);
    });
};

startServer().catch(err => {
    logger.error(`❌ Erreur au démarrage: ${err.message}`);
    process.exit(1);
});
