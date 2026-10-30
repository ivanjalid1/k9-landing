import { motion } from 'motion/react'
import { training } from '../data/services'
import { BookLink, BrandIcon } from './ui'
import { Reveal, Stagger } from './motion'
import { clipUp, fadeUp, scaleIn } from '../lib/motion'

/** Training page: what the assessment is and what the programs look like. */
export function TrainingDetail() {
  return (
    <section aria-labelledby="training-detail-title" className="relative overflow-hidden bg-cloud py-24 sm:py-32">
      <div aria-hidden="true" className="texture-map animate-drift-slow opacity-[0.12]" />
      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-8">
        <Reveal as="h2" variants={clipUp} className="display max-w-[18ch] text-[clamp(2rem,4.6vw,4rem)] text-night">
          <span id="training-detail-title">Real discipline. Real results.</span>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:mt-20 lg:grid-cols-2">
          <Reveal
            as="article"
            variants={scaleIn}
            className="group round-card bg-night p-7 text-cloud sm:p-10 lg:p-12"
          >
            <BrandIcon name="discipline" className="size-14 text-mist transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:-rotate-6" />
            <h3 className="display mt-8 text-[clamp(1.6rem,2.6vw,2.2rem)]">The Training Assessment</h3>
            <p className="mt-5 max-w-[52ch] text-[1.05rem] leading-relaxed text-cloud/85">
              Every program starts here. We meet you and your dog, evaluate behaviour and talk through what you want to
              achieve together. You come away with a personalized training plan built around your dog.
            </p>
            <BookLink className="mt-8">{training.cta}</BookLink>
          </Reveal>

          <Reveal
            as="article"
            variants={scaleIn}
            delay={0.12}
            className="group round-card bg-cloud/90 p-7 ring-1 ring-inset ring-night/15 backdrop-blur-sm sm:p-10 lg:p-12"
          >
            <BrandIcon name="outside" className="size-14 text-forest transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-6" />
            <h3 className="display mt-8 text-[clamp(1.6rem,2.6vw,2.2rem)] text-night">Structured programs</h3>
            <p className="mt-5 max-w-[52ch] text-[1.05rem] leading-relaxed text-ink/75">
              Training has structure, demand and measurable results. Sessions happen outdoors, so what your dog learns
              holds up on everyday walks. Every dog is different, and so is every plan.
            </p>
            <Stagger as="ul" gap={0.1} delay={0.2} className="mt-6 flex flex-col">
              {training.points.map((p) => (
                <motion.li key={p} variants={fadeUp} className="flex gap-3 border-t border-night/15 py-3.5 text-[1rem] text-ink/85">
                  <span aria-hidden="true" className="mt-[0.55em] h-0.5 w-4 shrink-0 -rotate-45 bg-forest" />
                  {p}
                </motion.li>
              ))}
            </Stagger>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
