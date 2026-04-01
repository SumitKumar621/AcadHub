-- AcadHub Analytics Schema
-- Run with: node migrations/run.js

-- ─── Button click events ─────────────────────────────────────────────────────
-- Append-only event log. Never updated, only inserted.
CREATE TABLE IF NOT EXISTS button_clicks (
  id            BIGSERIAL PRIMARY KEY,
  user_id       TEXT        NOT NULL,
  button_label  TEXT        NOT NULL,
  content_id    TEXT        NOT NULL,   -- chapter id
  clicked_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Supports: "group by content_id, button_label" dashboard query
CREATE INDEX IF NOT EXISTS idx_clicks_content_label
  ON button_clicks (content_id, button_label);

-- Supports: time-range filtering
CREATE INDEX IF NOT EXISTS idx_clicks_time
  ON button_clicks (clicked_at DESC);

-- ─── Video watch events ───────────────────────────────────────────────────────
-- One row per watch session (play → pause/end).
-- watched_seconds = actual seconds watched, not video duration.
CREATE TABLE IF NOT EXISTS video_watch_events (
  id               BIGSERIAL PRIMARY KEY,
  user_id          TEXT        NOT NULL,
  video_id         TEXT        NOT NULL,
  content_id       TEXT        NOT NULL,
  watched_seconds  INTEGER     NOT NULL CHECK (watched_seconds >= 0),
  recorded_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Supports: "avg and total watch time per video" dashboard query
CREATE INDEX IF NOT EXISTS idx_watch_video
  ON video_watch_events (video_id);

CREATE INDEX IF NOT EXISTS idx_watch_content
  ON video_watch_events (content_id);

-- ─── Page view events ─────────────────────────────────────────────────────────
-- Tracks content engagement (custom 3rd metric input).
CREATE TABLE IF NOT EXISTS page_views (
  id          BIGSERIAL PRIMARY KEY,
  user_id     TEXT        NOT NULL,
  content_id  TEXT        NOT NULL,
  viewed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pageviews_content
  ON page_views (content_id);

-- ─── Materialised aggregate (performance) ────────────────────────────────────
-- Pre-aggregated click counts refreshed on write.
-- Avoids full table scans on the dashboard query.
-- Trade-off: slight write overhead, much faster reads at scale.
CREATE TABLE IF NOT EXISTS click_counts_agg (
  content_id    TEXT  NOT NULL,
  button_label  TEXT  NOT NULL,
  click_count   BIGINT NOT NULL DEFAULT 0,
  last_updated  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (content_id, button_label)
);

-- ─── Engagement score cache ───────────────────────────────────────────────────
-- Denormalised composite score updated on each event write.
-- Avoids three-table join on every dashboard load.
CREATE TABLE IF NOT EXISTS engagement_scores (
  content_id      TEXT    PRIMARY KEY,
  button_clicks   INTEGER NOT NULL DEFAULT 0,
  watch_seconds   INTEGER NOT NULL DEFAULT 0,
  page_views      INTEGER NOT NULL DEFAULT 0,
  score           INTEGER NOT NULL DEFAULT 0,
  last_updated    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
