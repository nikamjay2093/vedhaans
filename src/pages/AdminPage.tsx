import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import {
  Contact,
  FolderTree,
  LayoutGrid,
  Megaphone,
  Pencil,
  Plus,
  Search,
  Trash2,
  Inbox,
} from 'lucide-react'
import { BrandLogo } from '../components/BrandLogo'
import { BrandingPanel } from '../components/admin/BrandingPanel'
import { CategoriesPanel } from '../components/admin/CategoriesPanel'
import { ContactPanel } from '../components/admin/ContactPanel'
import { ProductForm, type ProductFormValues } from '../components/admin/ProductForm'
import { SafeImage } from '../components/SafeImage'
import { emptyProductForm, useStore } from '../context/StoreContext'
import { useCloudEnquiries } from '../hooks/useCloudEnquiries'
import { isSupabaseConfigured } from '../lib/supabase'
import type { Product } from '../types'

type AdminTab = 'inventory' | 'categories' | 'branding' | 'contact' | 'enquiries'

interface AdminPageProps {
  onLogout?: () => void
}

export function AdminPage({ onLogout }: AdminPageProps) {
  const {
    products,
    categories,
    enquiries,
    addProduct,
    saveProduct,
    deleteProduct,
    storageError,
    clearStorageError,
  } = useStore()
  const cloudSync = isSupabaseConfigured()
  const {
    enquiries: cloudEnquiries,
    loading: cloudEnquiriesLoading,
    error: cloudEnquiriesError,
  } = useCloudEnquiries(cloudSync)
  const enquiryList = cloudSync ? cloudEnquiries : enquiries
  const [tab, setTab] = useState<AdminTab>('inventory')
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ProductFormValues>(emptyProductForm())
  const [panelOpen, setPanelOpen] = useState(false)

  const filtered = useMemo(() => {
    let list = filter === 'all' ? products : products.filter((p) => p.category === filter)
    const q = search.trim().toLowerCase()
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q))
    return list
  }, [products, filter, search])

  const editingProduct = editingId ? products.find((p) => p.id === editingId) : null

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyProductForm(categories[0]?.id ?? 'rice'))
    setPanelOpen(true)
  }

  const openEdit = (p: Product) => {
    setEditingId(p.id)
    const { id: _id, ...rest } = p
    setForm(rest)
    setPanelOpen(true)
  }

  const closePanel = () => {
    setPanelOpen(false)
    setEditingId(null)
  }

  const onSave = () => {
    if (editingId) {
      saveProduct({ ...form, id: editingId })
    } else {
      addProduct(form)
    }
    closePanel()
    setForm(emptyProductForm(categories[0]?.id ?? 'rice'))
  }

  const tabs: { id: AdminTab; label: string; icon: typeof LayoutGrid }[] = [
    { id: 'inventory', label: 'Inventory', icon: LayoutGrid },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'branding', label: 'Banners & media', icon: Megaphone },
    { id: 'contact', label: 'Contact', icon: Contact },
    { id: 'enquiries', label: 'Enquiries', icon: Inbox },
  ]

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="sticky top-0 z-40 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <BrandLogo
              className="h-9 w-auto max-w-[100px] object-contain"
              nameClassName="font-display text-xl font-semibold tracking-tight text-neutral-900"
            />
            <span className="hidden text-neutral-300 sm:inline">|</span>
            <h1 className="font-display text-xl font-semibold text-neutral-900 sm:text-2xl">Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
            >
              Storefront
            </Link>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
              >
                Log out
              </button>
            )}
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-6 px-4 pb-4 sm:px-6">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`inline-flex items-center gap-2 text-sm font-medium transition ${
                tab === id
                  ? 'text-neutral-900 underline underline-offset-4'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {label}
            </button>
          ))}
        </nav>
      </header>

      {storageError && (
        <div
          role="alert"
          className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-900 sm:px-6"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <p>{storageError}</p>
            <button
              type="button"
              onClick={clearStorageError}
              className="shrink-0 text-left font-semibold underline sm:text-right"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {tab === 'inventory' && (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-2xl font-semibold text-neutral-900">Inventory</h2>
                <p className="mt-1 text-sm text-neutral-600">
                  {products.length} products · edits sync to the storefront
                </p>
              </div>
              <button
                type="button"
                onClick={openCreate}
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-neutral-900 underline-offset-4 hover:underline"
              >
                <Plus className="h-4 w-4" />
                Add product
              </button>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name…"
                  className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-neutral-400"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    filter === 'all'
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setFilter(c.id)}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      filter === c.id
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <article key={p.id} className="flex flex-col">
                  <div className="relative h-40 overflow-hidden rounded-lg bg-neutral-50">
                    <SafeImage src={p.image} alt={p.name} className="h-full w-full object-cover" />
                    <span className="absolute left-3 top-3 text-xs font-medium text-neutral-700">
                      {p.inStock ? 'In stock' : 'Await harvest'}
                    </span>
                  </div>
                  <div className="pt-4">
                    <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
                      {categories.find((c) => c.id === p.category)?.label ?? p.category}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-semibold text-neutral-900">
                      {p.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{p.description}</p>
                    <p className="mt-2 text-xs text-neutral-500">MOQ {p.minOrder} · {p.grade}</p>
                    <div className="mt-4 flex gap-4">
                      <button
                        type="button"
                        onClick={() => openEdit(p)}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-900 hover:underline"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete ${p.name}?`)) deleteProduct(p.id)
                        }}
                        className="text-sm font-medium text-neutral-500 hover:text-red-700"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="mt-12 text-center text-sm text-neutral-500">No products match your filters.</p>
            )}
          </>
        )}

        {tab === 'categories' && (
          <section>
            <h2 className="font-display text-2xl font-semibold text-neutral-900">Categories</h2>
            <p className="mt-1 text-sm text-neutral-600">
              Add or remove catalog lines shown on the homepage and category pages.
            </p>
            <div className="mt-8">
              <CategoriesPanel />
            </div>
          </section>
        )}

        {tab === 'branding' && <BrandingPanel />}

        {tab === 'contact' && (
          <section>
            <h2 className="font-display text-2xl font-semibold text-neutral-900">Contact & footer</h2>
            <p className="mt-1 text-sm text-neutral-600">
              Address, phone, and email shown in the site footer.
            </p>
            <div className="mt-8">
              <ContactPanel />
            </div>
          </section>
        )}

        {tab === 'enquiries' && (
          <section>
            <h2 className="font-display text-2xl font-semibold text-neutral-900">Enquiries</h2>
            {cloudSync && (
              <p className="mt-1 text-sm text-neutral-600">
                Live from all visitors — new submissions appear here automatically.
              </p>
            )}
            {cloudEnquiriesError && (
              <p className="mt-2 text-sm text-red-700" role="alert">{cloudEnquiriesError}</p>
            )}
            {cloudEnquiriesLoading ? (
              <p className="mt-2 text-sm text-neutral-600">Loading enquiries…</p>
            ) : enquiryList.length === 0 ? (
              <p className="mt-2 text-sm text-neutral-600">No enquiries yet — submit from the storefront.</p>
            ) : (
              <ul className="mt-8 divide-y divide-neutral-100">
                {enquiryList.map((enq) => (
                  <li key={enq.id} className="py-5 text-sm first:pt-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-semibold text-neutral-900">{enq.productName}</span>
                      <span className="text-xs text-neutral-500">
                        {new Date(enq.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-2 text-neutral-600">
                      {enq.name} · {enq.phone} · {enq.email}
                    </p>
                    {enq.quantity && <p className="mt-1 text-neutral-500">Qty: {enq.quantity}</p>}
                    {enq.message && <p className="mt-2 text-neutral-600">{enq.message}</p>}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>

      {panelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            className="absolute inset-0 bg-neutral-900/20"
            onClick={closePanel}
            aria-label="Close panel"
          />
          <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-xl">
            <div className="border-b border-neutral-100 px-5 py-4">
              <h2 className="font-display text-xl font-semibold text-neutral-900">
                {editingProduct ? `Edit · ${editingProduct.name}` : 'New product'}
              </h2>
              <p className="text-xs text-neutral-500">Upload a photo or paste a URL</p>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ProductForm
                values={form}
                onChange={setForm}
                onSubmit={onSave}
                submitLabel={editingId ? 'Save changes' : 'Add product'}
                onCancel={closePanel}
              />
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
