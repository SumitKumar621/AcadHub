import { notFound } from 'next/navigation'
import Link from 'next/link'
import { books } from '@/lib/content'
import VideoPlayer from '@/components/VideoPlayer'
import ActionButton from '@/components/ActionButton'
import PageViewTracker from '@/components/PageViewTracker'
import styles from './page.module.css'

interface Props {
  params: Promise<{ bookId: string; chapterId: string }>
}

export default async function ChapterPage({ params }: Props) {
  const { bookId, chapterId } = await params

  const book = books.find(b => b.id === bookId)
  if (!book) notFound()

  const chapter = book.chapters.find(c => c.id === chapterId)
  if (!chapter) notFound()

  const { content } = chapter
  const chapterIndex = book.chapters.indexOf(chapter)
  const prev = book.chapters[chapterIndex - 1]
  const next = book.chapters[chapterIndex + 1]

  return (
    <article className={styles.article}>
      <PageViewTracker contentId={chapter.id} />

      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Back to Dashboard
        </Link>
        <div className={styles.breadcrumb}>
          {book.title}
          <span className={styles.breadcrumbDot} />
          Chapter {String(chapter.order).padStart(2, '0')}
        </div>
        <h1 className={styles.title}>
          {chapter.title.split(' ').slice(0, -1).join(' ')}{' '}
          <span className={styles.titleItalic}>
            {chapter.title.split(' ').slice(-1)[0]}
          </span>
        </h1>
      </header>

      <section className={styles.videos}>
        <div className={styles.videosLabel}>Video lessons</div>
        {content.videos.map(v => (
          <VideoPlayer
            key={v.id}
            videoId={v.id}
            contentId={chapter.id}
            label={v.label}
            durationSeconds={v.durationSeconds}
          />
        ))}
      </section>

      <section className={styles.body}>
        {content.body.split('\n\n').map((para, i) => (
          <p
            key={i}
            className={styles.bodyPara}
            dangerouslySetInnerHTML={{
              __html: para.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'),
            }}
          />
        ))}
      </section>

      <section className={styles.actionsSection}>
        <div className={styles.actionsLabel}>Actions</div>
        <div className={styles.actionRow}>
          {content.buttons.map(b => (
            <ActionButton key={b} label={b} contentId={chapter.id} chapterTitle={chapter.title} />
          ))}
        </div>
      </section>

      <nav className={styles.pagination}>
        {prev ? (
          <a href={`/books/${book.id}/${prev.id}`} className={styles.navLink}>
            <span className={styles.navDir}>← Previous</span>
            <span className={styles.navTitle}>{prev.title}</span>
          </a>
        ) : <div />}
        {next ? (
          <a href={`/books/${book.id}/${next.id}`} className={`${styles.navLink} ${styles.navLinkRight}`}>
            <span className={styles.navDir}>Next →</span>
            <span className={styles.navTitle}>{next.title}</span>
          </a>
        ) : <div />}
      </nav>
    </article>
  )
}
