import Navbar from '@/components/Navbar'
import styles from '../books/layout.module.css'

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>{children}</main>
    </div>
  )
}
