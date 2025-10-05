const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { getSupabase } = require('../config/supabase');
const logger = require('../config/logger');

// Inscription
router.post('/register', async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const supabase = getSupabase();
        
        logger.info(`Tentative d'inscription: ${email}`);
        
        // Validation
        if (!email || !password || !username) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
        }
        
        // Vérifier si l'utilisateur existe déjà
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .or(`email.eq.${email},username.eq.${username}`)
            .single();
        
        if (existingUser) {
            logger.warn(`Inscription échouée: Email ou username déjà utilisé - ${email}`);
            return res.status(400).json({ error: 'Email ou nom d\'utilisateur déjà utilisé' });
        }
        
        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Créer l'utilisateur
        const { data: user, error } = await supabase
            .from('users')
            .insert([
                {
                    email,
                    username,
                    password: hashedPassword,
                    created_at: new Date().toISOString(),
                    last_login: new Date().toISOString()
                }
            ])
            .select()
            .single();
        
        if (error) throw error;
        
        // Créer la session
        req.session.userId = user.id;
        req.session.email = user.email;
        req.session.username = user.username;
        
        logger.info(`✅ Inscription réussie: ${email}`);
        
        res.json({ 
            success: true, 
            user: { 
                id: user.id, 
                email: user.email, 
                username: user.username 
            }
        });
    } catch (error) {
        logger.error(`Erreur lors de l'inscription: ${error.message}`);
        res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    }
});

// Connexion
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const supabase = getSupabase();
        
        logger.info(`Tentative de connexion: ${email}`);
        
        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }
        
        // Trouver l'utilisateur
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        
        if (error || !user) {
            logger.warn(`Connexion échouée: Utilisateur non trouvé - ${email}`);
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }
        
        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            logger.warn(`Connexion échouée: Mot de passe incorrect - ${email}`);
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }
        
        // Mettre à jour la dernière connexion
        await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', user.id);
        
        // Créer la session
        req.session.userId = user.id;
        req.session.email = user.email;
        req.session.username = user.username;
        
        logger.info(`✅ Connexion réussie: ${email}`);
        
        res.json({ 
            success: true, 
            user: { 
                id: user.id, 
                email: user.email, 
                username: user.username 
            }
        });
    } catch (error) {
        logger.error(`Erreur lors de la connexion: ${error.message}`);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
});

// Déconnexion
router.post('/logout', (req, res) => {
    const email = req.session.email;
    req.session.destroy((err) => {
        if (err) {
            logger.error(`Erreur lors de la déconnexion: ${err.message}`);
            return res.status(500).json({ error: 'Erreur lors de la déconnexion' });
        }
        logger.info(`Déconnexion: ${email}`);
        res.json({ success: true });
    });
});

// Vérifier la session
router.get('/check', async (req, res) => {
    try {
        if (req.session.userId) {
            const supabase = getSupabase();
            const { data: user } = await supabase
                .from('users')
                .select('id, email, username')
                .eq('id', req.session.userId)
                .single();
            
            if (user) {
                res.json({ 
                    authenticated: true, 
                    user: { 
                        id: user.id, 
                        email: user.email, 
                        username: user.username 
                    }
                });
            } else {
                res.json({ authenticated: false });
            }
        } else {
            res.json({ authenticated: false });
        }
    } catch (error) {
        logger.error(`Erreur lors de la vérification de session: ${error.message}`);
        res.json({ authenticated: false });
    }
});

module.exports = router;
