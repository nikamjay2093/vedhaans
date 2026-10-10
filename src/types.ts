export interface Product {
  id: string
  name: string
  category: string
  description: string
  origin: string
  grade: string
  unit: string
  minOrder: string
  image: string
  inStock: boolean
  featured?: boolean
}

export interface Enquiry {
  id: string
  productId: string
  productName: string
  name: string
  email: string
  phone: string
  company?: string
  quantity: string
  message: string
  createdAt: string
}

export interface CategoryMeta {
  id: string
  label: string
  tagline: string
  heroImage: string
}

export type HeroAnimation = 'float' | 'grain' | 'wave' | 'ember'

export type HeroBackgroundMode = 'plain' | 'color' | 'image'

export interface HeroSlide {
  id: string
  title: string
  subtitle: string
  image: string
  accent: string
  animation: HeroAnimation
  backgroundMode: HeroBackgroundMode
  backgroundColor: string
  backgroundImage: string
}

export interface BrandVideo {
  id: string
  title: string
  caption: string
  embed: string
}

export type KolhapurMediaType = 'image' | 'video'

export interface KolhapurMediaSlide {
  id: string
  type: KolhapurMediaType
  /** Image URL/data URL, or YouTube embed URL when type is video */
  src: string
  caption: string
}

export interface KolhapurContent {
  eyebrow: string
  title: string
  intro: string
  bullets: string[]
  mediaSlides: KolhapurMediaSlide[]
}

export type AboutPillarIcon = 'sparkles' | 'map' | 'globe' | 'shield'

export interface AboutPillar {
  id: string
  title: string
  body: string
  icon: AboutPillarIcon
}

/** Homepage “Why buyers choose Vedhaans” block (navbar: About Us) */
export interface AboutSection {
  eyebrow: string
  title: string
  pillars: AboutPillar[]
}

export interface SiteContact {
  address: string
  phone: string
  email: string
  /** Short blurb under logo in footer */
  footerAbout: string
  /** “Note” column in footer */
  footerNote: string
}

export interface SiteBranding {
  heroSlides: HeroSlide[]
  /** Hex color for homepage banner headline, subtitle, and links */
  heroTextColor: string
  kolhapur: KolhapurContent
  about: AboutSection
  contact: SiteContact
  videos: BrandVideo[]
  categoryImages: Record<string, string>
}
