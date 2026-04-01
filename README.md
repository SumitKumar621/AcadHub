# AcadHub — Content Analytics Platform

A structured learning platform (Books → Chapters → Content) with real-time analytics tracking. Built with Next.js 14 App Router, PostgreSQL, and Node.js.

**Live URL:** _add after deployment_  
**Demo video:** _add Loom link_

---

## Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/AcadHub
cd AcadHub
npm install

# Set up your database
cp .env.example .env.local
# Add your DATABASE_URL to .env.local

# Run migrations
npm run db:migrate

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

```
DATABASE_URL=postgresql://user:password@host:5432/AcadHub
```

---

## Database Schema

```sql
-- Append-only event logs (never updated, only inserted)
button_clicks        (id, user_id, button_label, content_id, clicked_at)
video_watch_events   (id, user_id, video_id, content_id, watched_seconds, recorded_at)
page_views           (id, user_id, content_id, viewed_at)

-- Pre-aggregated / denormalised for fast dashboard reads
click_counts_agg     (content_id, button_label, click_count, last_updated)  -- PK: (content_id, button_label)
engagement_scores    (content_id, button_clicks, watch_seconds, page_views, score, last_updated)  -- PK: content_id
```

### Why this shape?

**Event tables are append-only.** Analytics events should never be updated — immutability lets you audit, replay, and backfill. Each row is a fact: something happened at a point in time.

**Aggregates are written eagerly.** The dashboard queries `click_counts_agg` and `engagement_scores` directly — both are `O(rows)` reads with no `GROUP BY`. The trade-off is a slightly heavier write path (two upserts per event inside a transaction), but this is negligible at any realistic event rate and completely avoids expensive read-time aggregation.

Without this, a `COUNT(*) GROUP BY content_id, button_label` on `button_clicks` scans the full event table on every dashboard load — fine at 10k rows, painful at 10M.

---

## Architecture

```
Browser
  │
  ├── /books/[bookId]/[chapterId]   → Server Component (SSR)
  │     ├── VideoPlayer              → Client Component (tracks watch time)
  │     ├── ActionButton             → Client Component (tracks clicks)
  │     └── PageViewTracker          → Client Component (fires on mount)
  │
  └── /analytics                    → Server Component (ISR, revalidates every 30s)

API Routes (Next.js)
  POST /api/analytics/click          → insert event + upsert aggregate
  POST /api/analytics/watch          → insert event + upsert score
  POST /api/analytics/pageview       → insert event + upsert score
  GET  /api/analytics/dashboard      → read aggregates (used by external consumers)

PostgreSQL (via pg Pool, singleton)
```

### Key decisions

**Next.js App Router with ISR on the dashboard.**  
The analytics page is a server component that reads directly from PostgreSQL. It uses `revalidate = 30`, meaning Next.js caches the rendered page and rebuilds it in the background every 30 seconds. This gives dashboard viewers near-real-time data without a database query on every page load.

**Single pg Pool, declared as a global.**  
Next.js hot-reloads modules in development, which would create a new connection pool on every change. Declaring the pool on `global` prevents pool exhaustion during development while still using the singleton pattern in production.

**Transactions on writes.**  
Each analytics event write uses a transaction: the raw event row and the aggregate upsert succeed or fail together. This keeps the aggregate table consistent with the event log at all times.

**`navigator.sendBeacon` for video unmount.**  
When a user navigates away while a video is playing, the component's cleanup fires `navigator.sendBeacon` — a non-blocking fire-and-forget HTTP POST that survives page unloads. A regular `fetch` in a `useEffect` cleanup is unreliable on navigation.

**Minimum watch threshold (3 seconds).**  
Watch events shorter than 3 seconds are discarded at the API layer. This filters accidental clicks and ensures `avg_seconds` reflects genuine engagement rather than noise.

---

## Analytics: Three Metrics

### A — Button Click Tracking
Fields: `user_id`, `button_label`, `content_id`, `clicked_at`  
Dashboard shows: click counts grouped by content page and button label, with relative activity bars.

### B — Video Watch Time
Fields: `user_id`, `video_id`, `content_id`, `watched_seconds`, `recorded_at`  
One row per watch session (play → pause or navigate away). Dashboard shows total and average watch time per video.

### C — Content Engagement Score (custom)
**Business question it answers:** *Which content pages are actually driving learning, not just being opened?*

Page views alone don't distinguish a learner who read every word and completed the quiz from one who bounced after two seconds. The engagement score is a composite:

| Signal | Points |
|--------|--------|
| Page view | +5 |
| Button click | +10 |
| Second of video watched | +0.5 |

This weights active signals (clicking, watching) more heavily than passive ones (visiting). A page with 10 views but zero clicks and zero watch time scores 50. A page with 5 views, 3 quiz attempts, and 60 seconds of video scores 5×5 + 3×10 + 60×0.5 = 85. The score is maintained in a denormalised `engagement_scores` table, updated on every event write.

---

## Performance decisions

- **Indexed event tables:** `(content_id, button_label)` on `button_clicks` and `video_id` on `video_watch_events` support any future per-content or per-video drill-down queries.
- **Aggregates avoid GROUP BY at read time:** `click_counts_agg` is the primary dashboard source for clicks — no scan of the raw event table.
- **ISR caches the dashboard page:** `revalidate = 30` means a burst of dashboard visitors hits the CDN cache, not the database.
- **Connection pooling:** `pg.Pool` with `max: 10` handles concurrent requests without exhausting database connections.
- **At scale:** The next step would be a job queue (e.g. BullMQ) to buffer high-frequency events in Redis and flush to PostgreSQL in batches, decoupling write latency from HTTP response time.

---

## Deployment

**Recommended: Vercel (frontend) + Railway (PostgreSQL)**

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Create a PostgreSQL database on [railway.app](https://railway.app)
4. Add `DATABASE_URL` to Vercel environment variables
5. Run `npm run db:migrate` once against your production database

---

## Collaborator

`kartik150704` has been added as a GitHub collaborator.
