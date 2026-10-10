import { Plus, RotateCcw, Trash2 } from 'lucide-react'
import { createAboutPillar } from '../../data/aboutDefaults'
import { createHeroSlide } from '../../data/heroSlideDefaults'
import {
  createKolhapurImageSlide,
  createKolhapurVideoSlide,
} from '../../data/kolhapurDefaults'
import { useStore } from '../../context/StoreContext'
import type {
  AboutPillar,
  AboutPillarIcon,
  HeroAnimation,
  HeroBackgroundMode,
  HeroSlide,
  KolhapurContent,
  KolhapurMediaSlide,
} from '../../types'
import { normalizeYoutubeEmbed } from '../../utils/imageUpload'
import { ImageField } from './ImageField'

const ANIMATIONS: HeroAnimation[] = ['float', 'grain', 'wave', 'ember']

const ABOUT_ICONS: { value: AboutPillarIcon; label: string }[] = [
  { value: 'sparkles', label: 'Sparkles' },
  { value: 'map', label: 'Map pin' },
  { value: 'globe', label: 'Globe' },
  { value: 'shield', label: 'Shield' },
]

const fieldClass =
  'mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-400'

export function BrandingPanel() {
  const { branding, setBranding, resetBranding, usesCloudStore } = useStore()

  const updateSlide = (id: string, patch: Partial<HeroSlide>) => {
    setBranding({
      heroSlides: branding.heroSlides.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    })
  }

  const addSlide = () => {
    setBranding({ heroSlides: [...branding.heroSlides, createHeroSlide()] })
  }

  const removeSlide = (id: string) => {
    if (branding.heroSlides.length <= 1) return
    setBranding({ heroSlides: branding.heroSlides.filter((s) => s.id !== id) })
  }

  const updateVideo = (id: string, patch: Partial<{ title: string; caption: string; embed: string }>) => {
    setBranding({
      videos: branding.videos.map((v) => (v.id === id ? { ...v, ...patch } : v)),
    })
  }

  const updateKolhapur = (patch: Partial<KolhapurContent>) => {
    setBranding({ kolhapur: { ...branding.kolhapur, ...patch } })
  }

  const updateKolhapurSlide = (id: string, patch: Partial<KolhapurMediaSlide>) => {
    updateKolhapur({
      mediaSlides: branding.kolhapur.mediaSlides.map((s) =>
        s.id === id ? { ...s, ...patch } : s,
      ),
    })
  }

  const removeKolhapurSlide = (id: string) => {
    if (branding.kolhapur.mediaSlides.length <= 1) return
    updateKolhapur({
      mediaSlides: branding.kolhapur.mediaSlides.filter((s) => s.id !== id),
    })
  }

  const updateAbout = (patch: Partial<typeof branding.about>) => {
    setBranding({ about: { ...branding.about, ...patch } })
  }

  const updateAboutPillar = (id: string, patch: Partial<AboutPillar>) => {
    updateAbout({
      pillars: branding.about.pillars.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })
  }

  const addAboutPillar = () => {
    updateAbout({ pillars: [...branding.about.pillars, createAboutPillar()] })
  }

  const removeAboutPillar = (id: string) => {
    if (branding.about.pillars.length <= 1) return
    updateAbout({ pillars: branding.about.pillars.filter((p) => p.id !== id) })
  }

  return (
    <div className="space-y-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-sm text-neutral-600">
          Homepage banners, About Us block, Kolhapur section, category headers, and embedded videos — saved to Supabase when configured (same for all visitors).
          Use raw commodity photos only (no prepared dishes).
        </p>
        <button
          type="button"
          onClick={resetBranding}
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 hover:text-neutral-900"
        >
          <RotateCcw className="h-4 w-4" />
          Reset to defaults
        </button>
      </div>
      {usesCloudStore ? (
        <p className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Paste public image URLs on each slide (URL tab — not beside every field as a separate
          publish). When done, use <strong>Publish to live site</strong> in the admin header (top
          right, all tabs).
        </p>
      ) : (
        <p className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
          <strong>Publish to live site</strong> is hidden because Supabase is not configured in
          this build. Add <code className="text-xs">VITE_SUPABASE_URL</code> and{' '}
          <code className="text-xs">VITE_SUPABASE_ANON_KEY</code> in Cloudflare Variables, then
          redeploy.
        </p>
      )}

      <section>
        <h2 className="font-display text-2xl font-semibold text-neutral-900">Hero banner slides</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Homepage carousel: copy on the left, image on the right (PNG with transparency works best).
        </p>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-neutral-100 pt-8">
          <label className="block text-sm">
            <span className="font-medium text-neutral-700">Banner text color (all slides)</span>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="color"
                value={branding.heroTextColor}
                onChange={(e) => setBranding({ heroTextColor: e.target.value })}
                className="h-10 w-14 cursor-pointer rounded-lg border border-neutral-200 bg-white p-1"
                aria-label="Banner text color"
              />
              <input
                type="text"
                value={branding.heroTextColor}
                onChange={(e) => {
                  const v = e.target.value
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) setBranding({ heroTextColor: v })
                }}
                onBlur={(e) => {
                  const v = e.target.value
                  if (!/^#[0-9A-Fa-f]{6}$/.test(v)) {
                    setBranding({ heroTextColor: branding.heroTextColor })
                  }
                }}
                className="w-28 rounded-lg border border-neutral-200 px-3 py-2 font-mono text-sm"
                spellCheck={false}
              />
            </div>
          </label>
          <button
            type="button"
            onClick={addSlide}
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 hover:underline"
          >
            <Plus className="h-4 w-4" />
            Add banner
          </button>
        </div>
        <div className="mt-10 space-y-12">
          {branding.heroSlides.map((slide, index) => (
            <div key={slide.id} className="border-t border-neutral-100 pt-10 first:border-t-0 first:pt-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
                  Banner {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeSlide(slide.id)}
                  disabled={branding.heroSlides.length <= 1}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
              <div className="mt-6 grid gap-8 lg:grid-cols-2">
                <ImageField
                  label="Hero image (right side) — use .png for transparent background"
                  value={slide.image}
                  onChange={(image) => updateSlide(slide.id, { image })}
                  previewClassName="h-36 w-full object-contain bg-neutral-50"
                />
                <div className="space-y-3 text-sm">
                  <label className="block">
                    <span className="font-medium text-neutral-700">Headline</span>
                    <input
                      value={slide.title}
                      onChange={(e) => updateSlide(slide.id, { title: e.target.value })}
                      className={fieldClass}
                    />
                  </label>
                  <label className="block">
                    <span className="font-medium text-neutral-700">Subtitle</span>
                    <textarea
                      value={slide.subtitle}
                      onChange={(e) => updateSlide(slide.id, { subtitle: e.target.value })}
                      rows={2}
                      className={fieldClass}
                    />
                  </label>
                  <label className="block">
                    <span className="font-medium text-neutral-700">Animation style</span>
                    <select
                      value={slide.animation}
                      onChange={(e) =>
                        updateSlide(slide.id, { animation: e.target.value as HeroAnimation })
                      }
                      className={fieldClass}
                    >
                      {ANIMATIONS.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <div className="mt-8 border-t border-neutral-100 pt-8">
                <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
                  Background (this banner only)
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
                  <label className="block text-sm">
                    <span className="font-medium text-neutral-700">Type</span>
                    <select
                      value={slide.backgroundMode}
                      onChange={(e) =>
                        updateSlide(slide.id, {
                          backgroundMode: e.target.value as HeroBackgroundMode,
                        })
                      }
                      className={fieldClass}
                    >
                      <option value="plain">Plain white</option>
                      <option value="color">Solid color</option>
                      <option value="image">Full background image</option>
                    </select>
                  </label>
                  {slide.backgroundMode === 'color' && (
                    <label className="block text-sm">
                      <span className="font-medium text-neutral-700">Background color</span>
                      <div className="mt-1 flex items-center gap-3">
                        <input
                          type="color"
                          value={slide.backgroundColor}
                          onChange={(e) =>
                            updateSlide(slide.id, { backgroundColor: e.target.value })
                          }
                          className="h-10 w-14 cursor-pointer rounded-lg border border-neutral-200 bg-white p-1"
                        />
                        <input
                          type="text"
                          value={slide.backgroundColor}
                          onChange={(e) => {
                            const v = e.target.value
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) {
                              updateSlide(slide.id, { backgroundColor: v })
                            }
                          }}
                          className="w-28 rounded-lg border border-neutral-200 px-3 py-2 font-mono text-sm"
                          spellCheck={false}
                        />
                      </div>
                    </label>
                  )}
                </div>
                {slide.backgroundMode === 'image' && (
                  <div className="mt-4 max-w-xl">
                    <ImageField
                      label="Background image (full banner, fades at bottom)"
                      value={slide.backgroundImage}
                      onChange={(backgroundImage) =>
                        updateSlide(slide.id, { backgroundImage })
                      }
                      previewClassName="h-40 w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-neutral-100 pt-16">
        <h2 className="font-display text-2xl font-semibold text-neutral-900">About Us</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Homepage “Why buyers choose Vedhaans” block — linked from the navbar as About Us.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-neutral-700">Eyebrow</span>
            <input
              value={branding.about.eyebrow}
              onChange={(e) => updateAbout({ eyebrow: e.target.value })}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-neutral-700">Heading</span>
            <input
              value={branding.about.title}
              onChange={(e) => updateAbout({ title: e.target.value })}
              className={fieldClass}
            />
          </label>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 border-t border-neutral-100 pt-8">
          <p className="text-sm font-medium text-neutral-700">Pillars</p>
          <button
            type="button"
            onClick={addAboutPillar}
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 hover:underline"
          >
            <Plus className="h-4 w-4" />
            Add pillar
          </button>
        </div>

        <div className="mt-6 space-y-8">
          {branding.about.pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-semibold text-neutral-800">Pillar</p>
                <button
                  type="button"
                  onClick={() => removeAboutPillar(pillar.id)}
                  disabled={branding.about.pillars.length <= 1}
                  className="inline-flex items-center gap-1 text-sm text-red-700 disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm sm:col-span-2">
                  <span className="font-medium text-neutral-700">Title</span>
                  <input
                    value={pillar.title}
                    onChange={(e) => updateAboutPillar(pillar.id, { title: e.target.value })}
                    className={fieldClass}
                  />
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className="font-medium text-neutral-700">Body</span>
                  <textarea
                    value={pillar.body}
                    onChange={(e) => updateAboutPillar(pillar.id, { body: e.target.value })}
                    rows={3}
                    className={fieldClass}
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-neutral-700">Icon</span>
                  <select
                    value={pillar.icon}
                    onChange={(e) =>
                      updateAboutPillar(pillar.id, { icon: e.target.value as AboutPillarIcon })
                    }
                    className={fieldClass}
                  >
                    {ABOUT_ICONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-neutral-100 pt-16">
        <h2 className="font-display text-2xl font-semibold text-neutral-900">Why Kolhapur section</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Homepage “Why Kolhapur” block — edit copy and add image or video slides (PNG supported).
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-neutral-700">Eyebrow</span>
            <input
              value={branding.kolhapur.eyebrow}
              onChange={(e) => updateKolhapur({ eyebrow: e.target.value })}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm lg:col-span-2">
            <span className="font-medium text-neutral-700">Heading</span>
            <input
              value={branding.kolhapur.title}
              onChange={(e) => updateKolhapur({ title: e.target.value })}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm lg:col-span-2">
            <span className="font-medium text-neutral-700">Intro paragraph</span>
            <textarea
              value={branding.kolhapur.intro}
              onChange={(e) => updateKolhapur({ intro: e.target.value })}
              rows={4}
              className={fieldClass}
            />
          </label>
        </div>

        <div className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">Bullet points</p>
            <button
              type="button"
              onClick={() =>
                updateKolhapur({ bullets: [...branding.kolhapur.bullets, 'New point'] })
              }
              className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-900 hover:underline"
            >
              <Plus className="h-4 w-4" />
              Add point
            </button>
          </div>
          <ul className="mt-4 space-y-3">
            {branding.kolhapur.bullets.map((line, i) => (
              <li key={i} className="flex gap-2">
                <input
                  value={line}
                  onChange={(e) => {
                    const bullets = [...branding.kolhapur.bullets]
                    bullets[i] = e.target.value
                    updateKolhapur({ bullets })
                  }}
                  className={fieldClass + ' mt-0 flex-1'}
                />
                <button
                  type="button"
                  onClick={() =>
                    updateKolhapur({
                      bullets: branding.kolhapur.bullets.filter((_, j) => j !== i),
                    })
                  }
                  disabled={branding.kolhapur.bullets.length <= 1}
                  className="shrink-0 px-2 text-neutral-500 hover:text-red-700 disabled:opacity-40"
                  aria-label="Remove point"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 border-t border-neutral-100 pt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
              Media slides (left column)
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  updateKolhapur({
                    mediaSlides: [...branding.kolhapur.mediaSlides, createKolhapurImageSlide()],
                  })
                }
                className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-900 hover:underline"
              >
                <Plus className="h-4 w-4" />
                Add image
              </button>
              <button
                type="button"
                onClick={() =>
                  updateKolhapur({
                    mediaSlides: [...branding.kolhapur.mediaSlides, createKolhapurVideoSlide()],
                  })
                }
                className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-900 hover:underline"
              >
                <Plus className="h-4 w-4" />
                Add video
              </button>
            </div>
          </div>

          <div className="mt-8 space-y-10">
            {branding.kolhapur.mediaSlides.map((media, index) => (
              <div key={media.id} className="border-t border-neutral-100 pt-8 first:border-t-0 first:pt-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-neutral-800">
                    Slide {index + 1} · {media.type === 'video' ? 'Video' : 'Image'}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeKolhapurSlide(media.id)}
                    disabled={branding.kolhapur.mediaSlides.length <= 1}
                    className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-red-700 disabled:opacity-40"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>

                {media.type === 'image' ? (
                  <div className="mt-4 max-w-xl">
                    <ImageField
                      label="Image (PNG for transparent background)"
                      value={media.src}
                      onChange={(src) => updateKolhapurSlide(media.id, { src })}
                      previewClassName="h-48 w-full object-contain bg-neutral-50"
                    />
                  </div>
                ) : (
                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div className="aspect-video overflow-hidden rounded-lg bg-neutral-900">
                      {media.src ? (
                        <iframe
                          title="Preview"
                          src={normalizeYoutubeEmbed(media.src)}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                          Paste a YouTube URL
                        </div>
                      )}
                    </div>
                    <label className="block text-sm">
                      <span className="font-medium text-neutral-700">YouTube URL / embed</span>
                      <input
                        value={media.src}
                        onChange={(e) => updateKolhapurSlide(media.id, { src: e.target.value })}
                        onBlur={(e) =>
                          updateKolhapurSlide(media.id, {
                            src: normalizeYoutubeEmbed(e.target.value),
                          })
                        }
                        className={fieldClass}
                      />
                    </label>
                  </div>
                )}

                <label className="mt-4 block max-w-xl text-sm">
                  <span className="font-medium text-neutral-700">Caption (optional)</span>
                  <input
                    value={media.caption}
                    onChange={(e) => updateKolhapurSlide(media.id, { caption: e.target.value })}
                    className={fieldClass}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-100 pt-16">
        <h2 className="font-display text-2xl font-semibold text-neutral-900">Video embeds</h2>
        <p className="mt-1 text-sm text-neutral-600">Paste a YouTube link or embed URL.</p>
        <div className="mt-8 space-y-12">
          {branding.videos.map((video) => (
            <div key={video.id} className="grid gap-8 lg:grid-cols-2">
              <div className="aspect-video overflow-hidden rounded-lg bg-neutral-900">
                <iframe
                  title={video.title}
                  src={video.embed}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="space-y-3 text-sm">
                <label className="block">
                  <span className="font-medium text-neutral-700">Title</span>
                  <input
                    value={video.title}
                    onChange={(e) => updateVideo(video.id, { title: e.target.value })}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className="font-medium text-neutral-700">Caption</span>
                  <input
                    value={video.caption}
                    onChange={(e) => updateVideo(video.id, { caption: e.target.value })}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className="font-medium text-neutral-700">YouTube URL / embed</span>
                  <input
                    value={video.embed}
                    onChange={(e) => updateVideo(video.id, { embed: e.target.value })}
                    onBlur={(e) =>
                      updateVideo(video.id, { embed: normalizeYoutubeEmbed(e.target.value) })
                    }
                    className={fieldClass}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
