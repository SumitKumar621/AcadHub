import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(req: NextRequest) {
  const { user_id, video_id, content_id, watched_seconds } = await req.json()

  if (!user_id || !video_id || !content_id || typeof watched_seconds !== 'number') {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Ignore noise — only record if user watched at least 3 seconds
  if (watched_seconds < 3) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    await client.query(
      `INSERT INTO video_watch_events (user_id, video_id, content_id, watched_seconds)
       VALUES ($1, $2, $3, $4)`,
      [user_id, video_id, content_id, Math.round(watched_seconds)]
    )

    // Update engagement score: 0.5 points per second watched (capped at video value)
    const scoreIncrement = Math.min(Math.round(watched_seconds * 0.5), 100)
    await client.query(
      `INSERT INTO engagement_scores (content_id, watch_seconds, score)
       VALUES ($1, $2, $3)
       ON CONFLICT (content_id)
       DO UPDATE SET
         watch_seconds = engagement_scores.watch_seconds + $2,
         score         = engagement_scores.score + $3,
         last_updated  = NOW()`,
      [content_id, Math.round(watched_seconds), scoreIncrement]
    )

    await client.query('COMMIT')
    return NextResponse.json({ ok: true })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('[video_watch]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  } finally {
    client.release()
  }
}
