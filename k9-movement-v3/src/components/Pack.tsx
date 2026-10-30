import { motion } from 'motion/react'
import leafGreen from '../assets/leaves/leaf-1.svg'
import leafOrange from '../assets/leaves/leaf-2-orange.svg'
import { pack } from '../data/pack'
import { Pine, Reveal, Stagger } from './motion'
import { clipUp, fadeUp } from '../lib/motion'

/** About page: Angel, Romeo, Bonita and Casper. */
export function Pack() {
  return (
    <section id="pack" aria-labelledby="pack-title" className="relative isolate overflow-hidden bg-cloud py-24 sm:py-32">
      <div aria-hidden="true" className="texture-map animate-drift-slow -z-10 opacity-[0.12]" />
      <Pine src={leafOrange} width={300} height={151} depth={-120} className="absolute right-[6%] top-16 -z-10 w-20 sm:w-28" imgClassName="rotate-[24deg]" />
      <Pine src={leafGreen} width={300} height={150} depth={90} sway="slower" className="absolute -left-6 bottom-24 -z-10 hidden w-24 sm:block lg:w-32" imgClassName="-rotate-[30deg]" />

      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <div className="max-w-3xl">
          <Reveal as="h2" variants={clipUp} className="display text-[clamp(2rem,4.6vw,4rem)] text-night">
            <span id="pack-title">The pack.</span>
          </Reveal>
          <Reveal as="p" delay={0.15} className="mt-6 max-w-[56ch] text-[1.05rem] leading-relaxed text-ink/75">
            Two rescue dogs and two cats. Angel and Romeo were rescued from the same high-kill shelter in Georgia; watching
            them rebuild their sense of safety through consistency and trust is where our belief in real training was born.
          </Reveal>
        </div>

        <Stagger as="ul" gap={0.1} className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {pack.map((m) => (
            <motion.li key={m.name} variants={fadeUp} className="group round-card flex flex-col bg-cloud ring-1 ring-inset ring-night/12">
              <div className="overflow-hidden">
                <img
                  src={m.photo}
                  alt={m.alt}
                  width={m.width}
                  height={m.height}
                  loading="lazy"
                  style={m.position ? { objectPosition: m.position } : undefined}
                  className="aspect-[5/4] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <h3 className="display text-[1.5rem] text-night">{m.name}</h3>
                <p className="mt-1 text-[0.9rem] font-semibold text-forest">{m.tag}</p>
                <p className="mt-4 text-[0.98rem] leading-relaxed text-ink/80">{m.body}</p>
              </div>
            </motion.li>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
