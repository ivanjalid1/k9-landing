import { useState, useEffect } from 'react'
import { Reveal } from '../../hooks/useScrollReveal'

const services = [
  {
    image: 'https://images.unsplash.com/photo-1558929996-da64ba858215?w=800&q=80',
    imageAlt: 'Dog walking on trail through nature',
    title: 'DOG WALKING',
    tagline: 'Exercise, explore & socialize',
    highlights: ['Neighbourhood & trail walks', 'Attentive, experienced walkers', 'Group walks available (max 6)'],
    from: '$30',
    popular: true,
    detail: {
      description: 'This service provides the opportunity for your pet to stretch, exercise, sniff and of course enable them to do their bathroom business around the neighbourhood.',
      extra: 'Group or Pack Walks are available to give the opportunity for your pet to get more socialized and travel to different locations to keep the day interesting. Our groups are kept small — maximum group size is 6, for your dog\'s safety.',
      pricing: [
        { label: '30 min', price: '$30' },
        { label: '45 min', price: '$40' },
        { label: '1 hour', price: '$50' },
      ],
      notes: ['Additional dog: $15'],
    },
  },
  {
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
    imageAlt: 'Happy dog being visited at home',
    title: 'DOG VISIT / DROP IN',
    tagline: 'Love & care while you\'re away',
    highlights: ['Play, cuddle & potty breaks', 'In the comfort of your home', 'Flexible scheduling'],
    from: '$30',
    detail: {
      description: 'We will visit your furry friend in the comfort of your home — we will play and cuddle, as well as give the opportunity to potty.',
      extra: 'This service provides the opportunity for your pet to stretch, exercise, sniff and of course enable them to do their bathroom business.',
      pricing: [
        { label: '30 min', price: '$30' },
        { label: '45 min', price: '$40' },
        { label: '1 hour', price: '$50' },
      ],
      notes: ['Additional dog: $15'],
    },
  },
  {
    image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=800&q=80',
    imageAlt: 'Cat being cared for at home',
    title: 'CAT VISIT / DROP IN',
    tagline: 'Purr-fect care for your feline',
    highlights: ['Feeding & fresh water', 'Litter clean-up', 'Tons of playtime & love'],
    from: '$27',
    detail: {
      description: 'For our adorable cat clients, we also offer feedings, fresh water and litter clean-up as well as tons and tons of playing time.',
      pricing: [
        { label: '30 min', price: '$27' },
        { label: 'Weekends & Holidays (30 min)', price: '$35' },
      ],
      notes: ['Additional cat: $12'],
    },
  },
  {
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80',
    imageAlt: 'Dog relaxing at home with sitter',
    title: 'HOUSE SITTING',
    tagline: 'Overnight care, zero stress',
    highlights: ['3 daily walks included', 'Overnight stay at your home', 'Full care for all your pets'],
    from: '$120',
    badge: 'Best Value',
    detail: {
      description: 'House sitting is an excellent way to ensure low stress on you and your furry friend. We will provide all the care needed for your pets at home.',
      extra: 'This service includes 3 walks or visits of 30 min during the day and overnight staying, plus feeding and water refresh.',
      pricing: [
        { label: 'Per night', price: '$120' },
        { label: 'Two dogs', price: '$145' },
      ],
      notes: [
        'Additional cat: $15',
        'Weekends & Evenings: +$10',
        'Holidays: +$20',
      ],
    },
  },
]

