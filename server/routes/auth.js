const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Base de données en mémoire (à remplacer par une vraie DB)
const users = new Map();

// Inscription
router.post('/register', async (req, res) => {
    const { email, password, username } = req.body;
    
    if (users.has(email)) {
        return res.status(400).json({ error: 'Email déjà utilisé' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
        id: Date.now().toString(),
        email,
        username,
        password: hashedPassword,
        swipes: [],
        favorites: []
    };
    
    users.set(email, user);
    req.session.userId = user.id;
    req.session.email = user.email;
    
    res.json({ 
        success: true, 
        user: { id: user.id, email: user.email, username: user.username }
    });
});

// Connexion
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    const user = users.get(email);
    if (!user) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    
    req.session.userId = user.id;
    req.session.email = user.email;
    
    res.json({ 
        success: true, 
        user: { id: user.id, email: user.email, username: user.username }
    });
});

// Déconnexion
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Vérifier la session
router.get('/check', (req, res) => {
    if (req.session.userId) {
        const user = Array.from(users.values()).find(u => u.id === req.session.userId);
        res.json({ 
            authenticated: true, 
            user: { id: user.id, email: user.email, username: user.username }
        });
    } else {
        res.json({ authenticated: false });
    }
});

module.exports = router;
