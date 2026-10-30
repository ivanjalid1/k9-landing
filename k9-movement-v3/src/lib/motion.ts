/**
 * Shared motion primitives (motion/react).
 *
 * Rules kept here so every section moves the same way:
 * - Only transform, opacity and clip-path are animated.
 * - One strong ease-out curve for entrances; springs for pointer-driven effects.
 * - <MotionConfig reducedMotion="user"> in App drops transform animations for
 *   reduced-motion users; scroll-linked and pointer effects check it explicitly.
 * - Scroll/parallax distances are smaller on narrow screens.
 */
import { useEffect, useRef, useState, type RefObject } from 'react'
import { useReducedMotion, useScroll, useTransform, type MotionValue, type Variants } from 'motion/react'

export const EASE_OUT = [0.22, 1, 0.36, 1] as const
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const

export const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const

/* ------------------------------------------------------------------ */
/* Variants                                                            */
/* ------------------------------------------------------------------ */

/** Used in place of movement-based variants when reduced motion is requested. */
export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 24 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT } },
}

/** Reveal upward through a mask. Not for elements that already use a clip-path class. */
export const clipUp: Variants = {
  hidden: { clipPath: 'inset(0% 0% 100% 0%)', y: 24 },
  show: {
    clipPath: 'inset(0% 0% 0% 0%)',
    y: 0,
    transition: { duration: 1, ease: EASE_IN_OUT },
    transitionEnd: { clipPath: 'none' },
  },
}

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', duration: 0.6, bounce: 0.25 } },
}

export const stagger = (gap = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
})

export function useIsNarrow() {
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const on = () => setNarrow(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return narrow
}

/**
 * Vertical parallax offset for an element as it crosses the viewport.
 * `distance` px of travel in total (positive moves slower than scroll, negative faster).
 */
export function useParallax(distance: number): [RefObject<HTMLDivElement | null>, MotionValue<number>] {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const narrow = useIsNarrow()
  const d = reduce ? 0 : narrow ? distance * 0.45 : distance
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-d / 2, d / 2])
  return [ref, y]
}

