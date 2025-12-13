import { Client } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function main() {
    try {
        const dbUrl = process.env.DATABASE_URL || '';
        // Mask password
        const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');
        console.log(`Attempting to connect to: ${maskedUrl}`);

        try {
            const url = new URL(dbUrl);
            console.log(`Host: ${url.hostname}`);
        } catch (e) {
            console.log('Could not parse URL');
        }

        await client.connect();
        console.log('Connected to database successfully!');

        // Run a simple query
        const res = await client.query('SELECT NOW() as now');
        console.log('Current time from DB:', res.rows[0].now);

        // If command line arguments are provided, treat them as SQL
        const sql = process.argv[2];
        if (sql) {
            console.log(`Executing SQL: ${sql}`);
            const result = await client.query(sql);
            console.table(result.rows);
        }

    } catch (err: any) {
        console.error('Error connecting to original URL:', err.message);

        // Try fallback to db.[ref].supabase.co
        try {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            if (supabaseUrl) {
                const ref = new URL(supabaseUrl).hostname.split('.')[0];
                const fallbackHost = `db.${ref}.supabase.co`;
                console.log(`\nAttempting fallback to host: ${fallbackHost}`);

                const originalUrlObj = new URL(process.env.DATABASE_URL || '');
                originalUrlObj.hostname = fallbackHost;
                // standard port for direct connection
                originalUrlObj.port = '5432';

                const fallbackClient = new Client({
                    connectionString: originalUrlObj.toString(),
                });

                await fallbackClient.connect();
                console.log('SUCCESS: Connected to database using fallback host!');
                const res = await fallbackClient.query('SELECT NOW() as now');
                console.log('Current time from DB:', res.rows[0].now);
                await fallbackClient.end();

                console.log(`\nSUGGESTION: Update your DATABASE_URL hostname to '${fallbackHost}'`);
            }
        } catch (fallbackErr) {
            console.error('Fallback verify failed:', fallbackErr);
        }

    } finally {
        await client.end().catch(() => { });
    }
}

main();
