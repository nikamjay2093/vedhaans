/**
 * Product & farm imagery from Pexels (https://www.pexels.com/license/):
 * free for commercial use, no attribution required. Raw commodities only — no prepared dishes.
 */
const pexels = (id: number, width = 960) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`

export const BRAND_LOGO = '/vedhaans-logo.png'

export const IMAGES = {
  rice: pexels(4198141),
  riceRaw: pexels(4198018),
  wheat: pexels(4198570),
  wheatGrains: pexels(4198565),
  grains: pexels(4198020),
  millet: pexels(4751849),
  chili: pexels(4110254),
  pulses: pexels(2650053),
  spices: pexels(356040),
  spiceSeeds: pexels(731217),
  farm: pexels(2650063),
  sacks: pexels(4110251),
}

export function img(key: keyof typeof IMAGES, width = 960): string {
  return IMAGES[key].replace(/w=\d+/, `w=${width}`)
}

/** Legacy / broken URLs and old stock that showed prepared food. */
const DEPRECATED_FRAGMENTS = [
  'photo-1515543904373',
  'photo-1615485925510',
  'photo-1606914501449',
  'photo-1596040033229',
  'photo-1536304993881',
  'photo-1509440159596',
  'photo-1560493676',
  'photo-1542838132',
  'photo-1576045057995',
  'photo-1505576399279',
  'images.unsplash.com',
]

export function isBrokenImageUrl(url: string): boolean {
  return DEPRECATED_FRAGMENTS.some((frag) => url.includes(frag))
}
