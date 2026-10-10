import { CloudUpload } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../../context/StoreContext'

export function PublishLiveButton({ className = '' }: { className?: string }) {
  const { publishSiteToCloud, usesCloudStore } = useStore()
  const [state, setState] = useState<'idle' | 'saving' | 'ok'>('idle')

  const onClick = async () => {
    if (!usesCloudStore) return
    setState('saving')
    const ok = await publishSiteToCloud()
    setState(ok ? 'ok' : 'idle')
    if (ok) setTimeout(() => setState('idle'), 4000)
  }

  const label =
    state === 'saving'
      ? 'Publishing…'
      : state === 'ok'
        ? 'Published ✓'
        : 'Publish to live site'

  return (
    <button
      type="button"
      onClick={() => void onClick()}
      disabled={state === 'saving' || !usesCloudStore}
      title={
        usesCloudStore
          ? 'Save banners and catalog for all visitors'
          : 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Cloudflare → Variables, then Retry deployment'
      }
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold sm:px-4 ${
        usesCloudStore
          ? 'bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-60'
          : 'cursor-not-allowed border border-neutral-200 bg-neutral-100 text-neutral-500'
      } disabled:opacity-60 ${className}`}
    >
      <CloudUpload className="h-4 w-4 shrink-0" />
      <span className="whitespace-nowrap">{label}</span>
    </button>
  )
}
