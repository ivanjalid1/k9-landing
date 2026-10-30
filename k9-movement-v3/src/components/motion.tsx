/** Motion components. Variants and hooks live in src/lib/motion.ts. */
import type { ReactNode, PointerEvent } from 'react'
import { motion, useReducedMotion, useSpring, useMotionValue, type Variants } from 'motion/react'
import { EASE_OUT, VIEWPORT, fadeOnly, fadeUp, stagger, useParallax } from '../lib/motion'

/* ------------------------------------------------------------------ */
/* Reveal wrappers                                                     */
/* ------------------------------------------------------------------ */

type RevealProps = {
  children: ReactNode
  variants?: Variants
  className?: string
  delay?: number
  as?: 'div' | 'p' | 'h2' | 'h3' | 'ul' | 'ol' | 'article' | 'blockquote'
}

/** Animates once when scrolled into view. */
export function Reveal({ children, variants = fadeUp, className, delay = 0, as = 'div' }: RevealProps) {
  const Tag = motion[as]
  const reduce = useReducedMotion()
  const base = reduce ? fadeOnly : variants
  const show = base.show as Record<string, unknown>
  const v: Variants = delay
    ? { ...base, show: { ...show, transition: { ...(show.transition as object), delay } } }
    : base
  return (
    <Tag className={className} variants={v} initial="hidden" whileInView="show" viewport={VIEWPORT}>
      {children}
    </Tag>
  )
}

/** Parent that staggers motion children using the "hidden" / "show" variant names. */
export function Stagger({
  children,
  className,
  gap = 0.08,
  delay = 0,
  as = 'div',
}: Omit<RevealProps, 'variants'> & { gap?: number }) {
  const Tag = motion[as]
  return (
    <Tag className={className} variants={stagger(gap, delay)} initial="hidden" whileInView="show" viewport={VIEWPORT}>
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/* Scroll-linked helpers                                               */
/* ------------------------------------------------------------------ */

/**
 * Decorative pine element: parallax on the outer layer, slow CSS sway on the image.
 * `className` positions the outer layer; `imgClassName` keeps the static orientation.
 */
export function Pine({
  src,
  width,
  height,
  className = '',
  imgClassName = '',
  depth = 80,
  sway = 'slow',
}: {
  src: string
  width: number
  height: number
  className?: string
  imgClassName?: string
  depth?: number
  sway?: 'slow' | 'slower'
}) {
  const [ref, y] = useParallax(depth)
  return (
    <motion.div ref={ref} aria-hidden="true" style={{ y }} className={`pointer-events-none ${className}`}>
      <img
        src={src}
        alt=""
        loading="lazy"
        width={width}
        height={height}
        className={`w-full ${sway === 'slow' ? 'animate-sway' : 'animate-sway-slow'} ${imgClassName}`}
      />
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Pointer-driven effects (mouse / trackpad only)                      */
/* ------------------------------------------------------------------ */

const isFinePointer = (e: PointerEvent) => e.pointerType === 'mouse'

/** Pulls its child a few pixels toward the cursor. */
export function Magnetic({ children, strength = 0.25, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const reduce = useReducedMotion()
  const x = useSpring(0, { stiffness: 220, damping: 18, mass: 0.6 })
  const y = useSpring(0, { stiffness: 220, damping: 18, mass: 0.6 })

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || !isFinePointer(e)) return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset} className={`inline-flex [&>*]:flex-1 ${className}`}>
      {children}
    </motion.div>
  )
}

/** Subtle 3D tilt that follows the cursor. */
export function Tilt({ children, className = '', max = 6 }: { children: ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotion()
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const rotateX = useSpring(rx, { stiffness: 160, damping: 16 })
  const rotateY = useSpring(ry, { stiffness: 160, damping: 16 })

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || !isFinePointer(e)) return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * max * 2)
    rx.set(-py * max * 2)
  }
  const reset = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <div className={`[perspective:900px] ${className}`}>
      <motion.div style={{ rotateX, rotateY }} onPointerMove={onMove} onPointerLeave={reset} className="h-full">
        {children}
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Text                                                                */
/* ------------------------------------------------------------------ */

/** Reveals text word by word when scrolled into view. Screen readers get the full string. */
export function WordReveal({ text, className = '' }: { text: string; className?: string }) {
  const words = text.split(' ')
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <motion.span aria-hidden="true" variants={stagger(0.045)} initial="hidden" whileInView="show" viewport={VIEWPORT}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '105%', opacity: 0 },
              show: { y: '0%', opacity: 1, transition: { duration: 0.7, ease: EASE_OUT } },
            }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
      </motion.span>
    </span>
  )
}
