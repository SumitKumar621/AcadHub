import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { hashPassword, createJWT } from '@/lib/auth'

export async function POST(req: NextRequest) {
  console.log('[API] /api/auth/register hit')
  try {
    const { name, email, password } = await req.json()

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    // Check if user exists
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()])
    if (exists.rows.length > 0) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    const hashed = hashPassword(password)

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at`,
      [name.trim(), email.toLowerCase().trim(), hashed]
    )

    const user = result.rows[0]

    // Create JWT
    const token = await createJWT({ id: user.id })

    const response = NextResponse.json({ user })
    response.cookies.set('lf_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/'
    })

    return response
  } catch (err: any) {
    console.error('Register error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
