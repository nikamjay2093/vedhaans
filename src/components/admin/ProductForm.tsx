import { useStore } from '../../context/StoreContext'
import type { Product } from '../../types'
import { ImageField } from './ImageField'

export type ProductFormValues = Omit<Product, 'id'>

const fieldClass =
  'mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-400'

interface ProductFormProps {
  values: ProductFormValues
  onChange: (values: ProductFormValues) => void
  onSubmit: () => void
  submitLabel: string
  onCancel?: () => void
}

export function ProductForm({
  values,
  onChange,
  onSubmit,
  submitLabel,
  onCancel,
}: ProductFormProps) {
  const { categories } = useStore()
  const set = (patch: Partial<ProductFormValues>) => onChange({ ...values, ...patch })

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <ImageField
        label="Product photo"
        value={values.image}
        onChange={(image) => set({ image })}
        previewClassName="h-40 w-full"
        hint="Upload from your phone or paste an image URL."
      />

      <label className="block text-sm">
        <span className="font-medium text-neutral-700">Product name</span>
        <input
          required
          value={values.name}
          onChange={(e) => set({ name: e.target.value })}
          className={fieldClass}
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-neutral-700">Category</span>
        <select
          value={values.category}
          onChange={(e) => set({ category: e.target.value })}
          className={fieldClass}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="font-medium text-neutral-700">Description</span>
        <textarea
          value={values.description}
          onChange={(e) => set({ description: e.target.value })}
          rows={3}
          className={fieldClass}
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-neutral-700">Origin</span>
          <input
            value={values.origin}
            onChange={(e) => set({ origin: e.target.value })}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-neutral-700">Grade</span>
          <input
            value={values.grade}
            onChange={(e) => set({ grade: e.target.value })}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-neutral-700">Unit</span>
          <input
            value={values.unit}
            onChange={(e) => set({ unit: e.target.value })}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-neutral-700">Min. order (MOQ)</span>
          <input
            value={values.minOrder}
            onChange={(e) => set({ minOrder: e.target.value })}
            className={fieldClass}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-neutral-700">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.inStock}
            onChange={(e) => set({ inStock: e.target.checked })}
            className="rounded border-neutral-300"
          />
          In stock
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.featured ?? false}
            onChange={(e) => set({ featured: e.target.checked })}
            className="rounded border-neutral-300"
          />
          Featured on card
        </label>
      </div>

      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          className="flex-1 text-sm font-semibold text-neutral-900 underline-offset-4 hover:underline"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
