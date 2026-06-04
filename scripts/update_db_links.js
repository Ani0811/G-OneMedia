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
  console.log("Connected to Supabase.");

  console.log("Updating FoodieFrenzy SaaS link...");
  await client.query("UPDATE portfolio_projects SET link = 'https://foodie-frenzy-frontend-hpkf.onrender.com' WHERE case_study_slug = 'foodiefrenzy-saas';");

  console.log("Updating ABT Developer Portfolio link...");
  await client.query("UPDATE portfolio_projects SET link = 'https://anirudha-basu-thakur-portfolio.vercel.app' WHERE case_study_slug = 'abt-developer-portfolio';");

  console.log("Database update completed successfully.");
  await client.end();
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
