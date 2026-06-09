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
  console.log("Database connection established.");

  // Configuration for the new trending topic!
  // Edit these values every month before running the script
  const newTrend = {
    event_month: 'August 2026', // Change the month here
    event_name: 'Summer Olympic Games', // The trend topic
    headline: 'Olympic-Level Conversion: Winning Gold in E-commerce',
    description: 'The global stage is set. While the world watches the Olympics, smart brands are tying their product narratives to themes of endurance, victory, and global unity. Here is exactly how to do it.',
    bullets: [
      'Create "Podium" tiers for your pricing/packages',
      'Launch an endurance-based 14-day challenge for your audience',
      'Use fast-paced, high-energy creative formats modeled after sports highlights'
    ],
    image_url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=800&auto=format&fit=crop'
  };

  try {
    console.log("Deactivating old trends...");
    await client.query(`UPDATE public.trending_campaigns SET is_active = false;`);

    console.log(`Inserting new trend: ${newTrend.event_name}`);
    await client.query(
      `
      INSERT INTO public.trending_campaigns 
        (event_month, event_name, headline, description, bullets, image_url, is_active)
      VALUES 
        ($1, $2, $3, $4, $5, $6, true)
      `,
      [
        newTrend.event_month,
        newTrend.event_name,
        newTrend.headline,
        newTrend.description,
        JSON.stringify(newTrend.bullets),
        newTrend.image_url
      ]
    );

    console.log("Success! The new trend is now active on the site.");
  } catch (err) {
    console.error("Error setting new trending topic:", err);
  } finally {
    await client.end();
  }
}

main();