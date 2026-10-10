import { getSupabase, isSupabaseConfigured } from '../lib/supabase'

const SESSION_KEY = 'vedhaans-admin-session'

const ADMIN_USERNAME = 'root'
const ADMIN_PASSWORD = 'root'

export function usesCloudAdminAuth(): boolean {
  return isSupabaseConfigured()
}

export function isAdminAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

/** Restore admin UI after refresh when Supabase session is still valid. */
export async function hydrateAdminSession(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return isAdminAuthenticated()
  }
  const supabase = getSupabase()
  if (!supabase) return false
  const { data } = await supabase.auth.getSession()
  if (data.session) {
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      /* ignore */
    }
    return true
  }
  clearAdminSessionLocal()
  return false
}

export async function tryAdminLogin(username: string, password: string): Promise<boolean> {
  const supabase = getSupabase()
  if (supabase) {
    const email = username.trim()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return false
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      return false
    }
    return true
  }

  const ok = username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD
  if (ok) {
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      return false
    }
  }
  return ok
}

function clearAdminSessionLocal(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore */
  }
}

export async function clearAdminSession(): Promise<void> {
  clearAdminSessionLocal()
  const supabase = getSupabase()
  if (supabase) {
    await supabase.auth.signOut()
  }
}
