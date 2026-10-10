import { DEFAULT_BRANDING } from '../data/defaultBranding'
import { isBrokenImageUrl } from '../data/images'
import { normalizeImageUrlInput } from '../utils/imageUrl'
import { CATEGORIES, INITIAL_PRODUCTS } from '../data/seed'
import { healBranding } from './brandingHeal'
import type { CategoryMeta, Product, SiteBranding } from '../types'

const seedById = new Map(INITIAL_PRODUCTS.map((p) => [p.id, p]))

export const DEFAULT_CATEGORIES: CategoryMeta[] = CATEGORIES.map((c) => ({ ...c }))

export function normalizeCategory(c: CategoryMeta, fallback: CategoryMeta): CategoryMeta {
  return {
    ...fallback,
    ...c,
    id: String(c.id || fallback.id),
    label: (c.label ?? fallback.label).trim() || fallback.label,
    tagline: c.tagline ?? fallback.tagline,
    heroImage: isBrokenImageUrl(c.heroImage) ? fallback.heroImage : c.heroImage,
  }
}

export function healProduct(p: Product): Product {
  const image = normalizeImageUrlInput(p.image)
  if (image && !isBrokenImageUrl(image)) return { ...p, image }
  const seed = seedById.get(p.id)
  if (seed) return { ...p, image: seed.image }
  return { ...p, image }
}

export function defaultProducts(): Product[] {
  return INITIAL_PRODUCTS.map((p) => ({ ...p }))
}

export function defaultCategories(): CategoryMeta[] {
  return DEFAULT_CATEGORIES.map((c) => ({ ...c }))
}

export function defaultBranding(cats: CategoryMeta[]): SiteBranding {
  return healBranding(DEFAULT_BRANDING, cats)
}

export function mergeSiteFromCloud(
  row: {
    products: Product[] | null
    categories: CategoryMeta[] | null
    branding: SiteBranding | null
  } | null,
): { products: Product[]; categories: CategoryMeta[]; branding: SiteBranding } {
  let categories = defaultCategories()
  if (row?.categories?.length) {
    categories = row.categories.map((c, i) =>
      normalizeCategory(c, categories[i] ?? categories[0]),
    )
  }

  let products = defaultProducts()
  if (row?.products?.length) {
    products = row.products.map(healProduct)
  }

  const branding = healBranding(
    row?.branding && Object.keys(row.branding).length > 0 ? row.branding : DEFAULT_BRANDING,
    categories,
  )

  return { products, categories, branding }
}
