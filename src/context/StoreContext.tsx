import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DEFAULT_BRANDING } from '../data/defaultBranding'
import { img, isBrokenImageUrl } from '../data/images'
import { CATEGORIES, INITIAL_PRODUCTS } from '../data/seed'
import { uniqueCategoryId } from '../utils/categorySlug'
import { setLocalStorage, StorageQuotaError } from '../utils/storage'
import { DEFAULT_HERO_SLIDE_BG } from '../data/heroSlideDefaults'
import type {
  CategoryMeta,
  Enquiry,
  HeroBackgroundMode,
  HeroSlide,
  AboutPillarIcon,
  AboutSection,
  KolhapurContent,
  KolhapurMediaSlide,
  Product,
  SiteBranding,
  SiteContact,
} from '../types'

type StoredBranding = SiteBranding & {
  heroBackgroundMode?: HeroBackgroundMode
  heroBackgroundColor?: string
  heroBackgroundImage?: string
  kolhapurImage?: string
}

const seedById = new Map(INITIAL_PRODUCTS.map((p) => [p.id, p]))

const STORAGE_PRODUCTS = 'vedhaans-products'
const STORAGE_ENQUIRIES = 'vedhaans-enquiries'
const STORAGE_BRANDING = 'vedhaans-branding'
const STORAGE_CATEGORIES = 'vedhaans-categories'

const DEFAULT_CATEGORIES: CategoryMeta[] = CATEGORIES.map((c) => ({ ...c }))

function normalizeCategory(c: CategoryMeta, fallback: CategoryMeta): CategoryMeta {
  return {
    ...fallback,
    ...c,
    id: String(c.id || fallback.id),
    label: (c.label ?? fallback.label).trim() || fallback.label,
    tagline: c.tagline ?? fallback.tagline,
    heroImage: isBrokenImageUrl(c.heroImage) ? fallback.heroImage : c.heroImage,
  }
}

function loadCategories(): CategoryMeta[] {
  try {
    const raw = localStorage.getItem(STORAGE_CATEGORIES)
    if (raw) {
      const parsed = JSON.parse(raw) as CategoryMeta[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((c, i) =>
          normalizeCategory(c, DEFAULT_CATEGORIES[i] ?? DEFAULT_CATEGORIES[0]),
        )
      }
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_CATEGORIES.map((c) => ({ ...c }))
}

function healProduct(p: Product): Product {
  if (!isBrokenImageUrl(p.image)) return p
  const seed = seedById.get(p.id)
  if (seed) return { ...p, image: seed.image }
  return p
}

function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_PRODUCTS)
    if (raw) {
      return (JSON.parse(raw) as Product[]).map(healProduct)
    }
  } catch {
    /* ignore */
  }
  return INITIAL_PRODUCTS
}

function loadEnquiries(): Enquiry[] {
  try {
    const raw = localStorage.getItem(STORAGE_ENQUIRIES)
    if (raw) return JSON.parse(raw) as Enquiry[]
  } catch {
    /* ignore */
  }
  return []
}

