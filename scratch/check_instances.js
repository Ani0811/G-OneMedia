import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Client } = pg
const client = new Client({ connectionString: process.env.SUPABASE_CONNECTION_URL })

async function inspect() {
  await client.connect()
  const { rows } = await client.query('SELECT * FROM auth.instances')
  console.log('auth.instances:', rows)
  await client.end()
}

inspect().catch(console.error)
