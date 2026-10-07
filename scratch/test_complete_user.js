import bcrypt from 'bcryptjs'
import pg from 'pg'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid'

dotenv.config()

const { Client } = pg
const db = new Client({ connectionString: process.env.SUPABASE_CONNECTION_URL })
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

async function testCompleteUser() {
  await db.connect()
  const userId = uuidv4()
  const identityId = uuidv4()
  const testEmail = `test_admin_${Date.now()}@testtemp.com`
  const testPass = 'TestingPass123!'
  const hashedPassword = bcrypt.hashSync(testPass, 10)

  // Insert auth.users
  await db.query(`
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', $1, 'authenticated', 'authenticated', $2, $3,
      NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Test Admin"}',
      NOW(), NOW(), '', ''
    )
  `, [userId, testEmail, hashedPassword])

  // Insert auth.identities
  await db.query(`
    INSERT INTO auth.identities (
      id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at, email
    ) VALUES (
      $1, $2, jsonb_build_object('sub', $2, 'email', $3), 'email', $2, NOW(), NOW(), NOW(), $3
    )
  `, [identityId, userId, testEmail])

  console.log("Inserted user & identity. Attempting sign-in...")
  const { data, error } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPass
  })

  if (error) {
    console.error("Sign in failed:", error)
  } else {
    console.log("SUCCESS! User signed in successfully. User ID:", data.user?.id)
  }

  // Clean up
  await db.query('DELETE FROM auth.identities WHERE id = $1', [identityId])
  await db.query('DELETE FROM auth.users WHERE id = $1', [userId])
  console.log("Cleaned up test user.")
  await db.end()
}

testCompleteUser().catch(console.error)
