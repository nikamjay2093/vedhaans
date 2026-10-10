import { DEFAULT_BRANDING } from '../data/defaultBranding'
import { isBrokenImageUrl } from '../data/images'
import { normalizeImageUrlInput } from '../utils/imageUrl'
import { DEFAULT_HERO_SLIDE_BG } from '../data/heroSlideDefaults'
import type {
  AboutPillarIcon,
  AboutSection,
  CategoryMeta,
  HeroBackgroundMode,
  HeroSlide,
  KolhapurContent,
  KolhapurMediaSlide,
  SiteBranding,
  SiteContact,
} from '../types'

type StoredBranding = SiteBranding & {
  heroBackgroundMode?: HeroBackgroundMode
  heroBackgroundColor?: string
  heroBackgroundImage?: string
  kolhapurImage?: string
}

export function healBranding(b: SiteBranding, cats: CategoryMeta[]): SiteBranding {
  const d = DEFAULT_BRANDING
  const heal = (url: string, fallback: string) => {
    const normalized = normalizeImageUrlInput(url)
    if (!normalized) return fallback
    return isBrokenImageUrl(normalized) ? fallback : normalized
  }

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
