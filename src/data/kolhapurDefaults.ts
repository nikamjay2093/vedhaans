import type { KolhapurContent, KolhapurMediaSlide } from '../types'
import { img } from './images'

export const DEFAULT_KOLHAPUR_BULLETS = [
  'Alluvial soil from the Krishna and Panchganga valleys yields bold, uniform grain size.',
  'A semi-arid climate with controlled irrigation reduces fungal risk and preserves natural colour.',
  'Kolhapur’s historic mandi network means faster aggregation and grade consistency for export lots.',
  'Proximity to Goa and Mumbai ports shortens lead times for rice, wheat, and chili shipments.',
]

export const DEFAULT_KOLHAPUR: KolhapurContent = {
  eyebrow: 'Origin story',
  title: 'Why Kolhapur agriculture stands apart',
  intro:
    'Vedhaans is headquartered in Kolhapur — where farmers grow rice, jowar, chili, and pulses with practices refined over generations. We do not blend away origin; we celebrate it in every export certificate.',
  bullets: [...DEFAULT_KOLHAPUR_BULLETS],
  mediaSlides: [
    {
      id: 'kolhapur-1',
      type: 'image',
      src: img('farm', 900),
      caption: '',
    },
  ],
}

export function createKolhapurImageSlide(src = ''): KolhapurMediaSlide {
  return {
    id: `kolhapur-${crypto.randomUUID()}`,
    type: 'image',
    src,
    caption: '',
  }
}

export function createKolhapurVideoSlide(embed = ''): KolhapurMediaSlide {
  return {
    id: `kolhapur-${crypto.randomUUID()}`,
    type: 'video',
    src: embed,
    caption: '',
  }
}
