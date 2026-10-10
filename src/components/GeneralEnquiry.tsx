import { motion } from 'framer-motion'
import { useState, type FormEvent } from 'react'
import { useStore } from '../context/StoreContext'

const fieldClass =
  'w-full bg-neutral-100/80 px-3 py-3 text-neutral-900 placeholder:text-neutral-400 outline-none focus:bg-neutral-100'

export function GeneralEnquiry() {
  const { submitEnquiry } = useStore()
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setError(null)
    setSubmitting(true)
    try {
      await submitEnquiry({
        productId: 'general',
        productName: 'General trade enquiry',
        name: String(fd.get('name') ?? ''),
        email: String(fd.get('email') ?? ''),
        phone: String(fd.get('phone') ?? ''),
        company: String(fd.get('company') ?? ''),
        quantity: String(fd.get('quantity') ?? ''),
        message: String(fd.get('message') ?? ''),
      })
      setDone(true)
      e.currentTarget.reset()
    } catch {
      setError('Could not send enquiry. Please try again or call us.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="enquire" className="bg-white py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-medium uppercase tracking-widest text-neutral-500">Trade desk</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-neutral-900">
            Bulk import & export enquiries
          </h2>
          <p className="mt-4 leading-relaxed text-neutral-600">
            Tell us what you need — rice, wheat, chili, or mixed containers. We will share grades, lab
            reports, and incoterms. Payments are handled offline after agreement.
          </p>
        </motion.div>
        <motion.form
          onSubmit={onSubmit}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {done && (
            <p className="text-sm text-neutral-700">Enquiry received — thank you!</p>
          )}
          {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <input name="name" required placeholder="Name *" className={fieldClass} />
            <input name="phone" required placeholder="Phone *" className={fieldClass} />
          </div>
          <input name="email" type="email" required placeholder="Email *" className={fieldClass} />
          <input name="company" placeholder="Company" className={fieldClass} />
          <input name="quantity" placeholder="Volume (MT)" className={fieldClass} />
          <textarea
            name="message"
            rows={4}
            placeholder="Products & destination port"
            className={fieldClass}
          />
          <button
            type="submit"
            disabled={submitting}
            className="pt-2 text-left text-sm font-semibold text-neutral-900 underline-offset-4 hover:underline disabled:opacity-60"
          >
            {submitting ? 'Sending…' : 'Send to Vedhaans'}
          </button>
        </motion.form>
      </div>
    </section>
  )
}
