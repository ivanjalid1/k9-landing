import { CONTACT, SERVICE_AREA } from '../config'
import logoVertical from '../assets/logo/vertical-white.svg'
import { Link } from 'react-router'
import { BrandIcon, type IconName } from './ui'
import { NAV_PAGES, PAGES } from '../data/pages'

const contacts: { icon: IconName; label: string; href: string; external?: boolean }[] = [
  { icon: 'phone', label: CONTACT.phone, href: CONTACT.phoneHref },
  { icon: 'email', label: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { icon: 'instagram', label: CONTACT.instagramHandle, href: CONTACT.instagramUrl, external: true },
]


export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-ink pb-10 pt-20 text-cloud">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-4 sm:px-8 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link to={PAGES.home.path} className="inline-block" aria-label="K9 Movement home">
            <img src={logoVertical} alt="" width={322} height={184} loading="lazy" className="h-auto w-40" />
          </Link>
          <p className="mt-6 text-[1.05rem] font-semibold">Unleash the full potential.</p>
        </div>

        <nav aria-label="Footer" className="lg:col-span-3">
          <h2 className="text-[0.95rem] font-bold text-mist">Explore</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-1">
            {[PAGES.home, ...NAV_PAGES].map((l) => (
              <li key={l.path}>
                <Link to={l.path} className="inline-block py-1.5 text-cloud/80 transition-colors hover:text-trail">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-5">
          <h2 className="text-[0.95rem] font-bold text-mist">Get in touch</h2>
          <ul className="mt-4 flex flex-col gap-1">
            {contacts.map((c) => (
              <li key={c.href}>
                <a
                  href={c.href}
                  {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group inline-flex items-center gap-3 py-1.5 text-[1.05rem] text-cloud/90 hover:text-trail"
                >
                  <BrandIcon name={c.icon} className="size-5 text-mist transition-[translate,color] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:text-trail" />
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 flex items-start gap-3 text-cloud/70">
            <BrandIcon name="location" className="mt-0.5 size-5 text-mist" />
            {SERVICE_AREA.join(', ')}. Halton Region, Ontario.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-[1320px] flex-col gap-2 border-t border-cloud/10 px-4 pt-8 text-[0.85rem] text-cloud/55 sm:flex-row sm:justify-between sm:px-8">
        <p>© {year} K9 Movement. All rights reserved.</p>
        <a href={CONTACT.websiteUrl} className="hover:text-trail">{CONTACT.website}</a>
      </div>
    </footer>
  )
}
