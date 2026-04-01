'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const router = useRouter()
  const { user, loading, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <Link href="/" className={styles.logo}>
          AcadHub
        </Link>
      </div>

      <div className={styles.navRight}>
        {!loading && (
          user ? (
            <>
              <Link href="/analytics" className={styles.navLink}>Analytics</Link>
              <button onClick={handleLogout} className={styles.logoutBtnNav}>Logout</button>
              <Link href="/profile" className={styles.profileBtn}>
                {user.name.charAt(0).toUpperCase()}
              </Link>
            </>
          ) : (
            <Link href="/login" className={styles.loginBtn}>Sign In</Link>
          )
        )}
      </div>
    </nav>
  )
}
