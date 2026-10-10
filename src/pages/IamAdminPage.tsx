import { useEffect, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { AdminLoginPage } from './AdminLoginPage'
import { AdminPage } from './AdminPage'
import { clearAdminSession, hydrateAdminSession, isAdminAuthenticated } from '../utils/adminAuth'

export function IamAdminPage() {
  const { migrateLocalToCloudIfEmpty, usesCloudStore } = useStore()
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

  const onAdminLogin = () => {
    setAuthed(true)
    if (usesCloudStore) {
      void migrateLocalToCloudIfEmpty()
    }
  }

  if (!authed) {
    return <AdminLoginPage onSuccess={onAdminLogin} />
  }

  return <AdminPage onLogout={logout} />
}
