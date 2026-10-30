import { useEffect, useState } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'
import logoBadge from '../assets/logo/old-badge.svg'
import { BookLink } from './ui'
import { CONTACT } from '../config'
import { Link, NavLink } from 'react-router'
import { NAV_PAGES, PAGES } from '../data/pages'

// Underline grows from the left on hover and stays for the current page.
const desktopLink = ({ isActive }: { isActive: boolean }) =>
  `relative py-2 text-[0.95rem] font-medium transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:bg-mist after:transition-transform after:duration-300 after:ease-out hover:text-cloud hover:after:scale-x-100 ${
    isActive ? 'text-cloud after:scale-x-100' : 'text-cloud/80 after:scale-x-0'
  }`

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()

  // Solid + compact once the hero starts scrolling away. Always visible.
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 40))

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const solid = scrolled || open
  const compact = scrolled && !open

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Background bar: fades in and shrinks from 72px to 60px with a transform (no layout change). */}
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-[72px] origin-top bg-night/95 backdrop-blur-md transition-[opacity,scale] duration-300 ease-out ${solid ? 'opacity-100' : 'opacity-0'} ${compact ? 'scale-y-[0.8334]' : 'scale-y-100'}`}
      />
      <nav
        aria-label="Main"
        className={`relative mx-auto flex h-[72px] max-w-[1320px] items-center justify-between gap-6 px-4 transition-transform duration-300 ease-out sm:px-8 ${compact ? '-translate-y-1.5' : ''}`}
      >
        <Link
          to={PAGES.home.path}
          onClick={() => setOpen(false)}
          className={`shrink-0 origin-left transition-transform duration-300 ease-out ${compact ? 'scale-90' : ''}`}
          aria-label="K9 Movement home"
        >
          <img src={logoBadge} alt="" width={1080} height={1080} className="h-12 w-auto drop-shadow-[0_4px_10px_rgb(0_0_0/0.35)] sm:h-16" />
        </Link>

        <ul className="hidden items-center gap-7 xl:flex">
          {NAV_PAGES.map((l) => (
            <li key={l.path}>
              <NavLink to={l.path} className={desktopLink}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <BookLink className="min-h-10! px-4! text-[0.82rem]! sm:min-h-11! sm:px-5! sm:text-[0.9rem]!" />
          <button
            type="button"
            className="grid size-11 place-items-center text-cloud xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M3 7h18M3 12h18M9 17h12" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="relative h-[calc(100dvh-72px)] overflow-y-auto bg-night px-4 pb-10 pt-6 sm:px-8 xl:hidden"
      >
        <ul className="flex flex-col">
          {[PAGES.home, ...NAV_PAGES].map((l) => (
            <li key={l.path} className="border-b border-cloud/10">
              <NavLink
                to={l.path}
                end
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `display flex items-center gap-4 py-5 text-[1.5rem] transition-colors hover:text-cloud ${isActive ? 'text-cloud' : 'text-cloud/70'}`
                }
              >
                {({ isActive }) => (
                  <>
                    <span aria-hidden="true" className={`h-1 w-5 -rotate-45 bg-mist transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                    {l.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-2 text-cloud/80">
          <a href={CONTACT.phoneHref} className="py-1 hover:text-trail">{CONTACT.phone}</a>
          <a href={`mailto:${CONTACT.email}`} className="py-1 hover:text-trail">{CONTACT.email}</a>
        </div>
      </div>
    </header>
  )
}
