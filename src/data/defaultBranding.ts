import type { SiteBranding } from '../types'
import { DEFAULT_HERO_SLIDE_BG } from './heroSlideDefaults'
import { DEFAULT_ABOUT } from './aboutDefaults'
import { DEFAULT_CONTACT } from './contactDefaults'
import { DEFAULT_KOLHAPUR } from './kolhapurDefaults'
import { CATEGORIES, HERO_SLIDES } from './seed'

export const DEFAULT_VIDEOS = [
  {
    id: 'video-1',
    title: 'From field to sack',
    caption: 'Harvest rhythm in Maharashtra — sample B-roll for your brand film.',
    embed: 'https://www.youtube.com/embed/1jWCXrfWXiM',
  },
  {
    id: 'video-2',
    title: 'Rice & grain handling',
    caption: 'Modern storage meets traditional jute bagging.',
    embed: 'https://www.youtube.com/embed/LTUoyNGn5mM',
  },
]

const categoryImages = CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.id] = cat.heroImage
    return acc
  },
  {} as Record<string, string>,
)

export const DEFAULT_BRANDING: SiteBranding = {
  heroSlides: HERO_SLIDES.map((s) => ({ ...s, ...DEFAULT_HERO_SLIDE_BG })),
  heroTextColor: '#171717',
  kolhapur: {
    ...DEFAULT_KOLHAPUR,
    mediaSlides: DEFAULT_KOLHAPUR.mediaSlides.map((s) => ({ ...s })),
    bullets: [...DEFAULT_KOLHAPUR.bullets],
  },
  about: {
    ...DEFAULT_ABOUT,
    pillars: DEFAULT_ABOUT.pillars.map((p) => ({ ...p })),
  },
  contact: { ...DEFAULT_CONTACT },
  videos: DEFAULT_VIDEOS.map((v) => ({ ...v })),
  categoryImages,
}
