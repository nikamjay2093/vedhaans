import { useMemo } from 'react'
import { useStore } from '../context/StoreContext'
import type { CategoryMeta } from '../types'

export function useCategories(): CategoryMeta[] {
  const { categories, branding } = useStore()
  return useMemo(
    () =>
      categories.map((cat) => ({
        ...cat,
        heroImage: branding.categoryImages[cat.id] ?? cat.heroImage,
      })),
    [categories, branding.categoryImages],
  )
}
