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

  // Check if it already exists
  const { rows: existing } = await client.query(
    "SELECT id FROM portfolio_projects WHERE case_study_slug = 'cinematic-showcase-2';"
  );

  if (existing.length > 0) {
    console.log("Record already exists in portfolio_projects. Skipping insert.");
  } else {
    console.log("Inserting project into portfolio_projects...");
    await client.query(`
      INSERT INTO portfolio_projects (title, type, category, description, image, link, case_study_slug, sort_order)
      VALUES (
        'Cinematic Showcase II',
        'Reels',
        'IG Reels • Showcase',
        'A premium cinematic short-form highlight reel showcasing advanced video editing and post-production techniques.',
        '/Portfolio_Videos/Portfolio2.jpeg',
        'https://drive.google.com/file/d/1z_KV3aRscN8YgKBaziwKGFWtOSGtcpD4/view',
        'cinematic-showcase-2',
        26
      );
    `);
    console.log("Project inserted successfully.");
  }

  const { rows: existingStudy } = await client.query(
    "SELECT id FROM case_studies WHERE slug = 'cinematic-showcase-2';"
  );

  if (existingStudy.length > 0) {
    console.log("Record already exists in case_studies. Skipping insert.");
  } else {
    console.log("Inserting study into case_studies...");
    await client.query(`
      INSERT INTO case_studies (slug, title, category, hero_image, description, challenge, solution, tech_stack, metrics)
      VALUES (
        'cinematic-showcase-2',
        'Cinematic Showcase II',
        'IG Reels • Showcase',
        '/Portfolio_Videos/Portfolio2.jpeg',
        'A high-impact cinematic showcase highlighting premium editing techniques, color grading, and dynamic sound design.',
        'Capturing the viewer''s interest within the first seconds and retaining engagement through fast pacing and creative transitions.',
        'We developed a high-tempo sequence utilizing speed ramping, match cuts, custom typography overlays, and immersive sound effects.',
        ARRAY['Premiere Pro', 'After Effects', 'DaVinci Resolve'],
        '[
          {"label": "Views", "value": "2.0M+"},
          {"label": "Engagement", "value": "+75%"},
          {"label": "Audience Retention", "value": "85%"}
        ]'::jsonb
      );
    `);
    console.log("Study inserted successfully.");
  }

  await client.end();
  console.log("Database connection closed.");
}

main().catch(err => {
  console.error("Error executing inserts:", err);
  process.exit(1);
});
