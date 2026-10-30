import { useState } from 'react'
import leafGreen from '../assets/leaves/leaf-1.svg'
import leafOrange from '../assets/leaves/leaf-2-orange.svg'
import { motion } from 'motion/react'
import { publishedFaq } from '../data/faq'
import { Pine, Stagger } from './motion'
import { fadeUp } from '../lib/motion'

/** Accordion of confirmed FAQ items (placeholders marked `todo` are filtered out in the data file). */
export function FaqList() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section aria-label="Frequently asked questions" className="relative overflow-hidden bg-cloud py-20 sm:py-28">
      <div aria-hidden="true" className="texture-map animate-drift-slow opacity-[0.1]" />
      <Pine src={leafGreen} width={300} height={150} depth={-120} className="absolute right-[5%] top-24 hidden w-24 md:block lg:w-32" imgClassName="rotate-[30deg]" />
      <Pine src={leafOrange} width={300} height={151} depth={100} sway="slower" className="absolute bottom-24 left-[4%] hidden w-20 md:block lg:w-24" imgClassName="-rotate-[40deg]" />
      <div className="relative mx-auto max-w-[920px] px-4 sm:px-8">
        <Stagger as="ul" gap={0.06} className="border-t border-night/15">
          {publishedFaq.map((item, i) => {
            const isOpen = open === i
            const id = `faq-${i}`
            return (
              <motion.li key={item.q} variants={fadeUp} className="border-b border-night/15">
                <h2>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={id}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group/q flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="text-[1.15rem] font-bold text-ink sm:text-[1.25rem]">{item.q}</span>
                    <span
                      aria-hidden="true"
                      className="grid size-9 shrink-0 place-items-center rounded-full bg-night/8 text-night transition-[background-color,color,scale] duration-200 ease-out group-hover/q:bg-night group-hover/q:text-cloud group-active/q:scale-[0.92]"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                        <path d="M8 2v12M2 8h12" />
                      </svg>
                    </span>
                  </button>
                </h2>
                <div
                  id={id}
                  inert={!isOpen}
                  className={`grid transition-[grid-template-rows] duration-400 ease-out-quint ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden">
                    <div
                      className={`pb-7 transition-[opacity,translate] ease-out ${isOpen ? 'translate-y-0 opacity-100 delay-100 duration-500' : '-translate-y-2 opacity-0 duration-200'}`}
                    >
                      {item.a.map((p) => (
                        <p key={p} className="mt-3 max-w-[64ch] text-[1.02rem] leading-relaxed text-ink/80 first:mt-0">
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.li>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}
