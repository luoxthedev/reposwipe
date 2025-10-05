require('dotenv').config();
const readline = require('readline');
const { createClient } = require('@supabase/supabase-js');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function clearDatabase() {
    console.log('\n⚠️  ATTENTION : Cette action va supprimer TOUS les swipes de TOUS les utilisateurs !');
    console.log('Les comptes utilisateurs seront conservés.\n');
    
    rl.question('Êtes-vous sûr de vouloir continuer ? (tapez "OUI" pour confirmer) : ', async (answer) => {
        if (answer.toUpperCase() === 'OUI') {
            try {
                console.log('\n🗑️  Suppression des swipes en cours...');
                
                const { error, count } = await supabase
                    .from('swipes')
                    .delete()
                    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
                
                if (error) throw error;
                
                console.log(`✅ ${count || 'Tous les'} swipes ont été supprimés avec succès !`);
            } catch (error) {
                console.error('❌ Erreur lors de la suppression :', error.message);
            }
        } else {
            console.log('\n❌ Opération annulée.');
        }
        
        rl.close();
        process.exit(0);
    });
}

clearDatabase();
