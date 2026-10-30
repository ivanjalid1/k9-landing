import { motion } from 'motion/react'
import emmaField from '../assets/photos/emma-field.webp'
import emmaWoods from '../assets/photos/emma-woods.webp'
import sprig from '../assets/pine/spruce-sprig.webp'
import { emmaBio } from '../data/pack'
import { Pine, Reveal, Stagger, WordReveal } from './motion'
import { clipUp, fadeUp, useParallax } from '../lib/motion'

/** About page: Emma, in her own words, with two photos of her outdoors with Angel. */
export function Founder() {
  const [smallRef, smallY] = useParallax(-50)
  return (
    <section id="emma" aria-labelledby="emma-title" className="relative isolate overflow-hidden bg-night py-24 text-cloud sm:py-32">
      <div className="mx-auto grid max-w-[1320px] gap-14 px-4 sm:px-8 lg:grid-cols-12 lg:gap-10">
        <div className="relative self-start pb-[22%] lg:col-span-6">
          <Reveal variants={clipUp}>
            <img
              src={emmaField}
              alt="Emma sitting in a field of purple wildflowers with Angel"
              width={1600}
              height={900}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-2xl object-cover object-[35%_50%] sm:rounded-[1.75rem]"
            />
          </Reveal>
          <motion.div ref={smallRef} style={{ y: smallY }} className="absolute bottom-0 right-0 w-[56%] sm:w-[48%]">
            <Reveal variants={clipUp} delay={0.2}>
              <img
                src={emmaWoods}
                alt="Emma sharing a snack with Angel on a fallen log during a hike in the woods"
                width={1200}
                height={798}
                loading="lazy"
                className="aspect-[3/2] w-full rounded-2xl object-cover shadow-[0_30px_60px_-20px_rgb(0_0_0/0.7)] ring-4 ring-night sm:rounded-[1.5rem]"
              />
            </Reveal>
          </motion.div>
          <Pine
            src={sprig}
            width={480}
            height={389}
            depth={-140}
            className="absolute -left-10 -top-14 z-10 hidden w-40 sm:block"
            imgClassName="-scale-y-100 rotate-[200deg]"
          />
        </div>

        <div className="lg:col-span-6 lg:pl-8">
          <Reveal as="h2" variants={clipUp} className="display text-[clamp(2rem,4.6vw,4rem)]">
            <span id="emma-title">Meet Emma.</span>
          </Reveal>
          <Stagger gap={0.1} delay={0.1} className="mt-8 flex max-w-[60ch] flex-col gap-5 text-[1.05rem] leading-relaxed text-cloud/85">
            {emmaBio.map((p) => (
              <motion.p key={p} variants={fadeUp}>
                {p}
              </motion.p>
            ))}
          </Stagger>

          <blockquote className="mt-10 border-l-4 border-mist pl-6">
            <p className="display text-[clamp(1.15rem,2vw,1.5rem)] leading-tight text-cloud">
              <WordReveal text="“We treat your dog like our own — because we know what that means.”" />
            </p>
            <Reveal as="div" delay={0.6} className="mt-4 text-[0.95rem] text-cloud/70">
              <footer>Emma Vázquez, founder</footer>
            </Reveal>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
