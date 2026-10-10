import { ImagePlus, Link2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useStore } from '../../context/StoreContext'
import { normalizeImageUrlInput } from '../../utils/imageUrl'
import { readImageFile } from '../../utils/imageUpload'
import { SafeImage } from '../SafeImage'

interface ImageFieldProps {
  label: string
  value: string
  onChange: (url: string) => void
  hint?: string
  previewClassName?: string
}

export function ImageField({
  label,
  value,
  onChange,
  hint,
  previewClassName = 'h-32 w-full',
}: ImageFieldProps) {
  const { usesCloudStore } = useStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'upload' | 'url'>(() =>
    usesCloudStore || value.startsWith('http') ? 'url' : 'upload',
  )

  useEffect(() => {
    if (usesCloudStore) setMode('url')
  }, [usesCloudStore])

  const onFile = async (file: File | undefined) => {
    if (!file) return
    setError(null)
    try {
      const dataUrl = await readImageFile(file)
      onChange(dataUrl)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    }
  }

  const applyUrl = (raw: string) => {
    onChange(normalizeImageUrlInput(raw))
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-neutral-700">{label}</span>
        <div className="flex gap-1 text-xs">
          {!usesCloudStore && (
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`rounded-md px-2 py-1 font-medium ${
                mode === 'upload' ? 'text-neutral-900 underline' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Upload
            </button>
          )}
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`rounded-md px-2 py-1 font-medium ${
              mode === 'url' ? 'text-neutral-900 underline' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            URL
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-neutral-50">
        <SafeImage src={value} alt="" className={`${previewClassName} object-cover`} />
      </div>

      {mode === 'upload' && !usesCloudStore ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-200 bg-white py-3 text-sm font-medium text-neutral-700 hover:border-neutral-400 hover:text-neutral-900"
        >
          <ImagePlus className="h-4 w-4" />
          Choose image from device
        </button>
      ) : (
        <div className="flex gap-2">
          <Link2 className="mt-2.5 h-4 w-4 shrink-0 text-neutral-400" />
          <input
            type="url"
            value={value.startsWith('data:') ? '' : value}
            placeholder="https://your-cdn.com/image.jpg"
            onChange={(e) => applyUrl(e.target.value)}
            onBlur={(e) => applyUrl(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
      {hint && <p className="text-xs text-neutral-500">{hint}</p>}
      <p className="text-xs text-neutral-500">
        {usesCloudStore
          ? 'Paste a public image link (https://… from Supabase Storage, Cloudflare, or any host). The same URL is saved for every visitor.'
          : 'PNG/WebP keep transparency. For the live site, use a public URL or enable Supabase in .env.'}
      </p>
      {usesCloudStore && value.startsWith('data:') && (
        <p className="text-xs text-amber-800" role="status">
          This image is embedded in the database. Prefer a public https URL so loads stay fast on mobile.
        </p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
