'use client'
import { useState, useEffect } from 'react'
import { getOrCreateUserId } from '@/lib/session'
import { chapterNotes } from '@/lib/notes'
import QuizModal from './QuizModal'
import AskQuestionModal from './Askquestionmodal'
import styles from './ActionButton.module.css'

interface Props {
  label: string
  contentId: string
  chapterTitle?: string
}

const ICONS: Record<string, string> = {
  'Mark as Complete': '✓',
  'Take Quiz': '◎',
  'Download Notes': '↓',
  'Ask a Question': '?',
  'Bookmark': '◆',
}

function storageKey(contentId: string, label: string) {
  return `lf_btn_${contentId}_${label.replace(/\s+/g, '_')}`
}

function downloadAsPdf(title: string, markdownContent: string) {
  const html = markdownContent
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/^\| (.+) \|$/gm, (_, row) => {
      const cells = row.split(' | ').map((c: string) => `<td>${c}</td>`).join('')
      return `<tr>${cells}</tr>`
    })
    .replace(/^(\|[-| ]+\|)$/gm, '')
    .replace(/(<tr>[\s\S]*?<\/tr>\n?)+/g, m => `<table>${m}</table>`)
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    .replace(/\n\n/g, '</p><p>')

  const printWindow = window.open('', '_blank')
  if (!printWindow) { alert('Please allow popups to download the PDF.'); return }
  printWindow.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title>
  <style>
    body { font-family: Georgia, serif; font-size: 13px; line-height: 1.7; color: #1a1714; max-width: 680px; margin: 0 auto; padding: 48px 40px; }
    h1 { font-size: 26px; border-bottom: 2px solid #1a1714; padding-bottom: 10px; margin-bottom: 24px; }
    h2 { font-size: 17px; margin-top: 28px; margin-bottom: 10px; }
    h3 { font-size: 14px; color: #2d5a3d; margin-top: 18px; margin-bottom: 8px; }
    p { margin-bottom: 10px; color: #4a4540; }
    ul { margin: 8px 0 12px 20px; } li { margin-bottom: 4px; color: #4a4540; }
    code { font-family: monospace; font-size: 12px; background: #f0ede8; padding: 1px 5px; border-radius: 3px; color: #2d5a3d; }
    pre { background: #1a1714; color: #f0ede8; padding: 16px; border-radius: 6px; margin: 12px 0; }
    pre code { background: none; color: #f0ede8; padding: 0; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 12px; }
    td { padding: 7px 12px; border: 1px solid #e2ddd6; }
    tr:first-child td { background: #f0ede8; font-weight: 700; }
    .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #e2ddd6; font-size: 11px; color: #8a837a; }
    @media print { @page { margin: 2cm; } }
  </style></head><body>
  ${html}
  <div class="footer">AcadHub · ${title} · ${new Date().toLocaleDateString()}</div>
  <script>window.onload = function() { window.print(); window.onafterprint = function() { window.close() } }<\/script>
  </body></html>`)
  printWindow.document.close()
}

// Buttons that should toggle and persist state
const PERSISTENT_BUTTONS = ['Mark as Complete', 'Bookmark']

export default function ActionButton({ label, contentId, chapterTitle }: Props) {
  const [active, setActive] = useState(false)
  const [flash, setFlash] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [showAsk, setShowAsk] = useState(false)

  const isPersistent = PERSISTENT_BUTTONS.includes(label)
  const isDownload = label === 'Download Notes'
  const isQuiz = label === 'Take Quiz'
  const isAsk = label === 'Ask a Question'

  // Rehydrate persistent state from localStorage
  useEffect(() => {
    if (!isPersistent) return
    const saved = localStorage.getItem(storageKey(contentId, label))
    if (saved === 'true') setActive(true)
  }, [contentId, label, isPersistent])

  const trackClick = () =>
    fetch('/api/analytics/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: getOrCreateUserId(),
        button_label: label,
        content_id: contentId,
      }),
    })

  const handleClick = async () => {
    if (isPersistent) {
      const next = !active
      setActive(next)
      localStorage.setItem(storageKey(contentId, label), String(next))
      await trackClick()
      return
    }

    if (isDownload) {
      const notes = chapterNotes[contentId]
      if (notes) downloadAsPdf(chapterTitle || contentId, notes)
      else alert('Notes not available for this chapter yet.')
      setFlash(true)
      setTimeout(() => setFlash(false), 1500)
      await trackClick()
      return
    }

    if (isQuiz) { setShowQuiz(true); return }
    if (isAsk)  { setShowAsk(true);  return }

    await trackClick()
  }

  const isHighlighted = (isPersistent && active) || (isDownload && flash)

  const getLabel = () => {
    if (label === 'Mark as Complete' && active) return 'Completed'
    if (label === 'Bookmark' && active) return 'Bookmarked'
    if (isDownload && flash) return 'Downloading...'
    return label
  }

  return (
    <>
      <button
        className={`${styles.btn} ${isHighlighted ? styles.active : ''}`}
        onClick={handleClick}
        title={label === 'Bookmark' ? (active ? 'Remove bookmark' : 'Bookmark this chapter') : undefined}
      >
        <span className={styles.icon}>{ICONS[label] ?? '·'}</span>
        {getLabel()}
      </button>

      {showQuiz && (
        <QuizModal
          contentId={contentId}
          chapterTitle={chapterTitle || ''}
          onClose={async () => { setShowQuiz(false); await trackClick() }}
        />
      )}

      {showAsk && (
        <AskQuestionModal
          chapterTitle={chapterTitle || ''}
          onClose={async () => { setShowAsk(false); await trackClick() }}
        />
      )}
    </>
  )
}