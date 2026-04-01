'use client'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import styles from './Sidebar.module.css'
import { useState } from 'react'

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading, logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const isActive = (path: string) => pathname === path

  const menuSections = [
    {
      title: 'DASHBOARD',
      items: [
        { label: 'Dashboard', path: '/', icon: '🎯' }
      ]
    },
    {
      title: 'LEARNING',
      items: [
        { label: 'Books', path: '/books', icon: '📚' },
        { label: 'Analytics', path: '/analytics', icon: '📊' }
      ]
    },
    {
      title: 'SETTINGS',
      items: [
        { label: 'Profile', path: '/profile', icon: '👤' }
      ]
    }
  ]

  if (!user && !loading) {
    return null
  }

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logo}>AH</div>
          {!isCollapsed && <span className={styles.brandText}>AcadHub</span>}
        </div>
        <button 
          className={styles.collapseBtn}
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          «
        </button>
      </div>

      <nav className={styles.nav}>
        {menuSections.map((section) => (
          <div key={section.title} className={styles.navSection}>
            {!isCollapsed && <div className={styles.sectionTitle}>{section.title}</div>}
            <div className={styles.navItems}>
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`${styles.navItem} ${isActive(item.path) ? styles.active : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <span className={styles.icon}>{item.icon}</span>
                  {!isCollapsed && <span className={styles.label}>{item.label}</span>}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className={styles.footer}>
        {user && !isCollapsed && (
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>{user.name.charAt(0).toUpperCase()}</div>
            <span className={styles.userName}>{user.name}</span>
          </div>
        )}
        <button 
          onClick={handleLogout}
          className={styles.logoutBtn}
          title={isCollapsed ? 'Logout' : ''}
        >
          {!isCollapsed ? '→ Sign Out' : '←'}
        </button>
      </div>
    </aside>
  )
}
