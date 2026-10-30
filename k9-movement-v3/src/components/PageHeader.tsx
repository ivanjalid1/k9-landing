import type { ReactNode } from 'react'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import pine from '../assets/pine/spruce.webp'
import { Pine } from './motion'
import { EASE_OUT } from '../lib/motion'

const lines: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } }
const line: Variants = { hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 0.9, ease: EASE_OUT } } }
const after: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT, delay: 0.5 } },
}

/**
 * Dark page header for inner pages: h1 with the same masked line reveal as the
 * home hero, a drifting stride texture, and a swaying spruce.
 */
export function PageHeader({ title, intro, children }: { title: string[]; intro?: ReactNode; children?: ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.section initial="hidden" animate="show" className="relative isolate overflow-hidden bg-night pb-16 pt-32 text-cloud sm:pb-24 sm:pt-40">
      <div aria-hidden="true" className="texture-stride-dark animate-drift -z-10 opacity-60" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-night via-night/90 to-night/40" />
      <Pine
        src={pine}
        width={560}
        height={686}
        depth={-80}
        className="absolute -right-10 bottom-[-12%] -z-10 w-28 opacity-50 sm:w-56 sm:opacity-90 lg:right-[4%] lg:w-72"
        imgClassName="-rotate-12"
      />

      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <motion.h1 variants={lines} className="display max-w-[18ch] text-[clamp(2.4rem,6.4vw,5.5rem)]">
          {title.map((t) => (
            <span key={t} className="block overflow-hidden pb-[0.04em]">
              <motion.span variants={reduce ? undefined : line} className="block">
                {t}
              </motion.span>
            </span>
          ))}
        </motion.h1>
        {(intro || children) && (
          <motion.div variants={after} className="mt-7 max-w-[60ch]">
            {intro && <p className="text-[1.1rem] leading-relaxed text-cloud/85 sm:text-[1.2rem]">{intro}</p>}
            {children && <div className="mt-8 flex flex-col gap-3 sm:flex-row">{children}</div>}
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}
