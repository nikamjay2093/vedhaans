import { useStore } from '../../context/StoreContext'
import type { SiteContact } from '../../types'

const fieldClass =
  'mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-400'

export function ContactPanel() {
  const { branding, setBranding } = useStore()
  const contact = branding.contact

  const update = (patch: Partial<SiteContact>) => {
    setBranding({ contact: { ...contact, ...patch } })
  }

  return (
    <div className="max-w-2xl space-y-8">
      <p className="text-sm text-neutral-600">
        Shown in the site footer. Saved in this browser with your other branding settings.
      </p>

      <div className="space-y-4 border-t border-neutral-100 pt-8">
        <h3 className="text-sm font-semibold text-neutral-900">Contact details</h3>
        <label className="block text-sm">
          <span className="font-medium text-neutral-700">Address</span>
          <input
            value={contact.address}
            onChange={(e) => update({ address: e.target.value })}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-neutral-700">Phone</span>
          <input
            type="tel"
            value={contact.phone}
            onChange={(e) => update({ phone: e.target.value })}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-neutral-700">Email</span>
          <input
            type="email"
            value={contact.email}
            onChange={(e) => update({ email: e.target.value })}
            className={fieldClass}
          />
        </label>
      </div>

      <div className="space-y-4 border-t border-neutral-100 pt-8">
        <h3 className="text-sm font-semibold text-neutral-900">Footer text</h3>
        <label className="block text-sm">
          <span className="font-medium text-neutral-700">About (under logo)</span>
          <textarea
            value={contact.footerAbout}
            onChange={(e) => update({ footerAbout: e.target.value })}
            rows={3}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-neutral-700">Note (right column)</span>
          <textarea
            value={contact.footerNote}
            onChange={(e) => update({ footerNote: e.target.value })}
            rows={3}
            className={fieldClass}
          />
        </label>
      </div>
    </div>
  )
}
