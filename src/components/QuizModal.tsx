'use client'
import { useState } from 'react'
import { chapterQuizzes, Question } from '@/lib/quizzes'
import styles from './QuizModal.module.css'

interface Props {
  contentId: string
  chapterTitle: string
  onClose: () => void
}

type Phase = 'quiz' | 'result'

export default function QuizModal({ contentId, chapterTitle, onClose }: Props) {
  const questions: Question[] = chapterQuizzes[contentId] || []
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null))
  const [phase, setPhase] = useState<Phase>('quiz')
  const [showExplanation, setShowExplanation] = useState(false)

  if (questions.length === 0) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
          <div className={styles.empty}>No quiz available for this chapter yet.</div>
          <button className={styles.closeBtn} onClick={onClose}>Close</button>
        </div>
      </div>
    )
  }

  const q = questions[current]
  const isAnswered = selected !== null
  const isCorrect = selected === q.answer
  const score = answers.filter((a, i) => a === questions[i].answer).length

  const handleSelect = (idx: number) => {
    if (selected !== null) return
    setSelected(idx)
    const next = [...answers]
    next[current] = idx
    setAnswers(next)
    setShowExplanation(true)
  }

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1)
      setSelected(answers[current + 1])
      setShowExplanation(answers[current + 1] !== null)
    } else {
      setPhase('result')
    }
  }

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1)
      setSelected(answers[current - 1])
      setShowExplanation(answers[current - 1] !== null)
    }
  }

  const handleRestart = () => {
    setCurrent(0)
    setSelected(null)
    setAnswers(Array(questions.length).fill(null))
    setPhase('quiz')
    setShowExplanation(false)
  }

  const pct = Math.round((score / questions.length) * 100)
  const grade = pct >= 80 ? 'Excellent' : pct >= 60 ? 'Good' : 'Keep practising'

  if (phase === 'result') {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
          <div className={styles.resultHeader}>
            <div className={styles.scoreCircle} data-grade={pct >= 80 ? 'good' : pct >= 60 ? 'ok' : 'low'}>
              {pct}%
            </div>
            <h2 className={styles.resultTitle}>{grade}</h2>
            <p className={styles.resultSub}>{score} of {questions.length} correct</p>
          </div>

          <div className={styles.resultBreakdown}>
            {questions.map((question, i) => {
              const userAnswer = answers[i]
              const correct = userAnswer === question.answer
              return (
                <div key={i} className={`${styles.resultRow} ${correct ? styles.resultCorrect : styles.resultWrong}`}>
                  <span className={styles.resultIcon}>{correct ? '✓' : '✗'}</span>
                  <span className={styles.resultQ}>{question.q}</span>
                </div>
              )
            })}
          </div>

          <div className={styles.resultActions}>
            <button className={styles.secondaryBtn} onClick={handleRestart}>Retake quiz</button>
            <button className={styles.primaryBtn} onClick={onClose}>Done</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.quizMeta}>
            <span className={styles.quizLabel}>Quiz · {chapterTitle}</span>
            <span className={styles.progress}>{current + 1} / {questions.length}</span>
          </div>
          <button className={styles.closeX} onClick={onClose}>✕</button>
        </div>

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${((current + (isAnswered ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>

        <div className={styles.questionText}>{q.q}</div>

        <div className={styles.options}>
          {q.options.map((opt, i) => {
            let state = ''
            if (isAnswered) {
              if (i === q.answer) state = styles.optionCorrect
              else if (i === selected) state = styles.optionWrong
              else state = styles.optionDimmed
            }
            return (
              <button
                key={i}
                className={`${styles.option} ${state}`}
                onClick={() => handleSelect(i)}
                disabled={isAnswered}
              >
                <span className={styles.optionLetter}>{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            )
          })}
        </div>

        {showExplanation && (
          <div className={`${styles.explanation} ${isCorrect ? styles.explanationCorrect : styles.explanationWrong}`}>
            <strong>{isCorrect ? '✓ Correct!' : '✗ Incorrect.'}</strong> {q.explanation}
          </div>
        )}

        <div className={styles.nav}>
          <button className={styles.secondaryBtn} onClick={handlePrev} disabled={current === 0}>
            ← Previous
          </button>
          <button
            className={styles.primaryBtn}
            onClick={handleNext}
            disabled={!isAnswered}
          >
            {current === questions.length - 1 ? 'See results' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}