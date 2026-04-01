import pool from '@/lib/db'
import Link from 'next/link'
import { books } from '@/lib/content'
import styles from './page.module.css'
import ExpandableTable from '@/components/Expandabletable'

function chapterTitle(id: string) {
  for (const b of books) {
    const ch = b.chapters.find(c => c.id === id)
    if (ch) return ch.title
  }
  return id
}

function formatTime(ts: string) {
  const d = new Date(ts)
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: true,
  })
}

async function getDashboardData() {
  const [clicksRes, watchRes, engageRes] = await Promise.all([
    pool.query(
      `SELECT user_id, button_label, content_id, clicked_at
       FROM button_clicks
       ORDER BY clicked_at DESC
       LIMIT 100`
    ),
    pool.query(
      `SELECT user_id, video_id, content_id, watched_seconds, recorded_at
       FROM video_watch_events
       ORDER BY recorded_at DESC
       LIMIT 50`
    ),
    pool.query(
      `SELECT content_id, button_clicks, watch_seconds, page_views, score
       FROM engagement_scores ORDER BY score DESC`
    ),
  ])

  return {
    clicks:     clicksRes.rows,
    watches:    watchRes.rows,
    engagement: engageRes.rows,
  }
}

export const revalidate = 30

export default async function AnalyticsPage() {
  let data = { clicks: [] as any[], watches: [] as any[], engagement: [] as any[] }

  try {
    data = await getDashboardData()
  } catch (e) {
    console.error('Failed to fetch dashboard data:', e)
  }

  const totalClicks = data.clicks.length
  const totalWatch  = data.watches.reduce((s, r) => s + Number(r.watched_seconds), 0)
  const totalPages  = data.engagement.length
  const maxScore    = Math.max(...data.engagement.map(r => Number(r.score)), 1)

  const clickRows = data.clicks.map((r, i) => (
    <tr key={i}>
      <td className={styles.monoCell}>{r.user_id}</td>
      <td><span className={styles.pill}>{r.button_label}</span></td>
      <td className={styles.pageCell}>{chapterTitle(r.content_id)}</td>
      <td className={styles.timeCell}>{formatTime(r.clicked_at)}</td>
    </tr>
  ))

  const watchRows = data.watches.map((r, i) => (
    <tr key={i}>
      <td className={styles.monoCell}>{r.user_id}</td>
      <td className={styles.monoCell}>{r.video_id}</td>
      <td className={styles.pageCell}>{chapterTitle(r.content_id)}</td>
      <td className={styles.numCell}>{r.watched_seconds}s</td>
      <td className={styles.timeCell}>{formatTime(r.recorded_at)}</td>
    </tr>
  ))

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Back to Dashboard
        </Link>
        <h1 className={styles.title}>Analytics</h1>
        <p className={styles.sub}>Real-time learner interaction data</p>
      </header>

      <div className={styles.metricGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Total button clicks</div>
          <div className={styles.metricValue}>{totalClicks.toLocaleString()}</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Total watch time</div>
          <div className={styles.metricValue}>{Math.floor(totalWatch / 60)}m {totalWatch % 60}s</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Content pages tracked</div>
          <div className={styles.metricValue}>{totalPages}</div>
        </div>
      </div>

      {/* A. Button Click Tracking */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>A. Button click tracking</h2>
        <p className={styles.metricDesc}>
          Track which button a user clicked, on which content page, and at what time.
        </p>
        {data.clicks.length === 0 ? (
          <div className={styles.empty}>No click data yet — interact with content first.</div>
        ) : (
          <ExpandableTable
            headers={['user_id', 'button_label', 'content_id', 'clicked_at']}
            rows={clickRows}
            initialCount={5}
          />
        )}
      </section>

      {/* B. Video Watch Time Tracking */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>B. Video watch time tracking</h2>
        <p className={styles.metricDesc}>
          Track how long a user watched a video. Each row is one meaningful watch session.
        </p>
        {data.watches.length === 0 ? (
          <div className={styles.empty}>No watch data yet — play a video to start tracking.</div>
        ) : (
          <ExpandableTable
            headers={['user_id', 'video_id', 'content_id', 'watched_seconds', 'recorded_at']}
            rows={watchRows}
            initialCount={5}
          />
        )}
      </section>

      {/* C. Content Engagement Score */}
      <section className={styles.section}>
        <div className={styles.sectionTitleRow}>
          <h2 className={styles.sectionTitle}>C. Content engagement score</h2>
          <span className={styles.badge}>custom metric</span>
        </div>
        <p className={styles.metricDesc}>
          Composite score per page: <strong>+10</strong> per button click · <strong>+0.5/s</strong> watched · <strong>+5</strong> per visit.
          Answers: <em>which content is actually driving learning?</em>
        </p>
        {data.engagement.length === 0 ? (
          <div className={styles.empty}>No engagement data yet.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>content_id</th><th>score</th><th>button_clicks</th>
                <th>watch_seconds</th><th>page_views</th><th className={styles.barCol}>Relative</th>
              </tr>
            </thead>
            <tbody>
              {data.engagement.map((r, i) => (
                <tr key={i}>
                  <td className={styles.pageCell}>{chapterTitle(r.content_id)}</td>
                  <td className={styles.scoreCell}>{r.score}</td>
                  <td className={styles.numCell}>{r.button_clicks}</td>
                  <td className={styles.numCell}>{r.watch_seconds}</td>
                  <td className={styles.numCell}>{r.page_views}</td>
                  <td>
                    <div className={styles.barTrack}>
                      <div className={`${styles.barFill} ${styles.barGreen}`}
                        style={{ width: `${Math.round((Number(r.score) / maxScore) * 100)}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}