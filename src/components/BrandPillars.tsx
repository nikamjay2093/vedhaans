import { motion } from 'framer-motion'
import { Globe, MapPin, Shield, Sparkles } from 'lucide-react'
import { useStore } from '../context/StoreContext'

const icons = {
  sparkles: Sparkles,
  map: MapPin,
  globe: Globe,
  shield: Shield,
}

export function BrandPillars() {
  const { branding } = useStore()
  const { about } = branding

  return (
    <section id="about" className="scroll-mt-20 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-neutral-500">{about.eyebrow}</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-neutral-900 sm:text-4xl">
            {about.title}
          </h2>
        </div>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {about.pillars.map((pillar, i) => {
            const Icon = icons[pillar.icon]
            return (
              <motion.article
                key={pillar.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08 }}
                className="bg-white p-2"
              >
                <span className="inline-flex text-neutral-700">
                  <Icon className="h-6 w-6" strokeWidth={1.25} />
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold text-neutral-900">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{pillar.body}</p>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
