import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.SUPABASE_CONNECTION_URL });

async function run() {
  try {
    const role = 'Co-founder @ Dominating YouTube | Scaling YouTube Channels into Passive Income Streams | Grew Niche Channel from 0 to $212k Valuation in 19 Months';
    const reviewText = `It was a great experience working with G-One media agency. The website was just like I had expected and my instructions and references where followed precisely.

The G-One media team also went a step ahead to include API automation on my website and all of this at a special discounted package.

Really reliable guys who knows what they are doing.`;

    const res = await pool.query(
      `UPDATE reviews 
       SET role = $1, review = $2, image_url = $3, rating = 5, is_approved = true, created_at = '2026-09-12T12:00:00Z' 
       WHERE name = 'Adarsh Pillai' RETURNING *`,
      [role, reviewText, '/adarsh-pillai.png']
    );

    if (res.rows.length === 0) {
      const insertRes = await pool.query(
        `INSERT INTO reviews (name, role, rating, review, image_url, is_approved, created_at)
         VALUES ($1, $2, 5, $3, $4, true, '2026-09-12T12:00:00Z') RETURNING *`,
        ['Adarsh Pillai', role, reviewText, '/adarsh-pillai.png']
      );
      console.log('Inserted LinkedIn review:', insertRes.rows[0]);
    } else {
      console.log('Updated LinkedIn review:', res.rows[0]);
    }
  } catch (err) {
    console.error('Error seeding LinkedIn review:', err);
  } finally {
    await pool.end();
  }
}

run();
