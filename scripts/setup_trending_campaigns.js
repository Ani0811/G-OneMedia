import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const { Client } = pg;
const connectionString = process.env.SUPABASE_CONNECTION_URL;

if (!connectionString) {
  console.error("SUPABASE_CONNECTION_URL is missing in .env file.");
  process.exit(1);
}

const client = new Client({ connectionString });

async function main() {
  await client.connect();
  console.log("Connected to Supabase.");

  try {
    const sqlPath = path.join(process.cwd(), 'database', 'core', 'trending_campaigns_setup.sql');
    console.log(`Reading SQL file from ${sqlPath}...`);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log("Executing SQL setup script...");
    await client.query(sql);
    console.log("Successfully setup trending_campaigns and trending_campaign_leads tables and seeded initial data!");
  } catch (err) {
    console.error("Error running SQL setup:", err);
  } finally {
    await client.end();
  }
}

main().catch(err => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
