require('dotenv').config({ path: '.env.local' })

const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

async function run() {
  console.log('DATABASE_URL:', process.env.DATABASE_URL
    ? process.env.DATABASE_URL.replace(/:\/\/.*@/, '://***@')
    : '❌ NOT SET — check your .env.local file')

  if (!process.env.DATABASE_URL) process.exit(1)

  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const sql = fs.readFileSync(path.join(__dirname, '001_init.sql'), 'utf8')
  try {
    await pool.query(sql)
    console.log('✓ Migrations applied successfully')
  } catch (err) {
    console.error('Migration failed:', err.message || err)
  } finally {
    await pool.end()
  }
}

run()