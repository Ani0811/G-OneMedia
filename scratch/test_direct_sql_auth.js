import bcrypt from 'bcryptjs'
import pg from 'pg'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid'

dotenv.config()

const { Client } = pg
const db = new Client({ connectionString: process.env.SUPABASE_CONNECTION_URL })
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

async function testDirectBcryptAuth() {
  await db.connect()
  const testId = uuidv4()
  const testEmail = `test_pg_auth_${Date.now()}@testdomain.com`
  const testPass = 'TestingDirectBcrypt123!'
  const hashedPassword = bcrypt.hashSync(testPass, 10)

  console.log(`Inserting test auth user directly via Postgres SQL...`)
  await db.query(`
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', $1, 'authenticated', 'authenticated', $2, $3,
      NOW(), '{"provider":"email","providers":["email"]}', '{}',
      NOW(), NOW(), '', ''
    )
  `, [testId, testEmail, hashedPassword])

  console.log(`Attempting signInWithPassword using Supabase client...`)
  const { data, error } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPass
  })

  if (error) {
    console.error("Direct SQL auth test failed:", error)
  } else {
    console.log("SUCCESS! Directly hashed password in auth.users authenticated successfully! User ID:", data.user?.id)
  }

  // Clean up
  await db.query('DELETE FROM auth.users WHERE id = $1', [testId])
  console.log("Cleaned up test user.")
  await db.end()
}

testDirectBcryptAuth().catch(console.error)
