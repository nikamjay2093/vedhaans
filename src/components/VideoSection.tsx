import { motion } from 'framer-motion'
import { useStore } from '../context/StoreContext'

export function VideoSection() {
  const { branding } = useStore()
  const videos = branding.videos
  return (
    <section id="videos" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-widest text-neutral-500">On the ground</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-neutral-900">See the harvest</h2>
          <p className="mt-3 text-neutral-600">
            Embedded videos give buyers a feel for quality handling — replace with your own Vedhaans
            footage when ready.
          </p>
        </div>
        <div className="grid gap-12 lg:grid-cols-2">
          {videos.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="aspect-video w-full overflow-hidden opacity-90">
                <iframe
                  title={v.title}
                  src={v.embed}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="mt-4">
                <h3 className="font-display text-xl font-semibold text-neutral-900">{v.title}</h3>
                <p className="mt-1 text-sm text-neutral-600">{v.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
