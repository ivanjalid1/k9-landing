import { CONTACT } from '../config'
import { towns } from '../data/towns'
import pineBranch from '../assets/pine/pine-branch.webp'
import { motion, type Variants } from 'motion/react'
import { BrandIcon } from './ui'
import { Pine, Reveal, Stagger } from './motion'
import { clipUp, EASE_OUT } from '../lib/motion'

const town: Variants = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT } },
}

// Map pin drops onto the line with a small bounce.
const pin: Variants = {
  hidden: { opacity: 0, y: -18, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', duration: 0.6, bounce: 0.35, delay: 0.15 } },
}

export function ServiceArea() {
  return (
    <section id="area" aria-labelledby="area-title" className="relative isolate overflow-hidden bg-cloud py-24 sm:py-32">
      <div aria-hidden="true" className="texture-map animate-drift-slow -z-10 opacity-20" />
      <Pine
        src={pineBranch}
        width={560}
        height={703}
        depth={120}
        sway="slower"
        className="absolute -right-10 -top-10 -z-10 w-36 sm:w-44 lg:w-72"
        imgClassName="rotate-180 opacity-95"
      />

      <div className="mx-auto grid max-w-[1320px] gap-12 px-4 sm:px-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Reveal as="h2" variants={clipUp} className="display text-[clamp(2rem,4.6vw,4rem)] text-night">
            <span id="area-title">Rooted in Halton Region.</span>
          </Reveal>
          <Reveal delay={0.1}>
          <p className="mt-6 max-w-[44ch] text-[1.05rem] leading-relaxed text-ink/75">
            We train and care for dogs across Halton Region, Ontario, on the trails, conservation areas and
            neighbourhoods your dog already knows.
          </p>
          <p className="mt-4 max-w-[44ch] text-[1.05rem] leading-relaxed text-ink/75">
            Close to the area but not on the list? Call{' '}
            <a href={CONTACT.phoneHref} className="font-semibold text-night underline underline-offset-4 hover:text-forest">
              {CONTACT.phone}
            </a>{' '}
            and we’ll let you know.
          </p>
          </Reveal>
        </div>

        <Stagger as="ul" gap={0.12} className="lg:col-span-7 lg:col-start-6">
          {towns.map(({ name, slug }) => (
            <motion.li key={name} variants={town} className="border-b border-night/20 first:border-t">
              <a href={`#${slug}`} className="group flex items-center gap-4 py-5 sm:gap-6 sm:py-6">
              <motion.span variants={pin} className="inline-flex">
                <BrandIcon name="location" className="size-7 text-forest transition-transform duration-300 ease-out group-hover:-translate-y-1 sm:size-9" />
              </motion.span>
              <span className="display text-[clamp(1.6rem,4.2vw,3.25rem)] text-night transition-transform duration-300 ease-out group-hover:translate-x-1.5">
                {name}
              </span>
              </a>
            </motion.li>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
