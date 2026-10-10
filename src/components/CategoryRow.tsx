import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { CategoryMeta, Product } from '../types'
import { ProductCard } from './ProductCard'

interface CategoryRowProps {
  category: CategoryMeta
  products: Product[]
  onEnquire: (product: Product) => void
}

export function CategoryRow({ category, products, onEnquire }: CategoryRowProps) {
  const scroller = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)

  const scroll = (dir: number) => {
    scroller.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  const visible = expanded ? products : products

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-neutral-900 sm:text-3xl">
              {category.label}
            </h2>
            <p className="mt-1 max-w-xl text-sm text-neutral-600">{category.tagline}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scroll(-1)}
              className="p-2 text-neutral-500 hover:text-neutral-900"
              aria-label={`Scroll ${category.label} left`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              className="p-2 text-neutral-500 hover:text-neutral-900"
              aria-label={`Scroll ${category.label} right`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="ml-1 text-sm font-semibold text-neutral-800 underline-offset-4 hover:underline"
            >
              {expanded ? 'Show less' : 'Show all'}
            </button>
          </div>
        </div>

        {expanded ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((p) => (
              <div key={p.id} className="min-w-0 [&_article]:w-full">
                <ProductCard product={p} onEnquire={onEnquire} />
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={scroller}
            className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
          >
            {products.map((p) => (
              <div key={p.id} className="snap-start">
                <ProductCard product={p} onEnquire={onEnquire} />
              </div>
            ))}
          </div>
        )}

        <Link
          to={`/category/${category.id}`}
          className="mt-4 inline-block text-sm font-semibold text-neutral-700 underline-offset-4 hover:text-neutral-900 hover:underline"
        >
          View {category.label} page →
        </Link>
      </div>
    </section>
  )
}
