export function getOrCreateUserId(): string {
  if (typeof window === 'undefined') return 'server'
  let id = localStorage.getItem('lf_user_id')
  if (!id) {
    id = 'u_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
    localStorage.setItem('lf_user_id', id)
  }
  return id
}
