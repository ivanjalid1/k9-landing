import type { ComponentProps, CSSProperties } from 'react'
import training from '../assets/icons/training.svg'
import walking from '../assets/icons/walking.svg'
import boarding from '../assets/icons/boarding.svg'
import transport from '../assets/icons/transport.svg'
import bond from '../assets/icons/bond.svg'
import discipline from '../assets/icons/discipline.svg'
import outside from '../assets/icons/outside.svg'
import location from '../assets/icons/location.svg'
import phone from '../assets/icons/phone.svg'
import website from '../assets/icons/website.svg'
import email from '../assets/icons/email.svg'
import instagram from '../assets/icons/instagram.svg'
import { BOOK_NOW_URL } from '../config'
import { Magnetic } from './motion'
import { Link } from 'react-router'

const icons = { training, walking, boarding, transport, bond, discipline, outside, location, phone, website, email, instagram }
export type IconName = keyof typeof icons

/** Designer's line icon, recoloured with the current text colour. */
export function BrandIcon({ name, className = 'size-10' }: { name: IconName; className?: string }) {
  const url = `url("${icons[name]}")`
  const style: CSSProperties = { maskImage: url, WebkitMaskImage: url }
  return <span aria-hidden="true" className={`brand-icon ${className}`} style={style} />
}

type Variant = 'primary' | 'ghost-light' | 'ghost-dark'

const variants: Record<Variant, string> = {
  // Primary buttons signal keyboard focus by inverting colours.
  primary: 'bg-trail text-ink hover:bg-[#f6b955] hover:shadow-[0_12px_28px_-12px_rgb(239_166_50/0.85)] focus-visible:bg-ink focus-visible:text-trail focus-visible:outline-none',
  'ghost-light': 'text-cloud ring-2 ring-inset ring-cloud/60 hover:bg-cloud/10 hover:ring-cloud',
  'ghost-dark': 'text-night ring-2 ring-inset ring-night/70 hover:bg-night/[0.06] hover:ring-night',
}

type ButtonLinkProps = ComponentProps<'a'> & { variant?: Variant; magnetic?: boolean; /** Internal route; renders a router Link. */ to?: string }

export function ButtonLink({ variant = 'primary', magnetic = false, className = '', children, to, ...rest }: ButtonLinkProps) {
  const cls = `inline-flex min-h-12 items-center overflow-hidden rounded-full justify-center px-7 text-[0.95rem] font-bold tracking-[0.01em] transition-[color,background-color,box-shadow,translate,scale] duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] ${variants[variant]} ${className}`
  const link = to ? (
    <Link to={to} className={cls}>
      {children}
    </Link>
  ) : (
    <a {...rest} className={cls}>
      {children}
    </a>
  )
  return magnetic ? <Magnetic>{link}</Magnetic> : link
}

/** Primary CTA to the external intake form. */
export function BookLink({
  children = 'Book Now',
  variant = 'primary',
  className = '',
  magnetic = false,
}: {
  children?: string
  variant?: Variant
  className?: string
  magnetic?: boolean
}) {
  return (
    <ButtonLink href={BOOK_NOW_URL} variant={variant} className={className} magnetic={magnetic}>
      {children}
    </ButtonLink>
  )
}

/** Keeps hyphenated words (e.g. "drop-in") from breaking across lines in tight headings. */
export function NoBreakHyphens({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\S+-\S+)/).map((part, i) =>
        i % 2 ? (
          <span key={i} className="whitespace-nowrap">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  )
}
