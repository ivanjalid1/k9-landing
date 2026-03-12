import { useEffect, useRef } from 'react'
import { Reveal } from '../../hooks/useScrollReveal'

export function ParallaxBreak() {
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const img = imgRef.current
      if (!img) return
      const section = img.closest('section')
      if (!section) return
      const rect = section.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (rect.top - window.innerHeight / 2) * 0.3
        img.style.transform = `translateY(${offset}px) scale(1.15)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative h-[55vh] min-h-[420px] flex items-center justify-center text-center overflow-hidden bg-[#0a0a0a]">
      {/* Background */}
      <div className="absolute inset-[-10%] z-[1]">
        <img
          ref={imgRef}
          src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1600&q=80"
          alt="Golden sunset landscape"
          className="w-full h-full object-cover brightness-[0.4]"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 z-[2]" style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, transparent 20%, transparent 80%, #0a0a0a 100%), rgba(10,10,10,0.45)' }} />

      {/* Content */}
      <div className="relative z-[3] px-[clamp(20px,5vw,60px)] flex flex-col items-center">
        <Reveal direction="scale">
          {/* Logo */}
          <img
            src="/k9logo.png"
            alt="K9 Movement"
            className="w-20 h-20 max-md:w-16 max-md:h-16 mb-8 drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          />
        </Reveal>
        <Reveal direction="scale" delay={150}>
          <p className="font-[family-name:var(--font-landing-accent)] text-[clamp(1.5rem,3vw,2.5rem)] italic text-white/90 max-w-[700px] mx-auto leading-[1.6]">
            "We understand that each animal is <span className="text-[#E8A838]">unique</span>, and we tailor our services
            to meet the individual needs of your pet."
          </p>
        </Reveal>
      </div>
    </section>
  )
}
