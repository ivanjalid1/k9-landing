import { motion } from 'motion/react'
import { Reveal, Tilt } from './motion'
import { clipUp, useParallax } from '../lib/motion'

/** Portrait photo card with parallax, masked reveal and hover tilt. */
export function DogPhoto({
  src,
  alt,
  name,
  depth,
  width,
  height,
  className = '',
}: {
  src: string
  alt: string
  name: string
  depth: number
  width: number
  height: number
  className?: string
}) {
  const [ref, y] = useParallax(depth)
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      <Reveal variants={clipUp}>
        <Tilt>
          <figure className="overflow-hidden rounded-2xl bg-cloud shadow-[0_30px_60px_-24px_rgb(0_0_0/0.6)]">
            <img src={src} alt={alt} loading="lazy" width={width} height={height} className="aspect-[3/4] w-full object-cover outline outline-1 -outline-offset-1 outline-black/10" />
            <figcaption className="display px-4 py-3 text-[1.05rem] text-night">{name}</figcaption>
          </figure>
        </Tilt>
      </Reveal>
    </motion.div>
  )
}
