const SESSION_KEY = 'vedhaans-admin-session'

const ADMIN_USERNAME = 'root'
const ADMIN_PASSWORD = 'root'

export function isAdminAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

export function tryAdminLogin(username: string, password: string): boolean {
  const ok =
    username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD
  if (ok) {
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      return false
    }
  }
  return ok
}

export function clearAdminSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore */
  }
}
