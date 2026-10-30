import { useRef } from 'react'
import leafOrange from '../assets/leaves/leaf-2-orange.svg'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { BookLink } from './ui'
import { Pine, Reveal } from './motion'
import { clipUp, fadeUp, popIn, stagger } from '../lib/motion'
import { CONTACT } from '../config'

const steps = [
  {
    title: 'Assessment',
    body: 'We meet you and your dog, evaluate behaviour and talk through what you want to achieve together.',
  },
  {
    title: 'Plan',
    body: 'You get a personalized training plan built around your dog, with clear goals we can measure.',
  },
  {
    title: 'Train outdoors',
    body: 'Structured sessions on trails, in parks and in busy places, so your dog is ready for the real world.',
  },
]

/** Trail of 45° dashes (echoing the Stride pattern) that draws itself as the steps scroll into view. */
function Connector({ progress, index }: { progress: MotionValue<number>; index: number }) {
  const reduce = useReducedMotion()
  const scaleX = useTransform(progress, [index * 0.45, index * 0.45 + 0.55], [reduce ? 1 : 0, 1])
  return (
    <motion.span
      aria-hidden="true"
      style={{ scaleX }}
      className="hidden h-3 flex-1 origin-left bg-[repeating-linear-gradient(-45deg,transparent_0_5px,rgb(63_114_115/0.55)_5px_7px)] lg:block"
    />
  )
}

export function Process() {
  const listRef = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 85%', 'start 35%'] })
  return (
    <section id="process" aria-labelledby="process-title" className="relative isolate overflow-hidden bg-cloud py-24 sm:py-32">
      <Pine src={leafOrange} width={300} height={151} depth={-100} className="absolute right-[4%] top-14 -z-10 w-16 sm:w-24" imgClassName="rotate-[160deg]" />
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal as="h2" variants={clipUp} className="display max-w-[16ch] text-[clamp(2rem,4.6vw,4rem)] text-night">
            <span id="process-title">How training works.</span>
          </Reveal>
          <Reveal as="p" delay={0.15} className="max-w-[44ch] text-[1.05rem] leading-relaxed text-ink/75">
            Every dog is different, so every program starts the same way: by getting to know your dog.
          </Reveal>
        </div>

        <motion.ol
          ref={listRef}
          variants={stagger(0.18)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          className="mt-14 grid gap-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-8"
        >
          {steps.map((s, i) => (
            <motion.li key={s.title} variants={fadeUp} className="relative sm:last:col-span-2 lg:last:col-span-1">
              <div className="flex items-center gap-4">
                <motion.span
                  variants={popIn}
                  className="display grid size-14 shrink-0 place-items-center rounded-full bg-forest text-[1.4rem] text-cloud"
                >
                  {i + 1}
                </motion.span>
                {i < steps.length - 1 && <Connector progress={scrollYProgress} index={i} />}
              </div>
              <h3 className="display mt-6 text-[1.5rem] text-night sm:text-[1.7rem]">{s.title}</h3>
              <p className="mt-3 max-w-[38ch] text-[1rem] leading-relaxed text-ink/75">{s.body}</p>
            </motion.li>
          ))}
        </motion.ol>

        <Reveal className="mt-14 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <BookLink>Book an assessment</BookLink>
          <p className="text-[0.95rem] text-ink/70">
            Questions first? Call{' '}
            <a href={CONTACT.phoneHref} className="font-semibold text-night underline underline-offset-4 hover:text-forest">
              {CONTACT.phone}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
