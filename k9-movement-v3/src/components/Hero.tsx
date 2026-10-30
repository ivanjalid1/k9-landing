import { motion, useReducedMotion, useScroll, useTransform, type Variants } from 'motion/react'
import { useRef } from 'react'
import { SERVICE_AREA } from '../config'
import heroPhoto from '../assets/photos/hero-angel-romeo.webp'
import { BookLink, ButtonLink } from './ui'
import { EASE_IN_OUT, EASE_OUT, fadeOnly, useIsNarrow } from '../lib/motion'

/*
  Entrance choreography (one sequence, ~1.6s):
  0.00  teal block wipes in along a 45° diagonal
  0.35  headline lines rise out of their masks, 90ms apart
  0.80  subline, then CTAs
  Angel & Romeo are in the background photo, which eases in from a slight zoom.
*/

const block: Variants = {
  hidden: { clipPath: 'polygon(0% 0%, 0% 0%, 0% 0%)' },
  show: {
    clipPath: 'polygon(0% 0%, 220% 0%, 0% 220%)',
    transition: { duration: 1.1, ease: EASE_IN_OUT },
    transitionEnd: { clipPath: 'none' },
  },
}

const lines: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.35 } },
}

const line: Variants = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.9, ease: EASE_OUT } },
}

const after = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT, delay } },
})

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const narrow = useIsNarrow()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // Background drifts down slower than the page; content lifts slightly faster for depth.
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : narrow ? '10%' : '22%'])

  return (
    <motion.section ref={ref} id="top" className="relative isolate overflow-hidden bg-night" initial="hidden" animate="show">
      {/*
        Designed cover photo of Angel & Romeo. On desktop it fills the right ~60% and fades
        into Dark Teal behind the text; on mobile it fills the screen with the text card on top.
        Source is only 1264px wide, so no Ken Burns zoom here (it would soften it further).
      */}
      <motion.div
        aria-hidden="true"
        style={{ y: bgY }}
        className="absolute inset-0 -z-10 lg:left-auto lg:w-[70%]"
      >
        <motion.img
          src={heroPhoto}
          alt=""
          width={1264}
          height={848}
          fetchPriority="high"
          variants={{ hidden: { opacity: 0, scale: 1.06 }, show: { opacity: 1, scale: 1, transition: { duration: 1.6, ease: EASE_OUT } } }}
          className="size-full object-cover object-[32%_30%] lg:object-[30%_40%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/40 via-transparent to-night/30 lg:bg-gradient-to-r lg:from-night lg:via-night/10 lg:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night to-transparent" />
      </motion.div>
      <span className="sr-only">Angel and Romeo, K9 Movement’s rescue dogs.</span>

      <div className="mx-auto grid min-h-[100svh] max-w-[1320px] items-start px-4 pb-10 pt-24 sm:px-8 sm:pt-28 lg:grid-cols-12 lg:items-center lg:pb-20 lg:pt-32">
        <motion.div variants={reduce ? fadeOnly : block} className="lg:col-span-6">
          <div className="round-card bg-forest/65 p-6 backdrop-blur-[2px] sm:p-10 lg:p-14">
            <motion.h1 variants={lines} className="display text-[clamp(2.15rem,5.6vw,4rem)] text-cloud">
              {['Unleash', 'the full', 'potential.'].map((t) => (
                <span key={t} className="block overflow-hidden pb-[0.04em]">
                  <motion.span variants={line} className="block">
                    {t}
                  </motion.span>
                </span>
              ))}
            </motion.h1>
            <motion.p variants={after(0.8)} className="mt-6 max-w-[34ch] text-[1.15rem] font-semibold leading-snug text-cloud sm:text-[1.3rem]">
              Premium dog training &amp; pet care in Halton Region.
            </motion.p>
            <motion.p variants={after(0.9)} className="mt-3 max-w-[46ch] text-[1rem] leading-relaxed text-cloud/80">
              Real structure, genuine bonding and nature as our training ground.
            </motion.p>
            <motion.div variants={after(1.05)} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <BookLink magnetic />
              <ButtonLink href="#services" variant="ghost-light">
                Our services
              </ButtonLink>
            </motion.div>
            <motion.p variants={after(1.2)} className="mt-6 text-[0.9rem] text-cloud/80">
              Serving {SERVICE_AREA.slice(0, -1).join(', ')} &amp; {SERVICE_AREA.at(-1)}
            </motion.p>
          </div>
        </motion.div>

      </div>
    </motion.section>
  )
}
