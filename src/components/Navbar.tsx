import { Menu, X } from 'lucide-react'
import { BrandLogo } from './BrandLogo'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { to: '/#catalog', label: 'Catalog' },
  { to: '/#about', label: 'About Us' },
  { to: '/#videos', label: 'Stories' },
  { to: '/#enquire', label: 'Enquiry' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="group transition group-hover:opacity-90">
            <BrandLogo
              className="h-11 w-auto max-w-[132px] object-contain sm:h-12 sm:max-w-[152px]"
              nameClassName="text-xl font-bold lowercase tracking-tight text-neutral-900 sm:text-2xl"
            />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a
                key={l.to}
                href={l.to}
                className="text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="rounded-lg p-2 text-neutral-700 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden md:hidden"
            >
              <div className="flex flex-col gap-3 px-4 py-4">
                {links.map((l) => (
                  <a
                    key={l.to}
                    href={l.to}
                    className="text-neutral-700"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {!open && <div className="navbar-bottom-fade" aria-hidden />}
    </header>
  )
}
