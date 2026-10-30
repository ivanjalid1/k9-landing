import { motion } from 'motion/react'
import { towns } from '../data/towns'
import { BrandIcon } from './ui'
import { Stagger } from './motion'
import { fadeUp } from '../lib/motion'

/** Service-area page: a short paragraph for each town, each with its own anchor. */
export function TownDetails() {
  return (
    <section aria-label="Towns we serve" className="bg-night py-24 text-cloud sm:py-32">
      <Stagger gap={0.12} className="mx-auto grid max-w-[1320px] gap-5 px-4 sm:px-8 md:grid-cols-2">
        {towns.map((t) => (
          <motion.article
            key={t.slug}
            id={t.slug}
            variants={fadeUp}
            className="group round-card scroll-mt-24 bg-forest/40 p-7 sm:p-10"
          >
            <div className="flex items-center gap-4">
              <BrandIcon name="location" className="size-9 text-mist transition-transform duration-300 ease-out group-hover:-translate-y-1" />
              <h2 className="display text-[clamp(1.5rem,2.6vw,2.2rem)]">{t.name}</h2>
            </div>
            {t.body.map((p) => (
              <p key={p} className="mt-5 max-w-[56ch] text-[1.02rem] leading-relaxed text-cloud/85">
                {p}
              </p>
            ))}
          </motion.article>
        ))}
      </Stagger>
    </section>
  )
}
