import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useStore } from '../context/StoreContext'
import type { Product } from '../types'

const inputClass =
  'mt-1 w-full bg-neutral-100/80 px-3 py-2 text-neutral-900 outline-none focus:bg-neutral-100'

interface EnquiryModalProps {
  product: Product | null
  open: boolean
  onClose: () => void
}

export function EnquiryModal({ product, open, onClose }: EnquiryModalProps) {
  const { submitEnquiry } = useStore()
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!product) return
    const fd = new FormData(e.currentTarget)
    submitEnquiry({
      productId: product.id,
      productName: product.name,
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      company: String(fd.get('company') ?? ''),
      quantity: String(fd.get('quantity') ?? ''),
      message: String(fd.get('message') ?? ''),
    })
    setSent(true)
    setTimeout(() => {
      setSent(false)
      onClose()
    }, 2200)
  }

  return (
    <AnimatePresence>
      {open && product && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-white/80 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close"
          />
          <motion.div
            role="dialog"
            aria-labelledby="enquiry-title"
            className="relative z-10 w-full max-w-lg bg-white p-6"
            initial={{ scale: 0.98, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.98, y: 12 }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 p-1 text-neutral-500 hover:text-neutral-900"
            >
              <X className="h-5 w-5" />
            </button>
            {sent ? (
              <div className="py-12 text-center">
                <p className="font-display text-2xl text-neutral-900">Thank you!</p>
                <p className="mt-2 text-sm text-neutral-600">
                  Our Kolhapur trade desk will respond within 24 hours.
                </p>
              </div>
            ) : (
              <>
                <h2 id="enquiry-title" className="font-display text-2xl font-semibold text-neutral-900">
                  Enquire — {product.name}
                </h2>
                <p className="mt-1 text-sm text-neutral-500">No payment on site. Share your requirement.</p>
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm">
                      <span className="text-neutral-600">Name *</span>
                      <input name="name" required className={inputClass} />
                    </label>
                    <label className="block text-sm">
                      <span className="text-neutral-600">Phone *</span>
                      <input name="phone" required className={inputClass} />
                    </label>
                  </div>
                  <label className="block text-sm">
                    <span className="text-neutral-600">Email *</span>
                    <input name="email" type="email" required className={inputClass} />
                  </label>
                  <label className="block text-sm">
                    <span className="text-neutral-600">Company</span>
                    <input name="company" className={inputClass} />
                  </label>
                  <label className="block text-sm">
                    <span className="text-neutral-600">Quantity needed</span>
                    <input name="quantity" placeholder="e.g. 20 MT" className={inputClass} />
                  </label>
                  <label className="block text-sm">
                    <span className="text-neutral-600">Message</span>
                    <textarea name="message" rows={3} className={inputClass} />
                  </label>
                  <button
                    type="submit"
                    className="w-full py-3 text-left text-sm font-semibold text-neutral-900 underline-offset-4 hover:underline"
                  >
                    Submit enquiry
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
