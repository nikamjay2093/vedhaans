import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { img } from '../data/images'
import { uniqueCategoryId } from '../utils/categorySlug'
import { isSupabaseConfigured } from '../lib/supabase'
import { insertCloudEnquiry } from '../services/enquiryCloud'
import {
  fetchSiteContentRaw,
  isCloudContentEmpty,
  readLegacyLocalSnapshot,
  saveSiteContent,
  clearLegacyLocalStorage,
  type SiteContentSnapshot,
} from '../services/siteContentCloud'
import { setLocalStorage, StorageQuotaError } from '../utils/storage'
import { healBranding } from './brandingHeal'
import {
  defaultBranding,
  defaultCategories,
  defaultProducts,
  mergeSiteFromCloud,
} from './siteDataHelpers'
import { loadSiteFromCloud, useSiteContentRealtime } from '../hooks/useSiteContentSync'
import type { CategoryMeta, Enquiry, Product, SiteBranding } from '../types'

const STORAGE_PRODUCTS = 'vedhaans-products'
const STORAGE_ENQUIRIES = 'vedhaans-enquiries'
const STORAGE_BRANDING = 'vedhaans-branding'
const STORAGE_CATEGORIES = 'vedhaans-categories'

function loadCategoriesLocal(): CategoryMeta[] {
  try {
    const raw = localStorage.getItem(STORAGE_CATEGORIES)
    if (raw) {
      const parsed = JSON.parse(raw) as CategoryMeta[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        return mergeSiteFromCloud({ products: null, categories: parsed, branding: null })
          .categories
      }
    }
  } catch {
    /* ignore */
  }
  return defaultCategories()
}

function loadProductsLocal(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_PRODUCTS)
    if (raw) {
      return mergeSiteFromCloud({
        products: JSON.parse(raw) as Product[],
        categories: null,
        branding: null,
      }).products
    }
  } catch {
    /* ignore */
  }
  return defaultProducts()
}

function loadBrandingLocal(cats: CategoryMeta[]): SiteBranding {
  try {
    const raw = localStorage.getItem(STORAGE_BRANDING)
    if (raw) {
      return healBranding(JSON.parse(raw) as SiteBranding, cats)
    }
  } catch {
    /* ignore */
  }
  return defaultBranding(cats)
}

function loadEnquiriesLocal(): Enquiry[] {
  try {
    const raw = localStorage.getItem(STORAGE_ENQUIRIES)
    if (raw) return JSON.parse(raw) as Enquiry[]
  } catch {
    /* ignore */
  }
  return []
}

interface StoreContextValue {
  products: Product[]
  categories: CategoryMeta[]
  enquiries: Enquiry[]
  branding: SiteBranding
  storeReady: boolean
  usesCloudStore: boolean
  addCategory: (input: { label: string; tagline: string; pageBannerImage?: string }) => void
  updateCategory: (id: string, patch: Partial<Pick<CategoryMeta, 'label' | 'tagline'>>) => void
  removeCategory: (id: string) => boolean
  resetCategories: () => void
  addProduct: (p: Omit<Product, 'id'>) => void
  updateProduct: (id: string, patch: Partial<Product>) => void
  saveProduct: (product: Product) => void
  deleteProduct: (id: string) => void
  submitEnquiry: (e: Omit<Enquiry, 'id' | 'createdAt'>) => Promise<void>
  setBranding: (patch: Partial<SiteBranding>) => void
  resetBranding: () => void
  migrateLocalToCloudIfEmpty: () => Promise<void>
  publishSiteToCloud: () => Promise<boolean>
  storageError: string | null
  clearStorageError: () => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const usesCloudStore = isSupabaseConfigured()
  const initialCats = defaultCategories()

