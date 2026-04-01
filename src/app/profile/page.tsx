'use client'
import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import Link from 'next/link'
import styles from './profile.module.css'

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function daysSince(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading, logout, refresh } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user])

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
      </div>
    )
  }

  if (!user) return null

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const body: any = {}
      if (name !== user.name) body.name = name
      if (email !== user.email) body.email = email
      if (newPassword) {
        body.currentPassword = currentPassword
        body.newPassword = newPassword
      }

      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (res.ok) {
        setSuccess('Profile updated successfully!')
        setCurrentPassword('')
        setNewPassword('')
        await refresh()
      } else {
        setError(data.error || 'Failed to update')
      }
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const memberDays = daysSince(user.created_at)

  return (
    <main className={styles.main}>
      <Link href="/" className={styles.backLink}>
        ← Back to Dashboard
      </Link>

      <div className={styles.header}>
          <div className={styles.avatarLarge}>
            {getInitials(user.name)}
          </div>
          <div className={styles.headerInfo}>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            <div className={styles.memberBadge}>
              ✦ Member since {formatDate(user.created_at)}
            </div>
          </div>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{memberDays}</div>
            <div className={styles.statLabel}>Days Active</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {typeof window !== 'undefined'
                ? Object.keys(localStorage).filter(k => k.startsWith('lf_btn_') && localStorage.getItem(k) === 'true').length
                : 0}
            </div>
            <div className={styles.statLabel}>Chapters Done</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>∞</div>
            <div className={styles.statLabel}>Potential</div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Personal Information</h2>
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}
          <form onSubmit={handleSave} className={styles.form}>
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="profile-name">Name</label>
                <input
                  id="profile-name"
                  type="text"
                  className={styles.input}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="profile-email">Email</label>
                <input
                  id="profile-email"
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <h2 className={styles.sectionTitle} style={{ marginTop: 12 }}>Change Password</h2>
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="profile-current-pw">Current Password</label>
                <input
                  id="profile-current-pw"
                  type="password"
                  className={styles.input}
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="profile-new-pw">New Password</label>
                <input
                  id="profile-new-pw"
                  type="password"
                  className={styles.input}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Account</h2>
          <div className={styles.dangerZone}>
            <h3>Sign Out</h3>
            <p>You'll need to sign in again to access your profile and track progress.</p>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Sign Out
            </button>
          </div>
        </div>
    </main>
  )
}
