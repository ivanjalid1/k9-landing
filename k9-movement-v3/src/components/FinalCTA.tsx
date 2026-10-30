import { motion, useReducedMotion, type Variants } from 'motion/react'
import { CONTACT } from '../config'
import creek1000 from '../assets/photos/creek-1000.webp'
import creek2000 from '../assets/photos/creek-2000.webp'
import { BookLink, ButtonLink } from './ui'
import { EASE_IN_OUT, fadeOnly, fadeUp, stagger, useParallax, VIEWPORT } from '../lib/motion'

// Same 45° diagonal wipe as the hero block, so the page opens and closes with one gesture.
const wipe: Variants = {
  hidden: { clipPath: 'polygon(0% 0%, 0% 0%, 0% 0%)' },
  show: {
    clipPath: 'polygon(0% 0%, 220% 0%, 0% 220%)',
    transition: { duration: 1.1, ease: EASE_IN_OUT },
    transitionEnd: { clipPath: 'none' },
  },
}

export function FinalCTA() {
  const reduce = useReducedMotion()
  const [bgRef, bgY] = useParallax(180)

  return (
    <section id="contact" aria-labelledby="cta-title" className="relative isolate overflow-hidden bg-night py-24 sm:py-36">
      <motion.div ref={bgRef} style={{ y: bgY }} aria-hidden="true" className="absolute -inset-y-28 inset-x-0 -z-10">
        <img
          src={creek2000}
          srcSet={`${creek1000} 1000w, ${creek2000} 2000w`}
          sizes="100vw"
          alt=""
          loading="lazy"
          className="size-full object-cover object-[78%_50%] lg:object-[60%_50%]"
        />
      </motion.div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-night/45" />

      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <motion.div variants={reduce ? fadeOnly : wipe} initial="hidden" whileInView="show" viewport={VIEWPORT} className="max-w-2xl">
          <motion.div
            variants={stagger(0.12, 0.35)}
            className="round-card bg-night/80 p-7 text-cloud backdrop-blur-[2px] sm:p-12 lg:p-14"
          >
            <motion.h2 variants={fadeUp} id="cta-title" className="display text-[clamp(2rem,4.6vw,4rem)]">
              Your dog deserves more than a walk.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-6 max-w-[48ch] text-[1.05rem] leading-relaxed text-cloud/85">
              Book your first session and see the difference for yourself.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <BookLink magnetic />
              <ButtonLink href={CONTACT.phoneHref} variant="ghost-light">
                Call {CONTACT.phone}
              </ButtonLink>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
