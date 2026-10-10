import type { AboutPillar, AboutSection } from '../types'
import { BRAND_PILLARS } from './seed'

export const DEFAULT_ABOUT: AboutSection = {
  eyebrow: 'Pure grain',
  title: 'Why buyers choose Vedhaans',
  pillars: BRAND_PILLARS.map((p, i) => ({
    id: `about-pillar-${i + 1}`,
    title: p.title,
    body: p.body,
    icon: p.icon as AboutPillar['icon'],
  })),
}

export function createAboutPillar(): AboutPillar {
  return {
    id: `about-pillar-${crypto.randomUUID()}`,
    title: 'New highlight',
    body: 'Describe a reason buyers trust Vedhaans.',
    icon: 'sparkles',
  }
}
