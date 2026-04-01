import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(req: NextRequest) {
  const { user_id, content_id } = await req.json()

  if (!user_id || !content_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    await client.query(
      `INSERT INTO page_views (user_id, content_id) VALUES ($1, $2)`,
      [user_id, content_id]
    )

    await client.query(
      `INSERT INTO engagement_scores (content_id, page_views, score)
       VALUES ($1, 1, 5)
       ON CONFLICT (content_id)
       DO UPDATE SET
         page_views   = engagement_scores.page_views + 1,
         score        = engagement_scores.score + 5,
         last_updated = NOW()`,
      [content_id]
    )

    await client.query('COMMIT')
    return NextResponse.json({ ok: true })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('[page_view]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  } finally {
    client.release()
  }
}
