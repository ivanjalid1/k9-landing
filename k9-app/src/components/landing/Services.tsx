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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div
        className="relative z-[1] w-full max-w-[640px] max-h-[90vh] overflow-y-auto bg-white border border-[#E5E0D8] rounded-sm shadow-[0_40px_120px_rgba(0,0,0,0.15),0_0_60px_rgba(196,137,30,0.08)] animate-[modalIn_0.3s_cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-[240px] max-md:h-[180px] overflow-hidden">
          <img src={service.image} alt={service.imageAlt} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-[rgba(255,255,255,0.3)] to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-[#E5E0D8] text-[#5C574D] hover:text-[#2A2520] hover:border-[#C4891E] transition-all duration-300"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>

          {service.popular && (
            <div className="absolute top-4 left-4 bg-[#2d5a42] text-white text-[0.68rem] font-bold tracking-[0.15em] uppercase px-3.5 py-1.5">
              Most Popular
            </div>
          )}
          {service.badge && !service.popular && (
            <div className="absolute top-4 left-4 bg-[#C4891E] text-white text-[0.68rem] font-bold tracking-[0.15em] uppercase px-3.5 py-1.5">
              {service.badge}
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-7 max-md:p-5">
            <h3 className="font-[family-name:var(--font-landing-display)] text-[clamp(1.8rem,4vw,2.4rem)] tracking-[0.08em] text-[#2A2520] leading-none mb-1">
              {service.title}
            </h3>
            <p className="text-[1rem] font-[family-name:var(--font-landing-accent)] italic text-[#5C574D]">
              {service.tagline}
            </p>
          </div>
        </div>

        <div className="p-7 max-md:p-5 flex flex-col gap-6">
          <div className="flex items-baseline gap-2">
            <span className="text-[0.72rem] font-semibold tracking-[0.15em] uppercase text-[#9E9785]">From</span>
            <span className="font-[family-name:var(--font-landing-display)] text-[2.5rem] text-[#C4891E] leading-none tracking-wide">
              {service.from}
            </span>
          </div>

          <p className="text-[0.95rem] text-[#5C574D] leading-[1.7]">{service.detail.description}</p>

          {service.detail.extra && (
            <p className="text-[0.88rem] text-[#9E9785] leading-[1.7] pl-4 border-l-2 border-[#2d5a42]/30">
              {service.detail.extra}
            </p>
          )}

          <ul className="flex flex-col gap-2.5">
            {service.highlights.map((h, i) => (
              <li key={i} className="flex items-center gap-2.5 text-[0.9rem] text-[#5C574D]">
                <svg className="w-4 h-4 text-[#2d5a42] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                {h}
              </li>
            ))}
          </ul>

          <div className="bg-[#edf6f0] border border-[#c4e2d0] p-5">
            <div className="text-[0.72rem] font-semibold tracking-[0.15em] uppercase text-[#2d5a42] mb-3">Pricing</div>
            <div className="flex flex-col gap-2.5">
              {service.detail.pricing.map((row, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-[0.9rem] text-[#5C574D]">{row.label}</span>
                  <span className="font-[family-name:var(--font-landing-display)] text-[1.3rem] text-[#C4891E] tracking-wide">{row.price}</span>
                </div>
              ))}
            </div>
            {service.detail.notes.length > 0 && (
              <div className="mt-3 pt-3 border-t border-[#c4e2d0] flex flex-col gap-1">
                {service.detail.notes.map((note, i) => (
                  <span key={i} className="text-[0.78rem] italic text-[#9E9785]">* {note}</span>
                ))}
              </div>
            )}
          </div>

          <a
            href="#intake"
            className="inline-flex items-center justify-center gap-2.5 bg-[#2d5a42] text-white text-[0.85rem] font-bold tracking-[0.15em] uppercase px-8 py-[16px] hover:bg-[#3d7a5a] hover:shadow-[0_0_30px_rgba(45,90,66,0.2)] transition-all duration-400 w-full"
          >
            Book Now
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>

        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#2d5a42] to-transparent" />
      </div>
    </div>
  )
}

/* ─── Card ─── */
interface ServiceCardProps {
  service: typeof services[number]
  index: number
  onSelect: () => void
}
function ServiceCard({ service, index, onSelect }: ServiceCardProps) {
  return (
    <Reveal delay={index * 200}>
      <div
        className="group relative h-full overflow-hidden bg-white border border-[#E5E0D8] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08),0_0_40px_rgba(45,90,66,0.08)] hover:border-[#c4e2d0] cursor-pointer"
        onClick={onSelect}
      >
        <div className="relative h-[260px] max-md:h-[220px] overflow-hidden">
          <img
            src={service.image}
            alt={service.imageAlt}
            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-[3px] z-[3] bg-gradient-to-r from-transparent via-[#2d5a42] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {service.popular && (
            <div className="absolute top-5 right-5 z-[3] bg-[#2d5a42] text-white text-[0.68rem] font-bold tracking-[0.15em] uppercase px-3.5 py-1.5">
              Most Popular
            </div>
          )}
          {service.badge && !service.popular && (
            <div className="absolute top-5 right-5 z-[3] bg-[#C4891E] text-white text-[0.68rem] font-bold tracking-[0.15em] uppercase px-3.5 py-1.5">
              {service.badge}
            </div>
          )}
        </div>

        <div className="relative z-[2] p-8 max-md:p-6">
          <div className="mb-4">
            <span className="text-[0.72rem] font-semibold tracking-[0.15em] uppercase text-[#9E9785]">From</span>
            <span className="ml-2 font-[family-name:var(--font-landing-display)] text-[2.5rem] text-[#C4891E] leading-none tracking-wide">
              {service.from}
            </span>
          </div>

          <h3 className="font-[family-name:var(--font-landing-display)] text-[clamp(1.8rem,3vw,2.2rem)] tracking-[0.08em] text-[#2A2520] leading-none mb-2">
            {service.title}
          </h3>

          <p className="text-[1rem] font-[family-name:var(--font-landing-accent)] italic text-[#9E9785] mb-5">
            {service.tagline}
          </p>

          <ul className="flex flex-col gap-2 mb-7">
            {service.highlights.map((h, i) => (
              <li key={i} className="flex items-center gap-2.5 text-[0.88rem] text-[#5C574D]">
                <svg className="w-4 h-4 text-[#2d5a42] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                {h}
              </li>
            ))}
          </ul>

          <div className="flex gap-3">
            <a
              href="#intake"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center justify-center gap-2.5 bg-[#2d5a42] text-white text-[0.82rem] font-bold tracking-[0.15em] uppercase px-8 py-[14px] hover:bg-[#3d7a5a] hover:shadow-[0_0_30px_rgba(45,90,66,0.15)] transition-all duration-400 flex-1"
            >
              Book Now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
            <button
              onClick={(e) => { e.stopPropagation(); onSelect() }}
              className="flex items-center justify-center w-[50px] border-2 border-[#E5E0D8] text-[#9E9785] hover:border-[#C4891E] hover:text-[#C4891E] transition-all duration-400"
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
      <section id="services" className="py-[120px] max-md:py-[80px] bg-white relative scroll-mt-20">
        <div className="max-w-[1240px] mx-auto px-[clamp(20px,5vw,60px)]">
          <Reveal>
            <div className="text-center mb-[72px] max-md:mb-[48px]">
              <div className="text-[0.78rem] font-semibold tracking-[0.25em] uppercase text-[#2d5a42] mb-4">
                What We Offer
              </div>
              <h2 className="font-[family-name:var(--font-landing-display)] text-[clamp(3rem,6vw,4.5rem)] tracking-[0.04em] text-[#2A2520] leading-none mb-4">
                OUR SERVICES
              </h2>
              <p className="text-[1.05rem] font-light text-[#9E9785] max-w-[500px] mx-auto">
                Professional pet care tailored to your furry friend's unique needs
              </p>
            </div>
          </Reveal>

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

          <Reveal>
            <div className="text-center mt-14 flex flex-col items-center gap-3">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#C4891E]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ))}
              </div>
              <p className="text-[0.9rem] text-[#9E9785] font-light">
                Trusted by pet families across Halton & surrounding areas
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {selectedIndex !== null && (
        <ServiceModal
          service={services[selectedIndex]}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </>
  )
}
