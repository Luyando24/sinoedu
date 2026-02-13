import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function main() {
    try {
        await client.connect();
        console.log('Connected to database successfully!');

        const sqlFilePath = path.join(process.cwd(), 'src/lib/migrations/add_home_contact_blocks.sql');
        const sql = fs.readFileSync(sqlFilePath, 'utf8');

        console.log(`Executing SQL from: ${sqlFilePath}`);
        await client.query(sql);
        console.log('SQL executed successfully!');

    } catch (err: any) {
        console.error('Error executing SQL:', err.message);
    } finally {
        await client.end().catch(() => { });
    }
}

main();
