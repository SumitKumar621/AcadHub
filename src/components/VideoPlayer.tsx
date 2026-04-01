'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { getOrCreateUserId } from '@/lib/session'
import styles from './VideoPlayer.module.css'

interface Props {
  videoId: string
  contentId: string
  label: string
  durationSeconds: number
}

export default function VideoPlayer({ videoId, contentId, label, durationSeconds }: Props) {
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const sessionSecsRef = useRef(0)

  const stopAndRecord = useCallback(async () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setPlaying(false)
    const secs = sessionSecsRef.current
    sessionSecsRef.current = 0
    if (secs >= 3) {
      await fetch('/api/analytics/watch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: getOrCreateUserId(),
          video_id: videoId,
          content_id: contentId,
          watched_seconds: secs,
        }),
      })
    }
  }, [videoId, contentId])

  const toggle = () => {
    if (playing) {
      stopAndRecord()
    } else {
      setPlaying(true)
      sessionSecsRef.current = 0
      intervalRef.current = setInterval(() => {
        sessionSecsRef.current += 1
        setElapsed(prev => {
          const next = prev + 1
          if (next >= durationSeconds) {
            stopAndRecord()
            return durationSeconds
          }
          return next
        })
      }, 1000)
    }
  }

  // Record watch time if user navigates away while playing
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      const secs = sessionSecsRef.current
      if (secs >= 3) {
        navigator.sendBeacon(
          '/api/analytics/watch',
          JSON.stringify({
            user_id: getOrCreateUserId(),
            video_id: videoId,
            content_id: contentId,
            watched_seconds: secs,
          })
        )
      }
    }
  }, [videoId, contentId, stopAndRecord])

  const pct = Math.min(100, Math.round((elapsed / durationSeconds) * 100))
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className={`${styles.player} ${playing ? styles.playing : ''}`} onClick={toggle}>
      <div className={styles.overlay}>
        <button className={styles.playBtn} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
              <rect x="3" y="2" width="4" height="14" rx="1" />
              <rect x="11" y="2" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
              <path d="M5 3l11 6-11 6V3z" />
            </svg>
          )}
        </button>
        <div className={styles.meta}>
          <div className={styles.videoLabel}>{label}</div>
          <div className={styles.timer}>{fmt(elapsed)} / {fmt(durationSeconds)}</div>
        </div>
      </div>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
