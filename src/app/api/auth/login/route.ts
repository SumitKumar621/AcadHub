import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { verifyPassword, createJWT } from '@/lib/auth'

export async function POST(req: NextRequest) {
  console.log('[API] /api/auth/login hit')
  try {
    const { email, password } = await req.json()

    if (!email?.trim() || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const result = await pool.query(
      `SELECT id, name, email, password_hash, created_at FROM users WHERE email = $1`,
      [email.toLowerCase().trim()]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const row = result.rows[0]

    if (!verifyPassword(password, row.password_hash)) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = await createJWT({ id: row.id })
    const user = { id: row.id, name: row.name, email: row.email, created_at: row.created_at }

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
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
