import { motion } from 'framer-motion'
import type { Product } from '../types'
import { SafeImage } from './SafeImage'

interface ProductCardProps {
  product: Product
  onEnquire: (product: Product) => void
}

export function ProductCard({ product, onEnquire }: ProductCardProps) {
  return (
    <motion.article
      layout
      className="flex w-[280px] shrink-0 flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white sm:w-[300px]"
      whileHover={{ y: -2 }}
    >
      <div className="relative h-44 overflow-hidden border-b border-neutral-100">
        <SafeImage
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        {!product.inStock && (
          <span className="absolute left-3 top-3 text-xs font-medium text-neutral-600">
            Await harvest
          </span>
        )}
        {product.featured && (
          <span className="absolute right-3 top-3 text-xs font-medium text-neutral-800">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
        <h3 className="font-display text-lg font-semibold text-neutral-900">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-neutral-500">{product.description}</p>
        <dl className="mt-3 grid grid-cols-2 gap-1 text-xs text-neutral-600">
          <div>
            <dt className="text-neutral-400">Grade</dt>
            <dd className="font-medium">{product.grade}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">MOQ</dt>
            <dd className="font-medium">{product.minOrder}</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={() => onEnquire(product)}
          className="mt-4 w-full py-2.5 text-left text-sm font-semibold text-neutral-900 underline-offset-4 hover:underline"
        >
          Enquire
        </button>
      </div>
    </motion.article>
  )
}
