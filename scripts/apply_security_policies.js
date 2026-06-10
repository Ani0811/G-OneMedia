import pg from 'pg';
import dotenv from 'dotenv';

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
  console.log("Connected to Supabase PostgreSQL database.");

  console.log("Dropping old reviews policies...");
  await client.query('DROP POLICY IF EXISTS "Public can update reviews" ON reviews;');
  await client.query('DROP POLICY IF EXISTS "Public can delete reviews" ON reviews;');
  await client.query('DROP POLICY IF EXISTS "Public can submit reviews" ON reviews;');
  await client.query('DROP POLICY IF EXISTS "Admins can update reviews" ON reviews;');
  await client.query('DROP POLICY IF EXISTS "Admins can delete reviews" ON reviews;');
  await client.query('DROP POLICY IF EXISTS "Admins can insert reviews" ON reviews;');

  console.log("Creating strict Admins-only RLS policies for UPDATE/DELETE, and moderated public INSERT policy...");
  
  await client.query(`
    CREATE POLICY "Public can submit reviews"
      ON reviews FOR INSERT
      TO public
      WITH CHECK (is_approved = false);
  `);

  await client.query(`
    CREATE POLICY "Admins can update reviews"
      ON reviews FOR UPDATE
      TO public
      USING (auth.jwt() ->> 'email' IN ('anirudha.basuthakur@gmail.com', 'vasudevsharma997@gmail.com'))
      WITH CHECK (auth.jwt() ->> 'email' IN ('anirudha.basuthakur@gmail.com', 'vasudevsharma997@gmail.com'));
  `);
  
  await client.query(`
    CREATE POLICY "Admins can delete reviews"
      ON reviews FOR DELETE
      TO public
      USING (auth.jwt() ->> 'email' IN ('anirudha.basuthakur@gmail.com', 'vasudevsharma997@gmail.com'));
  `);

  console.log("Reviews security policies applied successfully.");
  await client.end();
}

main().catch(err => {
  console.error("Error executing RLS policy migration:", err);
  process.exit(1);
});
