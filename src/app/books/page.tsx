'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { useEffect } from 'react'
import { books } from '@/lib/content'
import styles from './page.module.css'

export default function BooksPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return <div className={styles.container} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      Loading...
    </div>
  }

  if (!user) return null
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Learning Books</h1>
      <p className={styles.subtitle}>Select a book to start learning</p>
      
      <div className={styles.booksGrid}>
        {books.map((book) => (
          <Link
            key={book.id}
            href={`/books/${book.id}`}
            className={styles.bookCard}
          >
            <div className={styles.bookHeader}>
              <h2 className={styles.bookTitle}>{book.title}</h2>
            </div>
            <p className={styles.bookDescription}>{book.description}</p>
            <div className={styles.bookMeta}>
              <span className={styles.chapterCount}>
                {book.chapters.length} chapters
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
