import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  const client = await pool.connect()
  try {
    // 1. Button clicks — read from pre-aggregated table (O(1) per row, no GROUP BY needed)
    const clicksResult = await client.query<{
      content_id: string
      button_label: string
      click_count: string
      last_updated: string
    }>(
      `SELECT content_id, button_label, click_count, last_updated
       FROM click_counts_agg
       ORDER BY click_count DESC`
    )

    // 2. Video watch time — aggregated per video
    //    This table grows unbounded, so we aggregate here.
    //    At scale: move this to a scheduled materialised view refresh.
    const watchResult = await client.query<{
      video_id: string
      content_id: string
      sessions: string
      total_seconds: string
      avg_seconds: string
    }>(
      `SELECT
         video_id,
         content_id,
         COUNT(*)::text           AS sessions,
         SUM(watched_seconds)::text  AS total_seconds,
         ROUND(AVG(watched_seconds))::text AS avg_seconds
       FROM video_watch_events
       GROUP BY video_id, content_id
       ORDER BY total_seconds DESC NULLS LAST`
    )

    // 3. Engagement scores — read from denormalised cache (no join needed)
    const engageResult = await client.query<{
      content_id: string
      button_clicks: number
      watch_seconds: number
      page_views: number
      score: number
    }>(
      `SELECT content_id, button_clicks, watch_seconds, page_views, score
       FROM engagement_scores
       ORDER BY score DESC`
    )

    return NextResponse.json({
      clicks: clicksResult.rows,
      watches: watchResult.rows,
      engagement: engageResult.rows,
    })
  } catch (err) {
    console.error('[analytics/dashboard]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  } finally {
    client.release()
  }
}
