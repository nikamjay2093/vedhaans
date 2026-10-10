import { useState } from 'react'
import { AdminLoginPage } from './AdminLoginPage'
import { AdminPage } from './AdminPage'
import { clearAdminSession, isAdminAuthenticated } from '../utils/adminAuth'

export function IamAdminPage() {
  const [authed, setAuthed] = useState(() => isAdminAuthenticated())

  const logout = () => {
    clearAdminSession()
    setAuthed(false)
  }

  if (!authed) {
    return <AdminLoginPage onSuccess={() => setAuthed(true)} />
  }

  return <AdminPage onLogout={logout} />
}