function healBranding(b: SiteBranding, cats: CategoryMeta[]): SiteBranding {
  const d = DEFAULT_BRANDING
  const heal = (url: string, fallback: string) =>
    isBrokenImageUrl(url) ? fallback : url

  const heroTextColor =
    typeof b.heroTextColor === 'string' && /^#[0-9A-Fa-f]{6}$/.test(b.heroTextColor)
      ? b.heroTextColor
      : d.heroTextColor

  const stored = b as StoredBranding
  const legacyBg: Pick<HeroSlide, 'backgroundMode' | 'backgroundColor' | 'backgroundImage'> = {
    backgroundMode:
      stored.heroBackgroundMode === 'plain' ||
      stored.heroBackgroundMode === 'color' ||
      stored.heroBackgroundMode === 'image'
        ? stored.heroBackgroundMode
        : DEFAULT_HERO_SLIDE_BG.backgroundMode,
    backgroundColor:
      typeof stored.heroBackgroundColor === 'string' &&
      /^#[0-9A-Fa-f]{6}$/.test(stored.heroBackgroundColor)
        ? stored.heroBackgroundColor
        : DEFAULT_HERO_SLIDE_BG.backgroundColor,
    backgroundImage: stored.heroBackgroundImage ?? DEFAULT_HERO_SLIDE_BG.backgroundImage,
  }

  const normalizeSlide = (s: HeroSlide, i: number): HeroSlide => {
    const fb = d.heroSlides[i] ?? d.heroSlides[0]
    const mode = s.backgroundMode ?? legacyBg.backgroundMode
    const backgroundMode: HeroBackgroundMode =
      mode === 'plain' || mode === 'color' || mode === 'image' ? mode : 'plain'
    const backgroundColor =
      typeof s.backgroundColor === 'string' && /^#[0-9A-Fa-f]{6}$/.test(s.backgroundColor)
        ? s.backgroundColor
        : s.backgroundColor === undefined
          ? legacyBg.backgroundColor
          : fb.backgroundColor
    const backgroundImage = heal(
      s.backgroundImage ?? legacyBg.backgroundImage,
      fb.backgroundImage,
    )

    return {
      ...fb,
      ...s,
      image: heal(s.image, fb.image),
      backgroundMode,
      backgroundColor,
      backgroundImage,
    }
  }

  const slides = (b.heroSlides?.length ? b.heroSlides : d.heroSlides).map(normalizeSlide)

  const legacyKolhapurImage = stored.kolhapurImage

  const normalizeKolhapurMedia = (s: KolhapurMediaSlide, i: number): KolhapurMediaSlide => {
    const fb = d.kolhapur.mediaSlides[i] ?? d.kolhapur.mediaSlides[0]
    const type = s.type === 'video' || s.type === 'image' ? s.type : 'image'
    return {
      ...fb,
      ...s,
      type,
      caption: s.caption ?? '',
      src: type === 'image' ? heal(s.src ?? '', fb.src) : (s.src ?? fb.src),
    }
  }

  const healKolhapur = (): KolhapurContent => {
    if (b.kolhapur?.mediaSlides?.length) {
      const k = b.kolhapur
      return {
        eyebrow: k.eyebrow?.trim() || d.kolhapur.eyebrow,
        title: k.title?.trim() || d.kolhapur.title,
        intro: k.intro?.trim() || d.kolhapur.intro,
        bullets:
          k.bullets?.length && k.bullets.some((line) => line.trim())
            ? k.bullets
            : d.kolhapur.bullets,
        mediaSlides: k.mediaSlides.map(normalizeKolhapurMedia),
      }
    }

    const firstSrc = legacyKolhapurImage
      ? heal(legacyKolhapurImage, d.kolhapur.mediaSlides[0].src)
      : d.kolhapur.mediaSlides[0].src

    return {
      ...d.kolhapur,
      mediaSlides: [{ ...d.kolhapur.mediaSlides[0], src: firstSrc }],
    }
  }

  const contact: SiteContact = {
    address: b.contact?.address?.trim() || d.contact.address,
    phone: b.contact?.phone?.trim() || d.contact.phone,
    email: b.contact?.email?.trim() || d.contact.email,
    footerAbout: b.contact?.footerAbout?.trim() || d.contact.footerAbout,
    footerNote: b.contact?.footerNote?.trim() || d.contact.footerNote,
  }

  const aboutIcons: AboutPillarIcon[] = ['sparkles', 'map', 'globe', 'shield']
  const healAbout = (): AboutSection => {
    const source = b.about?.pillars?.length ? b.about : d.about
    const pillars = source.pillars.map((p, i) => {
      const fb = d.about.pillars[i] ?? d.about.pillars[0]
      const icon = aboutIcons.includes(p.icon as AboutPillarIcon)
        ? (p.icon as AboutPillarIcon)
        : fb.icon
      return {
        ...fb,
        ...p,
        id: p.id || fb.id,
        title: (p.title ?? fb.title).trim() || fb.title,
        body: p.body ?? fb.body,
        icon,
      }
    })
    return {
      eyebrow: b.about?.eyebrow?.trim() || d.about.eyebrow,
      title: b.about?.title?.trim() || d.about.title,
      pillars: pillars.length ? pillars : [...d.about.pillars],
    }
  }

  return {
    ...b,
    heroTextColor,
    heroSlides: slides,
    kolhapur: healKolhapur(),
    about: healAbout(),
    contact,
    categoryImages: Object.fromEntries(
      cats.map((cat) => [
        cat.id,
        heal(b.categoryImages?.[cat.id] ?? '', d.categoryImages[cat.id] ?? cat.heroImage),
      ]),
    ),
  }
}

function loadBranding(cats: CategoryMeta[]): SiteBranding {
  try {
    const raw = localStorage.getItem(STORAGE_BRANDING)
    if (raw) {
      return healBranding(JSON.parse(raw) as StoredBranding, cats)
    }
  } catch {
    /* ignore */
  }
  return healBranding(DEFAULT_BRANDING, cats)
}

interface StoreContextValue {
  products: Product[]
  categories: CategoryMeta[]
  enquiries: Enquiry[]
  branding: SiteBranding
  addCategory: (input: { label: string; tagline: string; pageBannerImage?: string }) => void
  updateCategory: (id: string, patch: Partial<Pick<CategoryMeta, 'label' | 'tagline'>>) => void
  removeCategory: (id: string) => boolean
  resetCategories: () => void
  addProduct: (p: Omit<Product, 'id'>) => void
  updateProduct: (id: string, patch: Partial<Product>) => void
  saveProduct: (product: Product) => void
  deleteProduct: (id: string) => void
  submitEnquiry: (e: Omit<Enquiry, 'id' | 'createdAt'>) => void
  setBranding: (patch: Partial<SiteBranding>) => void
  resetBranding: () => void
  storageError: string | null
  clearStorageError: () => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<CategoryMeta[]>(loadCategories)
  const [products, setProducts] = useState<Product[]>(loadProducts)
  const [enquiries, setEnquiries] = useState<Enquiry[]>(loadEnquiries)
  const [branding, setBrandingState] = useState<SiteBranding>(() =>
    loadBranding(loadCategories()),
  )
  const [storageError, setStorageError] = useState<string | null>(null)

