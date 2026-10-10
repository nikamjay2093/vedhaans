import { Wheat } from 'lucide-react'
import { useState } from 'react'

interface SafeImageProps {
  src: string
  alt: string
  className?: string
}

export function SafeImage({ src, alt, className = '' }: SafeImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-white ${className}`}
        role="img"
        aria-label={alt}
      >
        <Wheat className="h-12 w-12 text-neutral-300" strokeWidth={1.25} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}
