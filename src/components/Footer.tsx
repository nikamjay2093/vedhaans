import { Mail, MapPin, Phone } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { BrandLogo } from './BrandLogo'

export function Footer() {
  const { branding } = useStore()
  const { contact } = branding

  return (
    <footer className="bg-white py-14">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-3">
        <div>
          <BrandLogo
            className="h-12 w-auto max-w-[120px] object-contain"
            nameClassName="font-display text-2xl font-semibold tracking-tight text-neutral-900"
          />
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">{contact.footerAbout}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">Contact</p>
          <ul className="mt-4 space-y-3 text-sm text-neutral-600">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
              {contact.address}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-neutral-400" />
              <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="hover:text-neutral-900">
                {contact.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-neutral-400" />
              <a href={`mailto:${contact.email}`} className="hover:text-neutral-900">
                {contact.email}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">Note</p>
          <p className="mt-4 text-sm text-neutral-600">{contact.footerNote}</p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pt-8 text-center text-xs text-neutral-400 sm:px-6">
        © {new Date().getFullYear()} Vedhaans. Pure grain from Kolhapur.
      </div>
    </footer>
  )
}
