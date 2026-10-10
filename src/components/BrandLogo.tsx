import { BRAND_LOGO } from '../data/images'

interface BrandLogoProps {
  className?: string
  showName?: boolean
  nameClassName?: string
}

export function BrandLogo({
  className = 'h-10 w-10 object-contain',
  showName = true,
  nameClassName = 'font-display text-2xl font-semibold tracking-tight text-grain-800',
}: BrandLogoProps) {
  return (
    <span className="inline-flex items-center gap-2.5 sm:gap-3">
      <img src={BRAND_LOGO} alt="" className={className} />
      {showName && <span className={nameClassName}>Vedhaans</span>}
    </span>
  )
}
