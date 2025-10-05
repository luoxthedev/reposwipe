const winston = require('winston');
const path = require('path');

// Créer le dossier logs s'il n'existe pas
const fs = require('fs');
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: 'reposwipe' },
    transports: [
        // Fichier pour les erreurs
        new winston.transports.File({ 
            filename: path.join(logsDir, 'error.log'), 
            level: 'error' 
        }),
        // Fichier pour tous les logs
        new winston.transports.File({ 
            filename: path.join(logsDir, 'combined.log') 
        })
    ]
});

// En développement, afficher aussi dans la console
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
            winston.format.printf(({ level, message, timestamp }) => {
                return `${timestamp} ${level}: ${message}`;
            })
        )
    }));
}

module.exports = logger;
