import Link from 'next/link'
import { notFound } from 'next/navigation'
import { books } from '@/lib/content'
import styles from './page.module.css'

interface Props {
  params: Promise<{ bookId: string }>
}

export default async function BookChaptersPage({ params }: Props) {
  const { bookId } = await params

  const book = books.find(b => b.id === bookId)
  if (!book) notFound()

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/books" className={styles.backLink}>
          ← Back to Books
        </Link>
        <h1 className={styles.title}>{book.title}</h1>
        <p className={styles.description}>{book.description}</p>
      </header>

      <section className={styles.chaptersSection}>
        <h2 className={styles.sectionTitle}>Chapters</h2>
        <div className={styles.chaptersList}>
          {book.chapters.map((chapter) => (
            <Link
              key={chapter.id}
              href={`/books/${book.id}/${chapter.id}`}
              className={styles.chapterCard}
            >
              <div className={styles.chapterNumber}>
                {String(chapter.order).padStart(2, '0')}
              </div>
              <div className={styles.chapterContent}>
                <h3 className={styles.chapterTitle}>{chapter.title}</h3>
                <div className={styles.chapterMeta}>
                  <span className={styles.videoCount}>
                    {chapter.content.videos.length} video{chapter.content.videos.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
