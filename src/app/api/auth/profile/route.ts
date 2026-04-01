import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { hashPassword, verifyPassword, verifyJWT } from '@/lib/auth'

export async function PUT(req: NextRequest) {
  console.log('[API] /api/auth/profile hit')
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

    // Get user from DB
    const session = await pool.query(
      `SELECT id, password_hash FROM users WHERE id = $1`,
      [payload.id]
    )

    if (session.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userId = session.rows[0].id
    const currentHash = session.rows[0].password_hash
    const { name, email, currentPassword, newPassword } = await req.json()

    // If changing password, verify current first
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required' }, { status: 400 })
      }
      if (!verifyPassword(currentPassword, currentHash)) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 })
      }
      const hashed = hashPassword(newPassword)
      await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashed, userId])
    }

    // Update name/email
    if (name?.trim() || email?.trim()) {
      const fields: string[] = []
      const vals: any[] = []
      let i = 1

      if (name?.trim()) {
        fields.push(`name = $${i++}`)
        vals.push(name.trim())
      }
      if (email?.trim()) {
        // Check uniqueness
        const exists = await pool.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email.toLowerCase().trim(), userId])
        if (exists.rows.length > 0) {
          return NextResponse.json({ error: 'Email already taken' }, { status: 409 })
        }
        fields.push(`email = $${i++}`)
        vals.push(email.toLowerCase().trim())
      }

      if (fields.length > 0) {
        vals.push(userId)
        await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = $${i}`, vals)
      }
    }

    // Return updated user
    const updated = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [userId]
    )

    return NextResponse.json({ user: updated.rows[0] })
  } catch (err: any) {
    console.error('Profile update error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
