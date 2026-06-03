import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;
const connectionString = process.env.SUPABASE_CONNECTION_URL;

if (!connectionString) {
  console.error("SUPABASE_CONNECTION_URL is missing in .env file.");
  process.exit(1);
}

const client = new Client({
  connectionString,
});

async function main() {
  await client.connect();
  console.log("Connected to Supabase PostgreSQL database.");

  // 1. Create/verify reviews table and apply RLS policies
  console.log("Setting up reviews table and its policies...");
  await client.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      name TEXT NOT NULL,
      role TEXT,
      rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      review TEXT NOT NULL,
      image_url TEXT,
      is_approved BOOLEAN DEFAULT FALSE
    );
  `);

  await client.query(`ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;`);

  // Drop old policies
  await client.query(`DROP POLICY IF EXISTS "Public read approved reviews" ON reviews;`);
  await client.query(`DROP POLICY IF EXISTS "Public can submit reviews" ON reviews;`);
  await client.query(`DROP POLICY IF EXISTS "Public can update reviews" ON reviews;`);
  await client.query(`DROP POLICY IF EXISTS "Public can delete reviews" ON reviews;`);

  // Create clean policies
  await client.query(`
    CREATE POLICY "Public read approved reviews"
      ON reviews FOR SELECT
      TO public
      USING (is_approved = true);
  `);

  await client.query(`
    CREATE POLICY "Public can submit reviews"
      ON reviews FOR INSERT
      TO public
      WITH CHECK (true);
  `);

  await client.query(`
    CREATE POLICY "Public can update reviews"
      ON reviews FOR UPDATE
      TO public
      USING (true)
      WITH CHECK (true);
  `);

  await client.query(`
    CREATE POLICY "Public can delete reviews"
      ON reviews FOR DELETE
      TO public
      USING (true);
  `);
  console.log("Reviews table and policies setup completed.");

  // 2. Create storage bucket in storage.buckets if not exists
  console.log("Creating review-avatars bucket...");
  await client.query(`
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'review-avatars',
      'review-avatars',
      true,
      10485760, -- 10MB limit
      ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    )
    ON CONFLICT (id) DO NOTHING;
  `);
  console.log("Bucket review-avatars created/verified.");

  // 3. Create storage policies
  console.log("Applying storage RLS policies...");
  
  // Drop policies if exist to prevent duplicate errors
  await client.query(`DROP POLICY IF EXISTS "Public can upload review avatars" ON storage.objects;`);
  await client.query(`DROP POLICY IF EXISTS "Public can view review avatars" ON storage.objects;`);
  await client.query(`DROP POLICY IF EXISTS "Public can update review avatars" ON storage.objects;`);
  await client.query(`DROP POLICY IF EXISTS "Public can delete review avatars" ON storage.objects;`);

  // Create INSERT policy
  await client.query(`
    CREATE POLICY "Public can upload review avatars"
      ON storage.objects FOR INSERT
      TO public
      WITH CHECK (bucket_id = 'review-avatars');
  `);

  // Create SELECT policy
  await client.query(`
    CREATE POLICY "Public can view review avatars"
      ON storage.objects FOR SELECT
      TO public
      USING (bucket_id = 'review-avatars');
  `);

  // Create UPDATE policy
  await client.query(`
    CREATE POLICY "Public can update review avatars"
      ON storage.objects FOR UPDATE
      TO public
      USING (bucket_id = 'review-avatars')
      WITH CHECK (bucket_id = 'review-avatars');
  `);

  // Create DELETE policy
  await client.query(`
    CREATE POLICY "Public can delete review avatars"
      ON storage.objects FOR DELETE
      TO public
      USING (bucket_id = 'review-avatars');
  `);

  console.log("Storage policies applied successfully.");
  await client.end();
}

main().catch(err => {
  console.error("Error setting up storage:", err);
  process.exit(1);
});
