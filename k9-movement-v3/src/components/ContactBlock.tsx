import { Link } from 'react-router'
import leafYellow from '../assets/leaves/leaf-4.svg'
import { motion } from 'motion/react'
import { CONTACT, SERVICE_AREA } from '../config'
import { PAGES } from '../data/pages'
import { BookLink, BrandIcon, type IconName } from './ui'
import { Pine, Reveal, Stagger } from './motion'
import { fadeUp } from '../lib/motion'

const channels: { icon: IconName; label: string; value: string; href: string; external?: boolean }[] = [
  { icon: 'phone', label: 'Phone', value: CONTACT.phone, href: CONTACT.phoneHref },
  { icon: 'email', label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { icon: 'instagram', label: 'Instagram', value: CONTACT.instagramHandle, href: CONTACT.instagramUrl, external: true },
]

export function ContactBlock() {
  return (
    <section aria-label="Contact details" className="relative overflow-hidden bg-cloud py-20 sm:py-28">
      <div aria-hidden="true" className="texture-map animate-drift-slow opacity-[0.12]" />
      <Pine src={leafYellow} width={300} height={151} depth={-90} className="absolute bottom-10 left-[46%] hidden w-20 lg:block" imgClassName="rotate-[-20deg]" />
      <div className="relative mx-auto grid max-w-[1320px] gap-12 px-4 sm:px-8 lg:grid-cols-12 lg:gap-10">
        <Stagger as="ul" gap={0.1} className="lg:col-span-7">
          {channels.map((c) => (
            <motion.li key={c.label} variants={fadeUp} className="border-b border-night/20 first:border-t">
              <a
                href={c.href}
                {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group flex items-center gap-5 py-6 sm:gap-7 sm:py-8"
              >
                <BrandIcon name={c.icon} className="size-9 text-forest transition-transform duration-300 ease-out group-hover:-translate-y-1 sm:size-11" />
                <span className="min-w-0">
                  <span className="block text-[0.95rem] text-ink/65">{c.label}</span>
                  <span className="block break-all text-[clamp(1.25rem,3vw,2.1rem)] font-bold leading-tight tracking-[-0.01em] text-night transition-colors group-hover:text-forest sm:break-normal">
                    {c.value}
                  </span>
                </span>
              </a>
            </motion.li>
          ))}
        </Stagger>

        <Reveal delay={0.15} className="round-card self-start bg-night p-7 text-cloud sm:p-10 lg:col-span-5">
          <h2 className="display text-[clamp(1.5rem,2.4vw,2rem)]">Ready to book?</h2>
          <p className="mt-4 text-[1.02rem] leading-relaxed text-cloud/85">
            Tell us about you and your pet through our intake form, and we’ll take it from there.
          </p>
          <BookLink className="mt-7" magnetic />
          <div className="mt-9 border-t border-cloud/15 pt-6">
            <p className="flex items-start gap-3 text-cloud/85">
              <BrandIcon name="location" className="mt-0.5 size-5 text-mist" />
              <span>
                Serving {SERVICE_AREA.join(', ')} in Halton Region, Ontario.{' '}
                <Link to={PAGES.area.path} className="font-semibold text-cloud underline decoration-cloud/40 underline-offset-4 hover:decoration-trail">
                  See our service area
                </Link>
              </span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
