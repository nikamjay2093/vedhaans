import { useState } from 'react'
import { BrandPillars } from '../components/BrandPillars'
import { CategoryRow } from '../components/CategoryRow'
import { EnquiryModal } from '../components/EnquiryModal'
import { Footer } from '../components/Footer'
import { GeneralEnquiry } from '../components/GeneralEnquiry'
import { HeroSlider } from '../components/HeroSlider'
import { KolhapurSection } from '../components/KolhapurSection'
import { Navbar } from '../components/Navbar'
import { VideoSection } from '../components/VideoSection'
import { useStore } from '../context/StoreContext'
import { useCategories } from '../hooks/useCategories'
import type { Product } from '../types'

export function HomePage() {
  const { products } = useStore()
  const categories = useCategories()
  const [enquiryProduct, setEnquiryProduct] = useState<Product | null>(null)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSlider />
      <BrandPillars />
      <KolhapurSection />
      <section id="catalog" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
          <p className="text-sm font-medium uppercase tracking-widest text-neutral-500">Catalog</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-neutral-900 sm:text-4xl">
            Agriculture products by category
          </h2>
          <p className="mt-3 max-w-2xl text-neutral-600">
            Slide through each line — rice, wheat, grains, chili, pulses, and spices. Tap Enquire on any
            SKU; inventory updates from Admin reflect here instantly.
          </p>
        </div>
        {categories.map((cat) => (
          <CategoryRow
            key={cat.id}
            category={cat}
            products={products.filter((p) => p.category === cat.id)}
            onEnquire={setEnquiryProduct}
          />
        ))}
      </section>
      <VideoSection />
      <GeneralEnquiry />
      <Footer />
      <EnquiryModal
        product={enquiryProduct}
        open={!!enquiryProduct}
        onClose={() => setEnquiryProduct(null)}
      />
    </div>
  )
}
