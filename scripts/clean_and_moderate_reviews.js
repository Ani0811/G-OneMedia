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

  // 1. Alter default value of is_approved to FALSE
  console.log("Setting default of reviews.is_approved to FALSE...");
  await client.query("ALTER TABLE reviews ALTER COLUMN is_approved SET DEFAULT false;");
  console.log("Default altered successfully.");

  // 2. Update reviews SELECT RLS policy
  console.log("Updating reviews SELECT RLS policy...");
  await client.query(`DROP POLICY IF EXISTS "Public read approved reviews" ON reviews;`);
  await client.query(`
    CREATE POLICY "Public read approved reviews"
      ON reviews FOR SELECT
      TO public
      USING (is_approved = true);
  `);
  console.log("Policy updated to check (is_approved = true).");

  // 3. Fetch and log all reviews before cleanup
  const { rows } = await client.query("SELECT * FROM reviews;");
  console.log("Current Reviews in database:", rows.map(r => ({ id: r.id, name: r.name, rating: r.rating, approved: r.is_approved })));

  // 4. Remove reviews that might be placeholder reviews
  const placeholdersToDelete = ['Test User', 'John Doe', 'Jane Doe', 'placeholder', 'test'];
  for (const name of placeholdersToDelete) {
    const res = await client.query("DELETE FROM reviews WHERE name ILIKE $1 OR review ILIKE $1 RETURNING *;", [`%${name}%`]);
    if (res.rowCount > 0) {
      console.log(`Deleted placeholder reviews for query "${name}":`, res.rows.map(r => ({ id: r.id, name: r.name })));
    }
  }

  await client.end();
  console.log("Database clean up and migration completed successfully.");
}

main().catch(err => {
  console.error("Error executing clean up:", err);
  process.exit(1);
});
