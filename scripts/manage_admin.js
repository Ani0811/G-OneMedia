import pg from 'pg'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import readline from 'readline'
import { v4 as uuidv4 } from 'uuid'

dotenv.config()

const connectionString = process.env.SUPABASE_CONNECTION_URL

if (!connectionString) {
  console.error('❌ Error: SUPABASE_CONNECTION_URL is missing in .env')
  process.exit(1)
}

function promptQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  return new Promise((resolve) => rl.question(query, (ans) => {
    rl.close()
    resolve(ans.trim())
  }))
}

const ROLE_PERMISSIONS = {
  super_admin: ['*'],
  admin: [
    'manage_hero',
    'manage_pricing',
    'manage_services',
    'manage_team',
    'manage_portfolio',
    'manage_client_projects',
    'manage_reviews',
    'manage_leads',
  ],
  editor: [
    'manage_hero',
    'manage_pricing',
    'manage_services',
    'manage_team',
    'manage_portfolio',
    'manage_client_projects',
    'manage_reviews',
  ],
}

async function listAdmins(client) {
  const { rows: admins } = await client.query(`
    SELECT a.id, a.email, a.name, a.role, a.is_active, 
           u.email_confirmed_at, u.last_sign_in_at
    FROM public.admin_users a
    LEFT JOIN auth.users u ON LOWER(a.email) = LOWER(u.email)
    ORDER BY a.created_at ASC
  `)
  console.log('\n📋 Current Administrators:')
  console.table(admins)
}

async function createOrUpdateAdmin(client, { email, password, name, role = 'admin' }) {
  const normalizedEmail = email.toLowerCase().trim()
  const hashedPassword = bcrypt.hashSync(password, 10)
  const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.admin

  console.log(`\n⏳ Setting up admin account for: ${normalizedEmail}...`)

  // 1. Check if auth user exists
  const { rows: existingAuth } = await client.query(
    'SELECT id FROM auth.users WHERE LOWER(email) = $1',
    [normalizedEmail]
  )

  let userId
  if (existingAuth.length > 0) {
    userId = existingAuth[0].id
    await client.query(`
      UPDATE auth.users 
      SET encrypted_password = $1,
          email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
          confirmation_token = COALESCE(confirmation_token, ''),
          recovery_token = COALESCE(recovery_token, ''),
          email_change_token_new = COALESCE(email_change_token_new, ''),
          email_change = COALESCE(email_change, ''),
          email_change_token_current = COALESCE(email_change_token_current, ''),
          phone_change = COALESCE(phone_change, ''),
          phone_change_token = COALESCE(phone_change_token, ''),
          reauthentication_token = COALESCE(reauthentication_token, ''),
          raw_user_meta_data = jsonb_build_object(
            'sub', id::text,
            'email', email,
            'full_name', $2::text,
            'email_verified', true,
            'phone_verified', false
          ),
          updated_at = NOW()
      WHERE id = $3
    `, [hashedPassword, name, userId])
    console.log(`   ✓ Updated credentials in auth.users (ID: ${userId})`)
  } else {
    userId = uuidv4()
    await client.query(`
      INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password,
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at, confirmation_token, recovery_token,
        email_change_token_new, email_change, email_change_token_current,
        phone_change, phone_change_token, reauthentication_token
      ) VALUES (
        '00000000-0000-0000-0000-000000000000', $1, 'authenticated', 'authenticated', $2, $3,
        NOW(), '{"provider":"email","providers":["email"]}', jsonb_build_object(
          'sub', $1::text,
          'email', $2::text,
          'full_name', $4::text,
          'email_verified', true,
          'phone_verified', false
        ),
        NOW(), NOW(), '', '',
        '', '', '',
        '', '', ''
      )
    `, [userId, normalizedEmail, hashedPassword, name])
    console.log(`   ✓ Created confirmed auth user (ID: ${userId})`)
  }

  // Ensure linked identity exists
  const { rows: existingIdent } = await client.query(
    'SELECT id FROM auth.identities WHERE user_id = $1::uuid',
    [userId]
  )
  if (existingIdent.length === 0) {
    const identityId = uuidv4()
    await client.query(`
      INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
      ) VALUES (
        $1::uuid, $2::uuid, jsonb_build_object('sub', $2::text, 'email', $3::text), 'email', $2::text, NOW(), NOW(), NOW()
      )
    `, [identityId, userId, normalizedEmail])
    console.log(`   ✓ Linked auth identity`)
  }

  // 2. Check/Insert in public.admin_users
  const { rows: existingAdmin } = await client.query(
    'SELECT id FROM public.admin_users WHERE LOWER(email) = $1',
    [normalizedEmail]
  )

  if (existingAdmin.length > 0) {
    await client.query(`
      UPDATE public.admin_users 
      SET name = $1, role = $2, permissions = $3, is_active = true
      WHERE id = $4
    `, [name, role, JSON.stringify(permissions), existingAdmin[0].id])
    console.log(`   ✓ Updated public.admin_users permissions profile`)
  } else {
    await client.query(`
      INSERT INTO public.admin_users (
        id, email, name, role, permissions, is_active, created_at
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, true, NOW()
      )
    `, [normalizedEmail, name, role, JSON.stringify(permissions)])
    console.log(`   ✓ Inserted into public.admin_users profile table`)
  }

  console.log(`\n🎉 Success! Administrator account for ${normalizedEmail} is active and confirmed.`)
  console.log(`👉 You can sign in immediately at /admin with your password.\n`)
}

