import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const client = new Client({
    connectionString: process.env.SUPABASE_CONNECTION_URL,
  });

  await client.connect();

  console.log('--- Querying Latest Leads ---');
  const leadsRes = await client.query(`
    SELECT id, name, email, service, budget, description, created_at 
    FROM leads 
    ORDER BY created_at DESC 
    LIMIT 1;
  `);
  console.log(leadsRes.rows);

  console.log('\n--- Querying Latest Discovery Calls ---');
  const discoveryRes = await client.query(`
    SELECT id, name, email, company, website, service, budget, details, referral, created_at 
    FROM discovery_calls 
    ORDER BY created_at DESC 
    LIMIT 1;
  `);
  console.log(discoveryRes.rows);

  await client.end();
}

main().catch(console.error);
