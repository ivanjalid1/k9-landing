import { Link } from 'react-router'
import leafYellow from '../assets/leaves/leaf-4.svg'
import leafGreen from '../assets/leaves/leaf-3.svg'
import { motion } from 'motion/react'
import { careGroups, training } from '../data/services'
import { PAGES } from '../data/pages'
import { BrandIcon, NoBreakHyphens, type IconName } from './ui'
import { Pine, Reveal, Stagger } from './motion'
import { clipUp, fadeUp } from '../lib/motion'

type Card = { to: string; icon: IconName; title: string; summary: string; price: string; cta: string; dark?: boolean }

const lowest = (groupId: string) => {
  const prices = careGroups
    .find((g) => g.id === groupId)
    ?.services.flatMap((s) => (s.from ? [Number(s.from.replace('$', ''))] : [])) ?? []
  return prices.length ? `From $${Math.min(...prices)}` : ''
}

const cards: Card[] = [
  {
    to: PAGES.training.path,
    icon: 'training',
    title: training.name,
    summary: training.summary,
    price: 'Starts with an assessment',
    cta: 'Explore training',
    dark: true,
  },
  {
    to: `${PAGES.petCare.path}#walks`,
    icon: 'walking',
    title: 'Walks & drop-in visits',
    summary: 'Dog walks, small pack walks (max 6 dogs) and drop-in visits for dogs and cats.',
    price: lowest('walks'),
    cta: 'See rates',
  },
  {
    to: `${PAGES.petCare.path}#overnight`,
    icon: 'boarding',
    title: 'Overnight care',
    summary: 'House sitting with three daily walks and an overnight stay, or boarding by application.',
    price: lowest('overnight'),
    cta: 'See rates',
  },
]

/** Home page: one card per service area, each linking to its page. */
export function ServicesOverview() {
  return (
    <section id="services" aria-labelledby="services-title" className="relative overflow-hidden bg-cloud py-24 sm:py-32">
      <div aria-hidden="true" className="texture-map animate-drift-slow opacity-[0.12]" />
      <Pine src={leafYellow} width={300} height={151} depth={-110} className="absolute right-[8%] top-20 w-20 sm:w-28" imgClassName="rotate-[18deg]" />
      <Pine src={leafGreen} width={300} height={151} depth={80} sway="slower" className="absolute -left-4 bottom-10 hidden w-24 sm:block" imgClassName="-rotate-[150deg]" />

      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-8">
        <div className="max-w-3xl">
          <Reveal as="h2" variants={clipUp} className="display text-[clamp(2rem,4.6vw,4rem)] text-night">
            <span id="services-title">Professional care. Real results.</span>
          </Reveal>
          <Reveal as="p" delay={0.15} className="mt-6 max-w-[56ch] text-[1.05rem] leading-relaxed text-ink/75">
            Structured training and dependable everyday care across Halton Region.
          </Reveal>
        </div>

        <Stagger as="ul" gap={0.12} className="mt-14 grid gap-5 lg:mt-20 lg:grid-cols-3">
          {cards.map((c) => (
            <motion.li key={c.title} variants={fadeUp} className="flex">
              <Link
                to={c.to}
                className={`group flex w-full flex-col p-7 transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1.5 sm:p-9 ${
                  c.dark ? 'round-card bg-night text-cloud' : 'round-card bg-cloud/90 text-ink ring-1 ring-inset ring-night/15 backdrop-blur-sm'
                }`}
              >
                <BrandIcon
                  name={c.icon}
                  className={`size-14 transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:-rotate-6 ${c.dark ? 'text-mist' : 'text-forest'}`}
                />
                <h3 className={`display mt-8 text-[1.5rem] sm:text-[1.75rem] ${c.dark ? '' : 'text-night'}`}><NoBreakHyphens text={c.title} /></h3>
                <p className={`mt-4 flex-1 text-[1rem] leading-relaxed ${c.dark ? 'text-cloud/85' : 'text-ink/75'}`}>{c.summary}</p>
                <p className={`mt-6 text-[0.95rem] font-bold ${c.dark ? 'text-cloud' : 'text-night'}`}>{c.price}</p>
                <span
                  className={`mt-5 inline-flex items-center gap-2 border-t pt-5 text-[0.95rem] font-semibold ${c.dark ? 'border-cloud/15' : 'border-night/15'}`}
                >
                  {c.cta}
                  <span
                    aria-hidden="true"
                    className={`inline-block h-0.5 w-5 -rotate-45 transition-[translate,width] duration-300 ease-out group-hover:translate-x-1 ${c.dark ? 'bg-mist' : 'bg-forest'}`}
                  />
                </span>
              </Link>
            </motion.li>
          ))}
        </Stagger>

        <Reveal className="mt-5">
          <Link
            to={PAGES.petCare.path}
            className="group round-card flex flex-col gap-4 bg-forest/10 px-6 py-5 sm:flex-row sm:items-center sm:px-9"
          >
            <BrandIcon name="transport" className="h-9 w-12 text-forest transition-transform duration-500 ease-out group-hover:translate-x-1.5" />
            <span className="text-[1rem] text-ink/80">
              <strong className="font-bold text-ink">Pet transportation</strong> is available on request.
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
