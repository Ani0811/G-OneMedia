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

  const { rows: projects } = await client.query("SELECT id, title, type, link, case_study_slug FROM portfolio_projects;");
  console.log("\n--- PORTFOLIO PROJECTS ---");
  console.table(projects);

  const { rows: studies } = await client.query("SELECT id, slug, title FROM case_studies;");
  console.log("\n--- CASE STUDIES ---");
  console.table(studies);

  await client.end();
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
