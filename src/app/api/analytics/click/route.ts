import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(req: NextRequest) {
  const { user_id, button_label, content_id } = await req.json()

  if (!user_id || !button_label || !content_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // 1. Append raw event (always fast — insert only)
    await client.query(
      `INSERT INTO button_clicks (user_id, button_label, content_id)
       VALUES ($1, $2, $3)`,
      [user_id, button_label, content_id]
    )

    // 2. Upsert pre-aggregated count (avoids expensive GROUP BY on reads)
    await client.query(
      `INSERT INTO click_counts_agg (content_id, button_label, click_count, last_updated)
       VALUES ($1, $2, 1, NOW())
       ON CONFLICT (content_id, button_label)
       DO UPDATE SET
         click_count  = click_counts_agg.click_count + 1,
         last_updated = NOW()`,
      [content_id, button_label]
    )

    // 3. Update engagement score cache
    await client.query(
      `INSERT INTO engagement_scores (content_id, button_clicks, score)
       VALUES ($1, 1, 10)
       ON CONFLICT (content_id)
       DO UPDATE SET
         button_clicks = engagement_scores.button_clicks + 1,
         score         = engagement_scores.score + 10,
         last_updated  = NOW()`,
      [content_id]
    )

    await client.query('COMMIT')
    return NextResponse.json({ ok: true })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('[button_click]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  } finally {
    client.release()
  }
}
