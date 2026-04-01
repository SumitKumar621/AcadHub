import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { verifyJWT } from '@/lib/auth'

export async function GET(req: NextRequest) {
  console.log('[API] /api/auth/me hit')
  try {
    const token = req.cookies.get('lf_auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    let payload
    try {
      payload = await verifyJWT(token)
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const result = await pool.query(
      `SELECT id, name, email, created_at FROM users WHERE id = $1`,
      [payload.id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user: result.rows[0] })
  } catch (err: any) {
    console.error('Me error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
