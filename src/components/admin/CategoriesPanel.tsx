import { Plus, RotateCcw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../../context/StoreContext'
import { ImageField } from './ImageField'

const fieldClass =
  'mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-400'

export function CategoriesPanel() {
  const {
    categories,
    products,
    branding,
    setBranding,
    addCategory,
    updateCategory,
    removeCategory,
    resetCategories,
  } = useStore()
  const [label, setLabel] = useState('')
  const [tagline, setTagline] = useState('')
  const [newPageBanner, setNewPageBanner] = useState('')

  const setPageBanner = (id: string, image: string) => {
    setBranding({
      categoryImages: { ...branding.categoryImages, [id]: image },
    })
  }

  const onAdd = () => {
    if (!label.trim()) return
    addCategory({
      label,
      tagline,
      pageBannerImage: newPageBanner || undefined,
    })
    setLabel('')
    setTagline('')
    setNewPageBanner('')
  }

  const onRemove = (id: string, name: string) => {
    const count = products.filter((p) => p.category === id).length
    if (count > 0) {
      window.alert(
        `"${name}" has ${count} product(s). Move or delete those products before removing this category.`,
      )
      return
    }
    if (!window.confirm(`Remove category "${name}"?`)) return
    removeCategory(id)
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-sm text-neutral-600">
          Catalog rows and category pages use these lines. Set the category page banner here (not on the
          homepage catalog row). Each category gets a URL slug from its name when added.
        </p>
        <button
          type="button"
          onClick={resetCategories}
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 hover:text-neutral-900"
        >
          <RotateCcw className="h-4 w-4" />
          Reset to defaults
        </button>
      </div>

      <div className="border-t border-neutral-100 pt-8">
        <h3 className="text-sm font-semibold text-neutral-900">Add category</h3>
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <label className="block text-sm">
              <span className="font-medium text-neutral-700">Name</span>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Organic rice"
                className={fieldClass}
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-neutral-700">Tagline</span>
              <input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Short line on the homepage catalog"
                className={fieldClass}
              />
            </label>
          </div>
          <ImageField
            label="Category page banner (optional)"
            value={newPageBanner}
            onChange={setNewPageBanner}
            hint="Shown at the top of /category/… pages only."
            previewClassName="h-40 w-full object-cover"
          />
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 hover:underline"
        >
          <Plus className="h-4 w-4" />
          Add category
        </button>
      </div>

      <ul className="divide-y divide-neutral-100 border-t border-neutral-100">
        {categories.map((cat) => {
          const productCount = products.filter((p) => p.category === cat.id).length
          const banner = branding.categoryImages[cat.id] ?? cat.heroImage
          return (
            <li key={cat.id} className="py-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <p className="text-sm font-semibold text-neutral-900">{cat.label}</p>
                <button
                  type="button"
                  onClick={() => onRemove(cat.id, cat.label)}
                  disabled={categories.length <= 1}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
              <div className="mt-4 grid gap-6 lg:grid-cols-2">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm sm:col-span-2">
                    <span className="font-medium text-neutral-700">Name</span>
                    <input
                      value={cat.label}
                      onChange={(e) => updateCategory(cat.id, { label: e.target.value })}
                      className={fieldClass}
                    />
                  </label>
                  <label className="block text-sm sm:col-span-2">
                    <span className="font-medium text-neutral-700">Tagline</span>
                    <input
                      value={cat.tagline}
                      onChange={(e) => updateCategory(cat.id, { tagline: e.target.value })}
                      className={fieldClass}
                    />
                  </label>
                  <p className="text-xs text-neutral-500 sm:col-span-2">
                    URL: /category/{cat.id} · {productCount} product
                    {productCount === 1 ? '' : 's'}
                  </p>
                </div>
                <ImageField
                  label="Category page banner"
                  value={banner}
                  onChange={(image) => setPageBanner(cat.id, image)}
                  previewClassName="h-40 w-full object-cover"
                />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
