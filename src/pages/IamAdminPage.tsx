import { useEffect, useState } from 'react'
import { AdminLoginPage } from './AdminLoginPage'
import { AdminPage } from './AdminPage'
import { clearAdminSession, hydrateAdminSession, isAdminAuthenticated } from '../utils/adminAuth'

export function IamAdminPage() {
  const [authed, setAuthed] = useState(() => isAdminAuthenticated())
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    void hydrateAdminSession().then((ok) => {
      setAuthed(ok)
      setChecking(false)
    })
  }, [])

  const logout = () => {
    void clearAdminSession().then(() => setAuthed(false))
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-sm text-neutral-600">
        Loading…
      </div>
    )
  }

  if (!authed) {
    return <AdminLoginPage onSuccess={() => setAuthed(true)} />
  }

  return <AdminPage onLogout={logout} />
}
