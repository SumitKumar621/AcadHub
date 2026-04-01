'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { books } from '@/lib/content'
import styles from './dashboard.module.css'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedBookId, setExpandedBookId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalChapters = books.reduce((sum, book) => sum + book.chapters.length, 0)

  if (loading) {
    return <div className={styles.main} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p style={{ color: 'var(--ink-2)' }}>Loading...</p>
    </div>
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Welcome back! Here's what's happening today.</p>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Total Books</div>
              <div className={styles.statValue}>{books.length}</div>
              <div className={styles.statDesc}>Learning resources available</div>
            </div>
            <div className={`${styles.statIcon} ${styles.icon1}`}>📚</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Total Chapters</div>
              <div className={styles.statValue}>{totalChapters}</div>
              <div className={styles.statDesc}>Content to explore</div>
            </div>
            <div className={`${styles.statIcon} ${styles.icon2}`}>📝</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Your Progress</div>
              <div className={styles.statValue}>0%</div>
              <div className={styles.statDesc}>Chapters started</div>
            </div>
            <div className={`${styles.statIcon} ${styles.icon3}`}>✨</div>
          </div>
        </div>

        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search books by name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.bookGrid}>
          {filteredBooks.length > 0 ? (
            filteredBooks.map(book => {
              const isExpanded = expandedBookId === book.id;
              
              return (
                <div key={book.id} className={styles.bookCard}>
                  <div 
                    className={styles.bookCardHeader} 
                    onClick={() => setExpandedBookId(isExpanded ? null : book.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 className={styles.bookTitle}>{book.title}</h3>
                      <span style={{ fontSize: '1.2rem', color: 'var(--ink-2)' }}>
                        {isExpanded ? '−' : '+'}
                      </span>
                    </div>
                    <p className={styles.bookDesc}>{book.description}</p>
                  </div>
                  {isExpanded && (
                    <div className={styles.chapterList}>
                      {book.chapters.map(chapter => (
                        <Link
                          key={chapter.id}
                          href={`/books/${book.id}/${chapter.id}`}
                          className={styles.chapterLink}
                        >
                          <span className={styles.chapterOrder}>
                            {String(chapter.order).padStart(2, '0')}
                          </span>
                          <span className={styles.chapterTitle}>{chapter.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', color: 'var(--ink-2)' }}>
              No books found matching "{searchQuery}"
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
