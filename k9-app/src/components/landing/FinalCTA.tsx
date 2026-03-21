import { useEffect, useRef } from 'react'
import { Reveal } from '../../hooks/useScrollReveal'

export function FinalCTA() {
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const img = imgRef.current
      if (!img) return
      const section = img.closest('section')
      if (!section) return
      const rect = section.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (rect.top - window.innerHeight / 2) * 0.2
        img.style.transform = `translateY(${offset}px) scale(1.1)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="cta" className="relative py-[160px] max-md:py-[110px] text-center overflow-hidden bg-[#2A2520]">
      {/* Background — mountain landscape */}
      <div className="absolute inset-[-10%] z-0">
        <img
          ref={imgRef}
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80"
          alt="Mountain landscape at sunset"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 z-[1] bg-[rgba(42,37,32,0.65)]" />
      <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(180deg, rgba(42,37,32,0.4) 0%, transparent 25%, transparent 75%, rgba(42,37,32,0.5) 100%)' }} />

      <div className="max-w-[1240px] mx-auto px-[clamp(20px,5vw,60px)] relative z-[2]">
        <Reveal>
          <div className="text-[0.78rem] font-semibold tracking-[0.25em] uppercase text-[#E8A838] mb-5">
            Ready to Start?
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="font-[family-name:var(--font-landing-display)] text-[clamp(3.5rem,8vw,6rem)] tracking-[0.04em] text-white leading-[0.95] mb-5">
            YOUR PET<br />DESERVES<br />THE BEST
          </h2>
        </Reveal>

        <Reveal delay={200}>
          <p className="text-[1.1rem] font-light text-white/70 max-w-[480px] mx-auto mb-12 leading-[1.7]">
            Contact us today to learn more about our services and how we can help you and your furry friend.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="flex items-center justify-center gap-5 flex-wrap max-[480px]:flex-col">
            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 bg-transparent text-white text-[0.88rem] font-semibold tracking-[0.15em] uppercase px-11 py-[18px] border-2 border-white/40 hover:border-white/70 hover:bg-white/10 transition-all duration-400 max-[480px]:w-full max-[480px]:justify-center"
            >
              Contact Us
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 bg-[#E8A838] text-[#0a0a0a] text-[0.88rem] font-bold tracking-[0.15em] uppercase px-11 py-[18px] border-2 border-[#E8A838] hover:bg-[#F0B840] hover:shadow-[0_0_40px_rgba(232,168,56,0.25)] transition-all duration-400 max-[480px]:w-full max-[480px]:justify-center"
            >
              Book Now
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
