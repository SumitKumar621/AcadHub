'use client'
import { useEffect } from 'react'
import { getOrCreateUserId } from '@/lib/session'

export default function PageViewTracker({ contentId }: { contentId: string }) {
  useEffect(() => {
    fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: getOrCreateUserId(), content_id: contentId }),
    })
  }, [contentId])

  return null
}
