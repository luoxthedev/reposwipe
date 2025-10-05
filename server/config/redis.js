const redis = require('redis');
const logger = require('./logger');

let redisClient;

const connectRedis = async () => {
    try {
        redisClient = redis.createClient({
            socket: {
                host: process.env.REDIS_HOST || 'localhost',
                port: process.env.REDIS_PORT || 6379
            },
            password: process.env.REDIS_PASSWORD || undefined
        });

        redisClient.on('error', (err) => {
            logger.error(`❌ Erreur Redis: ${err.message}`);
        });

        redisClient.on('connect', () => {
            logger.info('✅ Redis connecté');
        });

        await redisClient.connect();
        return redisClient;
    } catch (error) {
        logger.error(`❌ Impossible de se connecter à Redis: ${error.message}`);
        logger.warn('⚠️  L\'application continuera sans Redis (sessions en mémoire)');
        return null;
    }
};

module.exports = { connectRedis, getRedisClient: () => redisClient };
