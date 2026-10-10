/** True for normal web image links (any host — Supabase, Cloudflare, your domain, etc.). */
export function isPublicImageUrl(url: string): boolean {
  const t = url.trim()
  return t.startsWith('https://') || t.startsWith('http://')
}

export function normalizeImageUrlInput(url: string): string {
  return url.trim()
}
