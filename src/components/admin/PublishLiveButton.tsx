import { CloudUpload } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../../context/StoreContext'

export function PublishLiveButton({ className = '' }: { className?: string }) {
  const { publishSiteToCloud, usesCloudStore } = useStore()
  const [state, setState] = useState<'idle' | 'saving' | 'ok'>('idle')

  if (!usesCloudStore) return null

  const onClick = async () => {
    setState('saving')
    const ok = await publishSiteToCloud()
    setState(ok ? 'ok' : 'idle')
    if (ok) setTimeout(() => setState('idle'), 4000)
  }

  return (
    <button
      type="button"
      onClick={() => void onClick()}
      disabled={state === 'saving'}
      className={`inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60 sm:px-4 ${className}`}
    >
      <CloudUpload className="h-4 w-4 shrink-0" />
      <span className="whitespace-nowrap">
        {state === 'saving' ? 'Publishing…' : state === 'ok' ? 'Published ✓' : 'Publish to live site'}
      </span>
    </button>
  )
}
