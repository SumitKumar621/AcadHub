import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(req: NextRequest) {
  console.log('[API] /api/auth/logout hit')
  try {
    const response = NextResponse.json({ ok: true })
    response.cookies.delete('lf_auth_token')
    return response
  } catch (err: any) {
    console.error('Logout error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
