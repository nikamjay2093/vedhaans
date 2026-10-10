import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { useCategories } from '../hooks/useCategories'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ProductCard } from '../components/ProductCard'
import { EnquiryModal } from '../components/EnquiryModal'
import { SafeImage } from '../components/SafeImage'
import type { Product } from '../types'

export function CategoryPage() {
  const { id } = useParams<{ id: string }>()
  const { products } = useStore()
  const categories = useCategories()
  const [enquiryProduct, setEnquiryProduct] = useState<Product | null>(null)

  const category = categories.find((c) => c.id === id)
  const list = products.filter((p) => p.category === id)

  if (!category) {
    return (
      <div className="p-20 text-center bg-white">
        <p>Category not found.</p>
        <Link to="/">Home</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <header className="relative overflow-hidden bg-white pt-24 pb-12">
        <div className="absolute inset-0 flex items-center justify-center">
          <SafeImage
            src={category.heroImage}
            alt=""
            className="h-72 w-full max-w-5xl object-cover"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Link to="/#catalog" className="text-sm text-neutral-600 hover:text-neutral-900">
            ← Catalog
          </Link>
          <h1 className="mt-2 font-display text-4xl font-semibold text-neutral-900">{category.label}</h1>
          <p className="mt-2 max-w-xl text-neutral-600">{category.tagline}</p>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <div key={p.id} className="[&_article]:w-full">
              <ProductCard product={p} onEnquire={setEnquiryProduct} />
            </div>
          ))}
        </div>
      </main>
      <Footer />
      <EnquiryModal product={enquiryProduct} open={!!enquiryProduct} onClose={() => setEnquiryProduct(null)} />
    </div>
  )
}
