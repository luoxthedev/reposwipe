require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24h
    }
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/swipes', require('./routes/swipes'));

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/landing.html'));
});

app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/app.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
