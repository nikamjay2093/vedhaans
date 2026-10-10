import { getSupabase } from '../lib/supabase'
import type { CategoryMeta, Product, SiteBranding } from '../types'

export const SITE_CONTENT_ID = 'main'

export type SiteContentSnapshot = {
  products: Product[]
  categories: CategoryMeta[]
  branding: SiteBranding
}

type SiteContentRow = {
  id: string
  products: Product[] | null
  categories: CategoryMeta[] | null
  branding: SiteBranding | null
  updated_at: string
}

export async function fetchSiteContentRaw(): Promise<SiteContentRow | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('id', SITE_CONTENT_ID)
    .maybeSingle()

  if (error) throw error
  return data as SiteContentRow | null
}

export async function saveSiteContent(snapshot: SiteContentSnapshot): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase is not configured.')

  const { data: auth } = await supabase.auth.getSession()
  if (!auth.session) {
    throw new Error('Sign in at /iamadmin to save changes.')
  }

  const { error } = await supabase.from('site_content').upsert({
    id: SITE_CONTENT_ID,
    products: snapshot.products,
    categories: snapshot.categories,
    branding: snapshot.branding,
    updated_at: new Date().toISOString(),
  })

  if (error) throw error
}

const STORAGE_PRODUCTS = 'vedhaans-products'
const STORAGE_BRANDING = 'vedhaans-branding'
const STORAGE_CATEGORIES = 'vedhaans-categories'

/** One-time: push this browser’s old localStorage data to Supabase after admin login. */
export function readLegacyLocalSnapshot(): Partial<SiteContentSnapshot> | null {
  try {
    const productsRaw = localStorage.getItem(STORAGE_PRODUCTS)
    const categoriesRaw = localStorage.getItem(STORAGE_CATEGORIES)
    const brandingRaw = localStorage.getItem(STORAGE_BRANDING)
    if (!productsRaw && !categoriesRaw && !brandingRaw) return null

    const partial: Partial<SiteContentSnapshot> = {}
    if (productsRaw) partial.products = JSON.parse(productsRaw) as Product[]
    if (categoriesRaw) partial.categories = JSON.parse(categoriesRaw) as CategoryMeta[]
    if (brandingRaw) partial.branding = JSON.parse(brandingRaw) as SiteBranding
    return partial
  } catch {
    return null
  }
}

export function clearLegacyLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_PRODUCTS)
    localStorage.removeItem(STORAGE_BRANDING)
    localStorage.removeItem(STORAGE_CATEGORIES)
    localStorage.removeItem('vedhaans-enquiries')
  } catch {
    /* ignore */
  }
}

export function isCloudContentEmpty(row: SiteContentRow | null): boolean {
  if (!row) return true
  const emptyProducts = !row.products?.length
  const emptyCategories = !row.categories?.length
  const emptyBranding =
    !row.branding || (typeof row.branding === 'object' && Object.keys(row.branding).length === 0)
  return emptyProducts && emptyCategories && emptyBranding
}
