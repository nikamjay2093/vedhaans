import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { BrandLogo } from '../components/BrandLogo'
import { tryAdminLogin, usesCloudAdminAuth } from '../utils/adminAuth'

interface AdminLoginPageProps {
  onSuccess: () => void
}

export function AdminLoginPage({ onSuccess }: AdminLoginPageProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const cloudAuth = usesCloudAdminAuth()

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const ok = await tryAdminLogin(username, password)
    setLoading(false)
    if (ok) {
      onSuccess()
      return
    }
    setError(cloudAuth ? 'Invalid email or password.' : 'Invalid username or password.')
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16 sm:px-6">
        <Link to="/" className="mb-10 inline-flex justify-center">
          <BrandLogo
            className="h-10 w-auto object-contain"
            nameClassName="text-base font-bold lowercase text-neutral-900"
          />
        </Link>
        <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
          <h1 className="font-display text-2xl font-semibold text-neutral-900">Sign in</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Vedhaans admin — staff only.
            {cloudAuth && ' Sign in with your Supabase admin email.'}
          </p>
          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block text-sm">
              <span className="font-medium text-neutral-700">{cloudAuth ? 'Email' : 'Username'}</span>
              <input
                type={cloudAuth ? 'email' : 'text'}
                name="username"
                autoComplete={cloudAuth ? 'email' : 'username'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-neutral-900 outline-none focus:border-neutral-400"
                required
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-neutral-700">Password</span>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-neutral-900 outline-none focus:border-neutral-400"
                required
              />
            </label>
            {error && (
              <p className="text-sm text-red-700" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-neutral-900 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Continue'}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-neutral-500">
          <Link to="/" className="font-medium text-neutral-700 hover:text-neutral-900">
            ← Back to storefront
          </Link>
        </p>
      </div>
    </div>
  )
}
