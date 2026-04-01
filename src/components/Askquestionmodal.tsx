'use client'
import { useState } from 'react'
import styles from './Askquestionmodal.module.css'

interface Props {
  chapterTitle: string
  onClose: () => void
}

export default function AskQuestionModal({ chapterTitle, onClose }: Props) {
  const [question, setQuestion] = useState('')
  const [phase, setPhase] = useState<'input' | 'loading' | 'answered'>('input')
  const [answer, setAnswer] = useState('')

  const handleSubmit = async () => {
    if (!question.trim()) return
    setPhase('loading')

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterTitle,
          question,
        }),
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get answer')
      }
      
      setAnswer(data.answer)
      setPhase('answered')
    } catch (err: any) {
      setAnswer(err.message || 'Something went wrong. Please try again.')
      setPhase('answered')
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <div className={styles.header}>
          <div className={styles.meta}>
            <span className={styles.label}>Ask a Question</span>
            <span className={styles.chapter}>{chapterTitle}</span>
          </div>
          <button className={styles.closeX} onClick={onClose}>✕</button>
        </div>

        {phase === 'input' && (
          <>
            <textarea
              className={styles.textarea}
              placeholder="What would you like to know about this chapter?"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              rows={4}
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSubmit() }}
            />
            <div className={styles.footer}>
              <span className={styles.hint}>⌘ + Enter to submit</span>
              <div className={styles.actions}>
                <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                <button className={styles.submitBtn} onClick={handleSubmit} disabled={!question.trim()}>
                  Ask →
                </button>
              </div>
            </div>
          </>
        )}

        {phase === 'loading' && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <span>Thinking…</span>
          </div>
        )}

        {phase === 'answered' && (
          <>
            <div className={styles.questionBox}>
              <span className={styles.qLabel}>Your question</span>
              <p className={styles.qText}>{question}</p>
            </div>
            <div className={styles.answerBox}>
              <span className={styles.aLabel}>Answer</span>
              <p className={styles.aText}>{answer}</p>
            </div>
            <div className={styles.footer}>
              <button className={styles.cancelBtn} onClick={() => { setPhase('input'); setAnswer('') }}>
                Ask another
              </button>
              <button className={styles.submitBtn} onClick={onClose}>Done</button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}