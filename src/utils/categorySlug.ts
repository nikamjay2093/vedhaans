export function categorySlugFromLabel(label: string): string {
  const base = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return base || `category-${Date.now()}`
}

export function uniqueCategoryId(label: string, existingIds: string[]): string {
  let id = categorySlugFromLabel(label)
  if (!existingIds.includes(id)) return id
  let n = 2
  while (existingIds.includes(`${id}-${n}`)) n++
  return `${id}-${n}`
}
