import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const client = new Client({
    connectionString: process.env.SUPABASE_CONNECTION_URL,
  });

  await client.connect();

  console.log('--- Applying missing RLS policies ---');

  // 1. Create policy for leads table if not exists
  console.log('Creating policy "Anyone can insert leads" on leads table...');
  await client.query(`
    DROP POLICY IF EXISTS "Anyone can insert leads" ON leads;
    CREATE POLICY "Anyone can insert leads"
      ON leads FOR INSERT
      WITH CHECK (true);
  `);

  // 2. Create policy for discovery_calls table if not exists
  console.log('Creating policy "discovery_calls: anon insert" on discovery_calls table...');
  await client.query(`
    DROP POLICY IF EXISTS "discovery_calls: anon insert" ON discovery_calls;
    CREATE POLICY "discovery_calls: anon insert"
      ON discovery_calls FOR INSERT
      WITH CHECK (true);
  `);

  console.log('Policies applied successfully!');
  await client.end();
}

main().catch(console.error);