async function resetPassword(client, { email, password }) {
  const normalizedEmail = email.toLowerCase().trim()
  const hashedPassword = bcrypt.hashSync(password, 10)

  console.log(`\n⏳ Resetting password for: ${normalizedEmail}...`)

  const { rows: userRows } = await client.query(
    'SELECT id FROM auth.users WHERE LOWER(email) = $1',
    [normalizedEmail]
  )

  if (userRows.length === 0) {
    console.error(`❌ User ${normalizedEmail} does not exist in auth.users. Use "create" command instead.`)
    return
  }

  const userId = userRows[0].id
  await client.query(`
    UPDATE auth.users 
    SET encrypted_password = $1,
        email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
        updated_at = NOW()
    WHERE id = $2
  `, [hashedPassword, userId])

  // Also ensure active in admin_users if present
  await client.query(`
    UPDATE public.admin_users SET is_active = true WHERE LOWER(email) = $1
  `, [normalizedEmail])

  console.log(`\n🎉 Success! Password reset for ${normalizedEmail}.`)
  console.log(`👉 The user can sign in immediately at /admin with their new password.\n`)
}

async function main() {
  const client = new pg.Client({ connectionString })
  await client.connect()

  const command = process.argv[2] || 'prompt'

  try {
    if (command === 'list') {
      await listAdmins(client)
    } else if (command === 'create') {
      let email = process.argv[3] || await promptQuestion('Enter Admin Email: ')
      let password = process.argv[4] || await promptQuestion('Enter Password (min 6 chars): ')
      let name = process.argv[5] || await promptQuestion('Enter Full Name: ')
      let role = process.argv[6] || await promptQuestion('Enter Role (super_admin, admin, editor) [admin]: ') || 'admin'

      if (!email || !password || password.length < 6) {
        console.error('❌ Error: Valid email and password (minimum 6 characters) are required.')
        process.exit(1)
      }
      await createOrUpdateAdmin(client, { email, password, name: name || email.split('@')[0], role })
    } else if (command === 'reset') {
      let email = process.argv[3] || await promptQuestion('Enter Admin Email to reset: ')
      let password = process.argv[4] || await promptQuestion('Enter New Password (min 6 chars): ')

      if (!email || !password || password.length < 6) {
        console.error('❌ Error: Valid email and password (minimum 6 characters) are required.')
        process.exit(1)
      }
      await resetPassword(client, { email, password })
    } else {
      console.log('\n🔒 G-One Media Admin Account CLI')
      console.log('─────────────────────────────────')
      const action = await promptQuestion('Choose action: [1] List Admins, [2] Create/Register Admin, [3] Reset Password: ')
      if (action === '1') {
        await listAdmins(client)
      } else if (action === '2') {
        let email = await promptQuestion('Enter Admin Email: ')
        let password = await promptQuestion('Enter Password (min 6 chars): ')
        let name = await promptQuestion('Enter Full Name: ')
        let role = (await promptQuestion('Enter Role (super_admin, admin, editor) [admin]: ')) || 'admin'
        await createOrUpdateAdmin(client, { email, password, name: name || email.split('@')[0], role })
      } else if (action === '3') {
        let email = await promptQuestion('Enter Admin Email: ')
        let password = await promptQuestion('Enter New Password (min 6 chars): ')
        await resetPassword(client, { email, password })
      }
    }
  } catch (err) {
    console.error('❌ Error:', err.message)
  } finally {
    await client.end()
  }
}

main().catch(console.error)
