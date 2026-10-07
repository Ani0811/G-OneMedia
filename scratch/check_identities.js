import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Client } = pg
const db = new Client({ connectionString: process.env.SUPABASE_CONNECTION_URL })

async function checkIdentities() {
  await db.connect()
  const { rows } = await db.query("SELECT * FROM auth.identities")
  console.log("auth.identities:")
  console.table(rows)
  await db.end()
}

checkIdentities().catch(console.error)
