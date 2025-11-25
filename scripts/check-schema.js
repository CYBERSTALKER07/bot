import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env manually
const envPath = path.resolve(__dirname, '../.env');
let env = {};
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            env[key.trim()] = value.trim();
        }
    });
}

const supabaseUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSchema() {
    console.log('Checking profiles table schema...');
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching profiles:', error);
        return;
    }

    if (data && data.length > 0) {
        console.log('Profiles columns:', Object.keys(data[0]).sort());
    } else {
        console.log('No profiles found. Attempting to inspect via RPC or just assuming columns from error if I try to select them.');
        // Try to select specific columns to see if they error
        const columnsToCheck = ['phone', 'linkedin_url', 'github_url', 'portfolio_url', 'industry', 'company_size', 'company_description'];
        const { error: colError } = await supabase
            .from('profiles')
            .select(columnsToCheck.join(','))
            .limit(1);

        if (colError) {
            console.log('Error selecting specific columns:', colError.message);
        } else {
            console.log('Successfully selected columns:', columnsToCheck);
        }
    }
}

checkSchema();
