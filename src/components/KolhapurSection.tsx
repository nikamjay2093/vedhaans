import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { normalizeYoutubeEmbed } from '../utils/imageUpload'
import { SafeImage } from './SafeImage'

export function KolhapurSection() {
  const { branding } = useStore()
  const { kolhapur } = branding
  const slides = kolhapur.mediaSlides
  const [index, setIndex] = useState(0)
  const safeIndex = slides.length ? index % slides.length : 0
  const slide = slides[safeIndex]

  const next = useCallback(
    () => setIndex((i) => (slides.length ? (i + 1) % slides.length : 0)),
    [slides.length],
  )
  const prev = useCallback(
    () => setIndex((i) => (slides.length ? (i - 1 + slides.length) % slides.length : 0)),
    [slides.length],
  )

  useEffect(() => {
    setIndex((i) => (slides.length ? i % slides.length : 0))
  }, [slides.length])

  useEffect(() => {
    if (slides.length <= 1) return
    const t = setInterval(next, 8000)
    return () => clearInterval(t)
  }, [next, slides.length])

  const embedUrl =
    slide?.type === 'video' && slide.src ? normalizeYoutubeEmbed(slide.src) : ''

  return (
    <section id="kolhapur" className="bg-white py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 sm:gap-12 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative w-full"
        >
          {slide ? (
            <>
              <div className="relative flex h-[min(420px,55vh)] w-full items-center justify-center overflow-hidden rounded-lg bg-neutral-50">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slide.id}
                    className="absolute inset-0 flex items-center justify-center p-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45 }}
                  >
                    {slide.type === 'video' && embedUrl ? (
                      <iframe
                        title={slide.caption || 'Kolhapur video'}
                        src={embedUrl}
                        className="h-full w-full rounded-lg"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <SafeImage
                        src={slide.src}
                        alt={slide.caption || 'Kolhapur agriculture'}
                        className="max-h-full max-w-full object-contain"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              {slide.caption ? (
                <p className="mt-3 text-center text-sm text-neutral-600">{slide.caption}</p>
              ) : null}
              {slides.length > 1 && (
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={prev}
                    className="p-2 text-neutral-500 transition hover:text-neutral-900"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="flex gap-2">
                    {slides.map((s, i) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setIndex(i)}
                        className={`h-1.5 rounded-full bg-neutral-300 transition-all ${
                          i === safeIndex ? 'w-8 bg-neutral-800' : 'w-1.5'
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={next}
                    className="p-2 text-neutral-500 transition hover:text-neutral-900"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          ) : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full min-w-0"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-neutral-500">
            {kolhapur.eyebrow}
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-neutral-900 sm:text-4xl">
            {kolhapur.title}
          </h2>
          <p className="mt-4 leading-relaxed text-neutral-600">{kolhapur.intro}</p>
          <ul className="mt-8 space-y-4">
            {kolhapur.bullets.map((text, i) => (
              <motion.li
                key={`${i}-${text.slice(0, 24)}`}
                initial={{ opacity: 0, x: 8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="text-sm text-neutral-700"
              >
                {text}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
