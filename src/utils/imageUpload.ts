const MAX_UPLOAD_BYTES = 10_000_000
/** Target max size per stored image (base64 in localStorage adds ~33% overhead). */
const TARGET_STORED_BYTES = 700_000
const MAX_DIMENSION = 1920
const MIN_DIMENSION = 720

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Could not read file.'))
    reader.readAsDataURL(file)
  })
}

function preservesTransparency(mime: string): boolean {
  return mime === 'image/png' || mime === 'image/webp'
}

export function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please choose an image file (JPG, PNG, WebP).'))
      return
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      reject(new Error('Image must be under 10 MB.'))
      return
    }
    if (preservesTransparency(file.type) && file.size <= TARGET_STORED_BYTES) {
      readFileAsDataUrl(file).then(resolve).catch(reject)
      return
    }
    compressImageFile(file).then(resolve).catch(reject)
  })
}

async function compressImageFile(file: File): Promise<string> {
  const keepAlpha = preservesTransparency(file.type)
  const outputMime = keepAlpha ? file.type : 'image/jpeg'
  const bitmap = await createImageBitmap(file)
  const width = bitmap.width
  const height = bitmap.height

  let dimension = Math.min(MAX_DIMENSION, Math.max(width, height))
  let quality = 0.86
  let dataUrl = ''

  const draw = (dim: number) => {
    const scale = dim / Math.max(width, height)
    const w = Math.max(1, Math.round(width * scale))
    const h = Math.max(1, Math.round(height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) throw new Error('Could not process image.')
    ctx.clearRect(0, 0, w, h)
    ctx.drawImage(bitmap, 0, 0, w, h)
    return keepAlpha
      ? canvas.toDataURL(outputMime)
      : canvas.toDataURL('image/jpeg', quality)
  }

  try {
    for (let attempt = 0; attempt < 14; attempt++) {
      dataUrl = draw(dimension)

      const approxBytes = Math.ceil((dataUrl.length * 3) / 4)
      if (approxBytes <= TARGET_STORED_BYTES) break

      if (!keepAlpha) {
        quality = Math.max(0.5, quality - 0.08)
      }
      dimension = Math.max(MIN_DIMENSION, Math.round(dimension * 0.85))
    }
  } finally {
    bitmap.close()
  }

  return dataUrl
}

/** Convert watch URL to embed URL when pasted from YouTube. */
export function normalizeYoutubeEmbed(url: string): string {
  const trimmed = url.trim()
  if (trimmed.includes('/embed/')) return trimmed
  const watch = trimmed.match(/[?&]v=([^&]+)/)
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`
  const short = trimmed.match(/youtu\.be\/([^?]+)/)
  if (short) return `https://www.youtube.com/embed/${short[1]}`
  return trimmed
}
