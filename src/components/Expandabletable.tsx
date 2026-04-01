'use client'
import { useState } from 'react'
import styles from './ExpandableTable.module.css'

interface Props {
  headers: string[]
  rows: React.ReactNode[]
  initialCount?: number
  step?: number
}

export default function ExpandableTable({ headers, rows, initialCount = 5, step = 5 }: Props) {
  const [visible, setVisible] = useState(initialCount)

  const showMore = () => setVisible(v => Math.min(v + step, rows.length))
  const showLess = () => setVisible(initialCount)

  const remaining = rows.length - visible

  return (
    <div>
      <table className={styles.table}>
        <thead>
          <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>{rows.slice(0, visible)}</tbody>
      </table>

      {(remaining > 0 || visible > initialCount) && (
        <div className={styles.controls}>
          {remaining > 0 && (
            <button className={styles.toggle} onClick={showMore}>
              ↓ Show {Math.min(step, remaining)} more row{Math.min(step, remaining) !== 1 ? 's' : ''}
            </button>
          )}
          {visible > initialCount && (
            <button className={styles.toggleSecondary} onClick={showLess}>
              ↑ Show less
            </button>
          )}
        </div>
      )}
    </div>
  )
}