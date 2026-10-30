import { useState } from 'react'
import { motion } from 'motion/react'
import { careGroups, type CareService } from '../data/services'
import fir from '../assets/pine/fir.webp'
import { BookLink, BrandIcon, NoBreakHyphens } from './ui'
import { Pine, Reveal, Stagger } from './motion'
import { fadeUp } from '../lib/motion'

function ServiceRow({ service, open, onToggle }: { service: CareService; open: boolean; onToggle: () => void }) {
  const panelId = `${service.id}-details`
  return (
    <motion.li variants={fadeUp} className="border-t border-night/15 first:border-t-0">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="group/row grid w-full grid-cols-[1fr_auto] items-start gap-x-4 gap-y-1 py-5 text-left"
        >
          <span className="text-[1.15rem] font-bold text-ink">{service.name}</span>
          <span className="row-span-2 flex items-center gap-3 pt-0.5">
            <span className="text-right text-[0.85rem] leading-tight text-ink/65">
              {service.from ? (
                <>
                  from <span className="block font-display text-[1.35rem] font-extrabold text-night [font-stretch:125%]">{service.from}</span>
                </>
              ) : (
                <span className="block max-w-[11ch]">Application required</span>
              )}
            </span>
            <span
              aria-hidden="true"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-night/8 text-night transition-[background-color,color,scale] duration-200 ease-out group-hover/row:bg-night group-hover/row:text-cloud group-active/row:scale-[0.92]"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
                <path d="M8 2v12M2 8h12" />
              </svg>
            </span>
          </span>
          <span className="max-w-[46ch] text-[0.95rem] leading-snug text-ink/70">{service.summary}</span>
        </button>
      </h3>

      <div
        id={panelId}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-400 ease-out-quint ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          {/* Content settles in just after the row opens; leaves faster than it arrives. */}
          <div
            className={`pb-7 transition-[opacity,translate] ease-out ${open ? 'translate-y-0 opacity-100 delay-100 duration-500' : '-translate-y-2 opacity-0 duration-200'}`}
          >
            {service.description.map((p) => (
              <p key={p} className="mt-3 max-w-[60ch] text-[0.98rem] leading-relaxed text-ink/80 first:mt-0">
                {p}
              </p>
            ))}
            {service.rates && (
              <table className="mt-5 w-full max-w-md text-[0.95rem]">
                <caption className="sr-only">{service.name} rates</caption>
                <tbody>
                  {service.rates.map((r) => (
                    <tr key={r.label} className="border-b border-night/10">
                      <th scope="row" className="py-2.5 pr-4 text-left font-normal text-ink/80">{r.label}</th>
                      <td className="py-2.5 text-right font-bold tabular-nums text-ink">{r.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {service.notes && (
              <ul className="mt-3 flex flex-col gap-1 text-[0.88rem] text-ink/65">
                {service.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            )}
            <BookLink className="mt-6">{service.cta}</BookLink>
          </div>
        </div>
      </div>
    </motion.li>
  )
}

/** Walks, drop-ins and overnight care, with expandable rate tables. */
export function CareServices() {
  const [openId, setOpenId] = useState<string | null>(null)
  const toggle = (id: string) => setOpenId((cur) => (cur === id ? null : id))

  return (
    <section aria-label="Pet care services and rates" className="relative overflow-hidden bg-cloud py-20 sm:py-28">
      <div aria-hidden="true" className="texture-map animate-drift-slow opacity-[0.12]" />

      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-8">
        <div className="relative">
          <Pine
            src={fir}
            width={560}
            height={367}
            depth={-110}
            sway="slower"
            className="absolute -right-14 -top-16 z-10 hidden w-56 sm:block lg:-right-20 lg:w-64"
            imgClassName="rotate-[200deg]"
          />
          <Stagger gap={0.15} className="grid items-start gap-5 lg:grid-cols-2">
            {careGroups.map((group) => (
              <motion.article
                key={group.id}
                id={group.id}
                variants={fadeUp}
                className="group round-card scroll-mt-24 bg-cloud/90 px-6 pt-7 ring-1 ring-night/12 backdrop-blur-sm sm:px-9 sm:pt-9"
              >
                <div className="flex items-center gap-4 pb-2">
                  <BrandIcon name={group.icon} className="size-11 text-forest transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:rotate-6" />
                  <h2 className="display text-[1.35rem] text-night sm:text-[1.6rem]"><NoBreakHyphens text={group.title} /></h2>
                </div>
                <Stagger as="ul" gap={0.07} delay={0.2} className="mt-2">
                  {group.services.map((s) => (
                    <ServiceRow key={s.id} service={s} open={openId === s.id} onToggle={() => toggle(s.id)} />
                  ))}
                </Stagger>
              </motion.article>
            ))}
          </Stagger>
        </div>

        <Reveal className="group round-card mt-5 flex flex-col gap-4 bg-forest/10 px-6 py-5 sm:flex-row sm:items-center sm:px-9">
          <BrandIcon name="transport" className="h-9 w-12 text-forest transition-transform duration-500 ease-out group-hover:translate-x-1.5" />
          <p className="text-[1rem] text-ink/80">
            <strong className="font-bold text-ink">Pet transportation</strong> is available on request. Ask us about it
            when you book.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
