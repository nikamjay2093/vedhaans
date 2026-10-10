import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { SafeImage } from './SafeImage'

const slideVariants = {
  float: {
    image: { scale: [1, 1.05, 1], rotate: [0, 0.3, 0] },
  },
  grain: {
    image: { scale: [1.03, 1, 1.03] },
  },
  wave: {
    image: { x: [0, -12, 0] },
  },
  ember: {
    image: { scale: [1, 1.04, 1] },
  },
}

export function HeroSlider() {
  const { branding } = useStore()
  const slides = branding.heroSlides
  const [index, setIndex] = useState(0)
  const safeIndex = slides.length ? index % slides.length : 0
  const slide = slides[safeIndex]
  if (!slide) return null
  const anim = slideVariants[slide.animation]

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length])
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + slides.length) % slides.length),
    [slides.length],
  )

  useEffect(() => {
    const t = setInterval(next, 7000)
    return () => clearInterval(t)
  }, [next])

  useEffect(() => {
    setIndex((i) => (slides.length ? i % slides.length : 0))
  }, [slides.length])

  const showBg =
    slide.backgroundMode === 'color' ||
    (slide.backgroundMode === 'image' && slide.backgroundImage)

  return (
    <section className="relative w-full overflow-hidden bg-white pt-20 pb-16 sm:pt-24 sm:pb-20">
      <AnimatePresence mode="wait">
        {showBg ? (
          <motion.div
            key={slide.id + '-bg'}
            className="hero-section-bg-fade pointer-events-none absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65 }}
            aria-hidden
          >
            {slide.backgroundMode === 'color' ? (
              <div className="h-full w-full" style={{ backgroundColor: slide.backgroundColor }} />
            ) : (
              <img
                src={slide.backgroundImage}
                alt=""
                className="h-full w-full object-cover object-center"
              />
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="relative z-10 mx-auto grid min-h-[min(78vh,780px)] max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + '-text'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5 }}
              className="max-w-xl text-left"
              style={{ color: branding.heroTextColor }}
            >
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] opacity-70">
                Vedhaans · Kolhapur
              </p>
              <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-[3.25rem]">
                {slide.title}
              </h1>
              <p className="mt-4 text-lg opacity-80">{slide.subtitle}</p>
              <div className="mt-8 flex flex-wrap gap-6">
                <a
                  href="#catalog"
                  className="text-sm font-semibold underline-offset-4 hover:underline"
                >
                  Browse catalog
                </a>
                <a
                  href="#enquire"
                  className="text-sm font-semibold opacity-75 underline-offset-4 hover:opacity-100 hover:underline"
                >
                  Send enquiry
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative flex min-h-[280px] items-center justify-center sm:min-h-[360px] lg:min-h-0 lg:justify-end">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              className="relative flex h-full w-full max-w-xl items-center justify-center lg:max-w-none lg:justify-end"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.55 }}
            >
              <motion.div
                className="relative h-[min(48vh,440px)] w-full max-w-lg sm:h-[min(54vh,500px)] lg:h-[min(68vh,640px)] lg:max-w-2xl"
                animate={anim.image}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <SafeImage
                  src={slide.image}
                  alt=""
                  className="h-full w-full object-contain object-center lg:object-right"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center sm:bottom-8">
          <div className="pointer-events-auto flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={prev}
              className="p-2 text-neutral-500 transition hover:text-neutral-900"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`rounded-full transition-all ${
                    i === safeIndex
                      ? 'h-1.5 w-8 bg-neutral-800'
                      : 'h-1.5 w-1.5 bg-neutral-300 hover:bg-neutral-400'
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
        </div>
      )}
    </section>
  )
}
