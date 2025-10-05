const { createClient } = require('@supabase/supabase-js');
const logger = require('./logger');

let supabase = null;

const connectSupabase = () => {
    try {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Variables SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requises');
        }

        supabase = createClient(supabaseUrl, supabaseKey);
        logger.info('✅ Supabase connecté');
        
        return supabase;
    } catch (error) {
        logger.error(`❌ Erreur Supabase: ${error.message}`);
        process.exit(1);
    }
};

const getSupabase = () => {
    if (!supabase) {
        throw new Error('Supabase non initialisé');
    }
    return supabase;
};

module.exports = { connectSupabase, getSupabase };
