import type { HeroSlide } from '../types'

export const DEFAULT_HERO_SLIDE_BG = {
  backgroundMode: 'plain' as const,
  backgroundColor: '#ffffff',
  backgroundImage: '',
}

export function createHeroSlide(partial?: Partial<HeroSlide>): HeroSlide {
  return {
    id: `slide-${crypto.randomUUID()}`,
    title: 'New banner',
    subtitle: 'Add a short line about this offer or harvest.',
    image: '',
    accent: '',
    animation: 'float',
    ...DEFAULT_HERO_SLIDE_BG,
    ...partial,
  }
}