  const [storeReady, setStoreReady] = useState(!usesCloudStore)
  const [categories, setCategories] = useState<CategoryMeta[]>(() =>
    usesCloudStore ? initialCats : loadCategoriesLocal(),
  )
  const [products, setProducts] = useState<Product[]>(() =>
    usesCloudStore ? defaultProducts() : loadProductsLocal(),
  )
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() =>
    usesCloudStore ? [] : loadEnquiriesLocal(),
  )
  const [branding, setBrandingState] = useState<SiteBranding>(() =>
    usesCloudStore ? defaultBranding(initialCats) : loadBrandingLocal(loadCategoriesLocal()),
  )
  const [storageError, setStorageError] = useState<string | null>(null)

  const clearStorageError = useCallback(() => setStorageError(null), [])

  const applySnapshot = useCallback((snapshot: SiteContentSnapshot) => {
    setProducts(snapshot.products)
    setCategories(snapshot.categories)
    setBrandingState(snapshot.branding)
  }, [])

  useEffect(() => {
    if (!usesCloudStore) return
    void loadSiteFromCloud()
      .then(async (data) => {
        if (data) applySnapshot(data)
        const row = await fetchSiteContentRaw()
        if (!isCloudContentEmpty(row)) {
          clearLegacyLocalStorage()
        }
      })
      .finally(() => setStoreReady(true))
  }, [usesCloudStore, applySnapshot])

  useSiteContentRealtime(usesCloudStore && storeReady, applySnapshot)

  const persistSnapshot = useCallback(
    async (snapshot: SiteContentSnapshot) => {
      if (usesCloudStore) {
        try {
          await saveSiteContent(snapshot)
          applySnapshot(snapshot)
          setStorageError(null)
        } catch (e) {
          setStorageError(e instanceof Error ? e.message : 'Could not save to cloud.')
        }
        return
      }

      try {
        setLocalStorage(STORAGE_PRODUCTS, JSON.stringify(snapshot.products))
        setLocalStorage(STORAGE_CATEGORIES, JSON.stringify(snapshot.categories))
        setLocalStorage(STORAGE_BRANDING, JSON.stringify(snapshot.branding))
        applySnapshot(snapshot)
        setStorageError(null)
      } catch (e) {
        if (e instanceof StorageQuotaError) {
          setStorageError(e.message)
          return
        }
        throw e
      }
    },
    [usesCloudStore, applySnapshot],
  )

  const publishSiteToCloud = useCallback(async (): Promise<boolean> => {
    if (!usesCloudStore) {
      setStorageError('Supabase is not configured on this build.')
      return false
    }
    const snapshot: SiteContentSnapshot = { products, categories, branding }
    try {
      await saveSiteContent(snapshot)
      applySnapshot(snapshot)
      clearLegacyLocalStorage()
      setStorageError(null)
      return true
    } catch (e) {
      setStorageError(e instanceof Error ? e.message : 'Could not publish to live site.')
      return false
    }
  }, [usesCloudStore, products, categories, branding, applySnapshot])

  const migrateLocalToCloudIfEmpty = useCallback(async () => {
    if (!usesCloudStore) return
    try {
      const row = await fetchSiteContentRaw()
      if (!isCloudContentEmpty(row)) return
      const legacy = readLegacyLocalSnapshot()
      const snapshot: SiteContentSnapshot = {
        products:
          legacy?.products?.length ? legacy.products.map((p) => ({ ...p })) : products,
        categories:
          legacy?.categories?.length ? legacy.categories : categories,
        branding: legacy?.branding
          ? healBranding(legacy.branding, legacy.categories?.length ? legacy.categories : categories)
          : branding,
      }
      await saveSiteContent(snapshot)
      applySnapshot(snapshot)
      clearLegacyLocalStorage()
      setStorageError(null)
    } catch (e) {
      setStorageError(e instanceof Error ? e.message : 'Could not migrate local data.')
    }
  }, [usesCloudStore, products, categories, branding, applySnapshot])

  const addCategory = useCallback(
    (input: { label: string; tagline: string; pageBannerImage?: string }) => {
      const label = input.label.trim()
      if (!label) return
      const id = uniqueCategoryId(label, categories.map((c) => c.id))
      const heroImage = img('grains', 800)
      const pageBanner = input.pageBannerImage?.trim() || heroImage
      const cat: CategoryMeta = {
        id,
        label,
        tagline: input.tagline.trim(),
        heroImage,
      }
      const nextCategories = [...categories, cat]
      const nextBranding = {
        ...branding,
        categoryImages: { ...branding.categoryImages, [id]: pageBanner },
      }
      void persistSnapshot({
        products,
        categories: nextCategories,
        branding: nextBranding,
      })
    },
    [branding, categories, products, persistSnapshot],
  )

  const updateCategory = useCallback(
    (id: string, patch: Partial<Pick<CategoryMeta, 'label' | 'tagline'>>) => {
      void persistSnapshot({
        products,
        categories: categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        branding,
      })
    },
    [products, categories, branding, persistSnapshot],
  )

  const removeCategory = useCallback(
    (id: string): boolean => {
      if (categories.length <= 1) return false
      const inUse = products.some((p) => p.category === id)
      if (inUse) return false
      const nextCategories = categories.filter((c) => c.id !== id)
      const { [id]: _removed, ...restImages } = branding.categoryImages
      void persistSnapshot({
        products,
        categories: nextCategories,
        branding: { ...branding, categoryImages: restImages },
      })
      return true
    },
    [branding, categories, products, persistSnapshot],
  )

  const resetCategories = useCallback(() => {
    const nextCategories = defaultCategories()
    void persistSnapshot({
      products,
      categories: nextCategories,
      branding: {
        ...branding,
        categoryImages: { ...defaultBranding(nextCategories).categoryImages },
      },
    })
  }, [products, branding, persistSnapshot])

  const addProduct = useCallback(
    (p: Omit<Product, 'id'>) => {
      const id = `${p.category}-${Date.now()}`
      void persistSnapshot({
        products: [...products, { ...p, id }],
        categories,
        branding,
      })
    },
    [products, categories, branding, persistSnapshot],
  )

  const updateProduct = useCallback(
    (id: string, patch: Partial<Product>) => {
      void persistSnapshot({
        products: products.map((item) => (item.id === id ? { ...item, ...patch } : item)),
        categories,
        branding,
      })
    },
    [products, categories, branding, persistSnapshot],
  )

  const saveProduct = useCallback(
    (product: Product) => {
      const exists = products.some((p) => p.id === product.id)
      const nextProducts = exists
        ? products.map((p) => (p.id === product.id ? product : p))
        : [...products, product]
      void persistSnapshot({ products: nextProducts, categories, branding })
    },
    [products, categories, branding, persistSnapshot],
  )

  const deleteProduct = useCallback(
    (id: string) => {
      void persistSnapshot({
        products: products.filter((item) => item.id !== id),
        categories,
        branding,
      })
    },
    [products, categories, branding, persistSnapshot],
  )

  const submitEnquiry = useCallback(
    async (e: Omit<Enquiry, 'id' | 'createdAt'>) => {
      if (usesCloudStore) {
        await insertCloudEnquiry(e)
        return
      }
      const entry: Enquiry = {
        ...e,
        id: `enq-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      const next = [entry, ...enquiries]
      setEnquiries(next)
      localStorage.setItem(STORAGE_ENQUIRIES, JSON.stringify(next))
    },
    [usesCloudStore, enquiries],
  )

  const setBranding = useCallback(
    (patch: Partial<SiteBranding>) => {
      void persistSnapshot({
        products,
        categories,
        branding: { ...branding, ...patch },
      })
    },
    [products, categories, branding, persistSnapshot],
  )

  const resetBranding = useCallback(() => {
    void persistSnapshot({
      products,
      categories,
      branding: defaultBranding(categories),
    })
  }, [products, categories, persistSnapshot])

  const value = useMemo(
    () => ({
      products,
      categories,
      enquiries,
      branding,
      storeReady,
      usesCloudStore,
      addCategory,
      updateCategory,
      removeCategory,
      resetCategories,
      addProduct,
      updateProduct,
      saveProduct,
      deleteProduct,
      submitEnquiry,
      setBranding,
      resetBranding,
      migrateLocalToCloudIfEmpty,
      publishSiteToCloud,
      storageError,
      clearStorageError,
    }),
    [
      products,
      categories,
      enquiries,
      branding,
      storeReady,
      usesCloudStore,
      addCategory,
      updateCategory,
      removeCategory,
      resetCategories,
      addProduct,
      updateProduct,
      saveProduct,
      deleteProduct,
      submitEnquiry,
      setBranding,
      resetBranding,
      migrateLocalToCloudIfEmpty,
      publishSiteToCloud,
      storageError,
      clearStorageError,
    ],
  )

  if (!storeReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-sm text-neutral-600">
        Loading site…
      </div>
    )
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

export function emptyProductForm(defaultCategoryId = 'rice'): Omit<Product, 'id'> {
  return {
    name: '',
    category: defaultCategoryId,
    description: '',
    origin: 'Kolhapur',
    grade: 'A',
    unit: 'MT',
    minOrder: '10 MT',
    image: img('rice', 600),
    inStock: true,
    featured: false,
  }
}
