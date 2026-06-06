import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const client = new Client({
    connectionString: process.env.SUPABASE_CONNECTION_URL,
  });

  await client.connect();

  console.log('--- Inspecting Tables ---');
  const tablesRes = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public';
  `);
  console.log('Tables:', tablesRes.rows.map(r => r.table_name));

  console.log('\n--- Inspecting RLS Status ---');
  const rlsRes = await client.query(`
    SELECT tablename, rowsecurity 
    FROM pg_tables 
    WHERE schemaname = 'public';
  `);
  console.log('RLS Status:', rlsRes.rows);

  console.log('\n--- Inspecting Policies ---');
  const policiesRes = await client.query(`
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
    FROM pg_policies;
  `);
  console.log('Policies:');
  policiesRes.rows.forEach(row => {
    console.log(`- Table: ${row.tablename}, Policy: ${row.policyname}, Cmd: ${row.cmd}, Roles: ${row.roles}`);
  });

  await client.end();
}

main().catch(console.error);