  const clearStorageError = useCallback(() => setStorageError(null), [])

  const persistProducts = useCallback((next: Product[]) => {
    try {
      setLocalStorage(STORAGE_PRODUCTS, JSON.stringify(next))
      setProducts(next)
      setStorageError(null)
    } catch (e) {
      if (e instanceof StorageQuotaError) {
        setStorageError(e.message)
        return
      }
      throw e
    }
  }, [])

  const persistBranding = useCallback((next: SiteBranding) => {
    try {
      setLocalStorage(STORAGE_BRANDING, JSON.stringify(next))
      setBrandingState(next)
      setStorageError(null)
    } catch (e) {
      if (e instanceof StorageQuotaError) {
        setStorageError(e.message)
        return
      }
      throw e
    }
  }, [])

  const persistCategories = useCallback((next: CategoryMeta[]) => {
    try {
      setLocalStorage(STORAGE_CATEGORIES, JSON.stringify(next))
      setCategories(next)
      setStorageError(null)
    } catch (e) {
      if (e instanceof StorageQuotaError) {
        setStorageError(e.message)
        return
      }
      throw e
    }
  }, [])

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
      const next = [...categories, cat]
      persistCategories(next)
      persistBranding({
        ...branding,
        categoryImages: { ...branding.categoryImages, [id]: pageBanner },
      })
    },
    [branding, categories, persistBranding, persistCategories],
  )

  const updateCategory = useCallback(
    (id: string, patch: Partial<Pick<CategoryMeta, 'label' | 'tagline'>>) => {
      persistCategories(
        categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      )
    },
    [categories, persistCategories],
  )

  const removeCategory = useCallback(
    (id: string): boolean => {
      if (categories.length <= 1) return false
      const inUse = products.some((p) => p.category === id)
      if (inUse) return false
      const next = categories.filter((c) => c.id !== id)
      const { [id]: _removed, ...restImages } = branding.categoryImages
      persistCategories(next)
      persistBranding({ ...branding, categoryImages: restImages })
      return true
    },
    [branding, categories, persistCategories, persistBranding, products],
  )

  const resetCategories = useCallback(() => {
    const next = DEFAULT_CATEGORIES.map((c) => ({ ...c }))
    persistCategories(next)
    persistBranding({
      ...branding,
      categoryImages: { ...DEFAULT_BRANDING.categoryImages },
    })
  }, [branding, persistBranding, persistCategories])

  const addProduct = useCallback(
    (p: Omit<Product, 'id'>) => {
      const id = `${p.category}-${Date.now()}`
      persistProducts([...products, { ...p, id }])
    },
    [products, persistProducts],
  )

  const updateProduct = useCallback(
    (id: string, patch: Partial<Product>) => {
      persistProducts(
        products.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      )
    },
    [products, persistProducts],
  )

  const saveProduct = useCallback(
    (product: Product) => {
      const exists = products.some((p) => p.id === product.id)
      if (exists) {
        persistProducts(products.map((p) => (p.id === product.id ? product : p)))
      } else {
        persistProducts([...products, product])
      }
    },
    [products, persistProducts],
  )

  const deleteProduct = useCallback(
    (id: string) => {
      persistProducts(products.filter((item) => item.id !== id))
    },
    [products, persistProducts],
  )

  const submitEnquiry = useCallback(
    (e: Omit<Enquiry, 'id' | 'createdAt'>) => {
      const entry: Enquiry = {
        ...e,
        id: `enq-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      const next = [entry, ...enquiries]
      setEnquiries(next)
      localStorage.setItem(STORAGE_ENQUIRIES, JSON.stringify(next))
    },
    [enquiries],
  )

  const setBranding = useCallback(
    (patch: Partial<SiteBranding>) => {
      persistBranding({ ...branding, ...patch })
    },
    [branding, persistBranding],
  )

  const resetBranding = useCallback(() => {
    persistBranding(healBranding(DEFAULT_BRANDING, categories))
  }, [categories, persistBranding])

  const value = useMemo(
    () => ({
      products,
      categories,
      enquiries,
      branding,
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
      storageError,
      clearStorageError,
    }),
    [
      products,
      categories,
      enquiries,
      branding,
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
      storageError,
      clearStorageError,
    ],
  )

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
