import { PHOTOS, srcSet } from '../config'
import spruce from '../assets/pine/spruce.webp'
import { motion } from 'motion/react'
import { BrandIcon, type IconName } from './ui'
import { Pine, Reveal, Stagger } from './motion'
import { clipUp, fadeUp, useParallax } from '../lib/motion'

const values: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'bond',
    title: 'Bond',
    body: 'A strong relationship is built between the trainer, the animal and the owner. Session by session, outside, in the only environment where the animal is truly itself.',
  },
  {
    icon: 'discipline',
    title: 'Discipline',
    body: 'Training has structure, demand and measurable results. Every animal is different, every method is too.',
  },
  {
    icon: 'outside',
    title: 'Outside',
    body: 'The natural environment understood as the primary tool. Training rooted in nature is K9 Movement’s most relevant added value.',
  },
]

const DEFAULT_INTRO =
  'We believe every dog deserves more than a walk around the block. K9 Movement trains and cares for dogs in the one place they’re truly themselves: the outdoors. Through real structure, genuine bonding and nature as our training ground, we help every dog reach their full potential, physically and mentally.'

export function Values({
  heading = 'Trained where dogs are truly themselves.',
  intro = DEFAULT_INTRO,
}: {
  heading?: string
  intro?: string
}) {
  const [bgRef, bgY] = useParallax(160)
  return (
    <section id="approach" aria-labelledby="approach-title" className="relative isolate overflow-hidden bg-night pb-24 pt-20 sm:pb-32 sm:pt-24">
      <motion.div ref={bgRef} style={{ y: bgY }} aria-hidden="true" className="absolute -inset-y-24 inset-x-0 -z-10">
        <img
          src={PHOTOS.values(1600)}
          srcSet={srcSet(PHOTOS.values, [800, 1400, 2000])}
          sizes="100vw"
          alt=""
          loading="lazy"
          className="size-full object-cover"
        />
      </motion.div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-night via-night/70 to-night/90" />

      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal as="h2" variants={clipUp} className="display text-[clamp(2rem,4.6vw,4rem)] text-cloud lg:col-span-7">
            <span id="approach-title">{heading}</span>
          </Reveal>
          <Reveal as="p" delay={0.15} className="max-w-[52ch] text-[1.05rem] leading-relaxed text-cloud/85 lg:col-span-5">
            {intro}
          </Reveal>
        </div>

        <div className="relative mt-14 lg:mt-20">
          <Pine
            src={spruce}
            width={560}
            height={686}
            depth={-140}
            className="absolute -right-8 -top-20 z-10 w-32 sm:w-40 md:-right-12 lg:-right-16 lg:w-52"
            imgClassName="rotate-[25deg]"
          />
          <Stagger as="ul" gap={0.12} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {values.map((v) => (
              <motion.li
                key={v.title}
                variants={fadeUp}
                className="group round-card bg-forest/80 p-7 text-cloud backdrop-blur-[2px] transition-[translate] duration-300 ease-out hover:-translate-y-1.5 sm:p-9 sm:last:col-span-2 lg:last:col-span-1"
              >
                <BrandIcon name={v.icon} className="size-14 text-cloud transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:-rotate-6" />
                <h3 className="display mt-8 text-[1.75rem] sm:text-[2rem]">{v.title}</h3>
                <p className="mt-4 text-[1rem] leading-relaxed text-cloud/85">{v.body}</p>
              </motion.li>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}