/* ─── Modal ─── */
function ServiceModal({ service, onClose }: { service: typeof services[number]; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 max-md:p-3 animate-[fadeIn_0.25s_ease-out]"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal content */}
      <div
        className="relative z-[1] w-full max-w-[640px] max-h-[90vh] overflow-y-auto bg-[#111] border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.8),0_0_80px_rgba(232,168,56,0.1)] animate-[modalIn_0.3s_cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header image */}
        <div className="relative h-[240px] max-md:h-[180px] overflow-hidden">
          <img
            src={service.image}
            alt={service.imageAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[rgba(17,17,17,0.4)] to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-sm border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all duration-300"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>

          {/* Badges */}
          {service.popular && (
            <div className="absolute top-4 left-4 bg-[#E8A838] text-[#0a0a0a] text-[0.68rem] font-bold tracking-[0.15em] uppercase px-3.5 py-1.5 shadow-[0_4px_20px_rgba(232,168,56,0.4)]">
              Most Popular
            </div>
          )}
          {service.badge && !service.popular && (
            <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md text-white text-[0.68rem] font-bold tracking-[0.15em] uppercase px-3.5 py-1.5 border border-[rgba(232,168,56,0.4)]">
              {service.badge}
            </div>
          )}

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-7 max-md:p-5">
            <h3 className="font-[family-name:var(--font-landing-display)] text-[clamp(1.8rem,4vw,2.4rem)] tracking-[0.08em] text-white leading-none mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              {service.title}
            </h3>
            <p className="text-[1rem] font-[family-name:var(--font-landing-accent)] italic text-white/70">
              {service.tagline}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-7 max-md:p-5 flex flex-col gap-6">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-[0.72rem] font-semibold tracking-[0.15em] uppercase text-white/50">From</span>
            <span className="font-[family-name:var(--font-landing-display)] text-[2.5rem] text-[#E8A838] leading-none tracking-wide">
              {service.from}
            </span>
          </div>

          {/* Description */}
          <p className="text-[0.95rem] text-white/60 leading-[1.7]">
            {service.detail.description}
          </p>

          {service.detail.extra && (
            <p className="text-[0.88rem] text-white/45 leading-[1.7] pl-4 border-l-2 border-[rgba(232,168,56,0.25)]">
              {service.detail.extra}
            </p>
          )}

          {/* Highlights */}
          <ul className="flex flex-col gap-2.5">
            {service.highlights.map((h, i) => (
              <li key={i} className="flex items-center gap-2.5 text-[0.9rem] text-white/60">
                <svg className="w-4 h-4 text-[#E8A838] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                {h}
              </li>
            ))}
          </ul>

          {/* Pricing table */}
          <div className="bg-white/[0.04] border border-white/10 p-5">
            <div className="text-[0.72rem] font-semibold tracking-[0.15em] uppercase text-[#E8A838] mb-3">Pricing</div>
            <div className="flex flex-col gap-2.5">
              {service.detail.pricing.map((row, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-[0.9rem] text-white/55">{row.label}</span>
                  <span className="font-[family-name:var(--font-landing-display)] text-[1.3rem] text-[#E8A838] tracking-wide">{row.price}</span>
                </div>
              ))}
            </div>
            {service.detail.notes.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/[0.06] flex flex-col gap-1">
                {service.detail.notes.map((note, i) => (
                  <span key={i} className="text-[0.78rem] italic text-white/35">* {note}</span>
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <a
            href="#intake"
            className="inline-flex items-center justify-center gap-2.5 bg-[#E8A838] text-[#0a0a0a] text-[0.85rem] font-bold tracking-[0.15em] uppercase px-8 py-[16px] hover:bg-[#F0B840] hover:shadow-[0_0_40px_rgba(232,168,56,0.3)] transition-all duration-400 w-full"
          >
            Book Now
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>

        {/* Gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#E8A838] to-transparent" />
      </div>
    </div>
  )
}

/* ─── Card (no expand, opens modal) ─── */
interface ServiceCardProps {
  service: typeof services[number]
  index: number
  onSelect: () => void
}
function ServiceCard({ service, index, onSelect }: ServiceCardProps) {
  return (
    <Reveal delay={index * 200}>
      <div
        className="group relative h-full overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(232,168,56,0.15)] cursor-pointer"
        onClick={onSelect}
      >
        {/* Full background image */}
        <div className="absolute inset-0 z-0">
          <img
            src={service.image}
            alt={service.imageAlt}
            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
          />
        </div>
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#0a0a0a] via-[rgba(10,10,10,0.75)] to-[rgba(10,10,10,0.2)] transition-all duration-500" />
        {/* Gold glow on hover */}
        <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_50%_100%,rgba(232,168,56,0.15)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* Gold top border */}
        <div className="absolute top-0 left-0 right-0 h-[3px] z-[3] bg-gradient-to-r from-transparent via-[#E8A838] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Popular badge */}
        {service.popular && (
          <div className="absolute top-5 right-5 z-[3] bg-[#E8A838] text-[#0a0a0a] text-[0.68rem] font-bold tracking-[0.15em] uppercase px-3.5 py-1.5 shadow-[0_4px_20px_rgba(232,168,56,0.4)]">
            Most Popular
          </div>
        )}
        {service.badge && !service.popular && (
          <div className="absolute top-5 right-5 z-[3] bg-white/10 backdrop-blur-md text-white text-[0.68rem] font-bold tracking-[0.15em] uppercase px-3.5 py-1.5 border border-[rgba(232,168,56,0.4)]">
            {service.badge}
          </div>
        )}

        {/* Content */}
        <div className="relative z-[2] flex flex-col justify-end min-h-[480px] max-md:min-h-[420px] p-8 max-md:p-6">
          {/* Price badge */}
          <div className="mb-4">
            <span className="text-[0.72rem] font-semibold tracking-[0.15em] uppercase text-white/50">From</span>
            <span className="ml-2 font-[family-name:var(--font-landing-display)] text-[2.5rem] text-[#E8A838] leading-none tracking-wide drop-shadow-[0_2px_12px_rgba(232,168,56,0.3)]">
              {service.from}
            </span>
          </div>

          <h3 className="font-[family-name:var(--font-landing-display)] text-[clamp(1.8rem,3vw,2.2rem)] tracking-[0.08em] text-white leading-none mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            {service.title}
          </h3>

          <p className="text-[1rem] font-[family-name:var(--font-landing-accent)] italic text-white/70 mb-5">
            {service.tagline}
          </p>

          {/* Highlights */}
          <ul className="flex flex-col gap-2 mb-7">
            {service.highlights.map((h, i) => (
              <li key={i} className="flex items-center gap-2.5 text-[0.88rem] text-white/60">
                <svg className="w-4 h-4 text-[#E8A838] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                {h}
              </li>
            ))}
          </ul>

          {/* CTA buttons */}
          <div className="flex gap-3">
            <a
              href="#intake"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center justify-center gap-2.5 bg-[#E8A838] text-[#0a0a0a] text-[0.82rem] font-bold tracking-[0.15em] uppercase px-8 py-[14px] hover:bg-[#F0B840] hover:shadow-[0_0_40px_rgba(232,168,56,0.3)] transition-all duration-400 flex-1"
            >
              Book Now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
            <button
              onClick={(e) => { e.stopPropagation(); onSelect() }}
              className="flex items-center justify-center w-[50px] border-2 border-white/20 text-white/60 hover:border-[#E8A838] hover:text-[#E8A838] transition-all duration-400"
              aria-label="View details"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

export function Services() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  return (
    <>
      <section id="services" className="py-[120px] max-md:py-[80px] bg-gradient-to-b from-[#0a0a0a] to-[#111] relative scroll-mt-20">
        <div className="max-w-[1240px] mx-auto px-[clamp(20px,5vw,60px)]">
          {/* Header */}
          <Reveal>
            <div className="text-center mb-[72px] max-md:mb-[48px]">
              <div className="text-[0.78rem] font-semibold tracking-[0.25em] uppercase text-[#E8A838] mb-4">
                What We Offer
              </div>
              <h2 className="font-[family-name:var(--font-landing-display)] text-[clamp(3rem,6vw,4.5rem)] tracking-[0.04em] text-white leading-none mb-4">
                OUR SERVICES
              </h2>
              <p className="text-[1.05rem] font-light text-white/50 max-w-[500px] mx-auto">
                Professional pet care tailored to your furry friend's unique needs
              </p>
            </div>
          </Reveal>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1 max-md:max-w-[500px] max-md:mx-auto">
            {services.map((service, i) => (
              <ServiceCard
                key={i}
                service={service}
                index={i}
                onSelect={() => setSelectedIndex(i)}
              />
            ))}
          </div>

          {/* Trust line */}
          <Reveal>
            <div className="text-center mt-14 flex flex-col items-center gap-3">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#E8A838]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ))}
              </div>
              <p className="text-[0.9rem] text-white/40 font-light">
                Trusted by pet families across Halton & surrounding areas
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Modal */}
      {selectedIndex !== null && (
        <ServiceModal
          service={services[selectedIndex]}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </>
  )
}
