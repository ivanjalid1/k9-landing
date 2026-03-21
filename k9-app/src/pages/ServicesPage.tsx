import { Nav } from '../components/landing/Nav'
import { Services } from '../components/landing/Services'
import { ParallaxBreak } from '../components/landing/ParallaxBreak'
import { FinalCTA } from '../components/landing/FinalCTA'
import { Footer } from '../components/landing/Footer'
import { Reveal } from '../hooks/useScrollReveal'

export function ServicesPage() {
  return (
    <div className="bg-[#FAF8F4] text-[#2A2520] overflow-x-hidden">
      <Nav darkHero />
      {/* Hero — full viewport, left-aligned */}
      <section className="relative min-h-[100svh] max-md:min-h-0 max-md:h-[100svh] flex items-center max-md:items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1600&q=80"
            alt="Dogs running together in park"
            className="w-full h-full object-cover scale-105 max-md:scale-100 max-md:object-[center_30%]"
          />
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[rgba(42,37,32,0.85)] via-[rgba(42,37,32,0.5)] to-[rgba(42,37,32,0.15)] max-md:bg-none" />
        <div className="absolute inset-0 z-[1] max-md:bg-gradient-to-t max-md:from-[#2A2520] max-md:via-[rgba(42,37,32,0.6)] max-md:to-transparent" />
        <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(180deg, rgba(42,37,32,0.3) 0%, transparent 30%, transparent 50%, rgba(250,248,244,1) 100%)' }} />

        <div className="relative z-[2] w-full max-w-[1240px] mx-auto px-[clamp(20px,5vw,60px)] max-md:px-8 pt-[120px] max-md:pt-[60px]">
          <div className="text-[0.82rem] max-md:text-[0.72rem] font-semibold tracking-[0.3em] uppercase text-[#E8A838] mb-5 max-md:mb-3 opacity-0 -translate-x-10 max-md:-translate-x-4 animate-[fadeLeft_0.8s_0.2s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            What We Offer
          </div>
          <h1 className="font-[family-name:var(--font-landing-display)] text-[clamp(3.5rem,12vw,8rem)] leading-[0.9] tracking-tight text-white mb-6 max-md:mb-4 opacity-0 -translate-x-12 max-md:-translate-x-5 animate-[fadeLeft_0.8s_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            OUR<br />SERVICES
          </h1>
          <p className="text-[1.15rem] max-md:text-[0.95rem] font-light text-white/75 max-w-[540px] max-md:max-w-full leading-[1.7] mb-10 max-md:mb-7 opacity-0 -translate-x-10 max-md:-translate-x-4 animate-[fadeLeft_0.8s_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            Professional pet care tailored to your furry friend's unique needs — from daily walks to overnight house sitting.
          </p>
          <div className="opacity-0 -translate-x-8 max-md:-translate-x-3 animate-[fadeLeft_0.8s_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            <a
              href="#services"
              className="inline-flex items-center gap-2.5 bg-[#E8A838] text-[#0a0a0a] text-[0.85rem] max-md:text-[0.8rem] font-bold tracking-[0.15em] uppercase px-10 max-md:px-8 py-[16px] max-md:py-[14px] border-2 border-[#E8A838] hover:bg-[#F0B840] hover:shadow-[0_0_40px_rgba(232,168,56,0.25)] transition-all duration-400"
            >
              Explore Services
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] opacity-0 animate-[fadeUp_0.8s_1.2s_cubic-bezier(0.16,1,0.3,1)_forwards] max-md:hidden">
          <div className="w-px h-10 bg-gradient-to-b from-[#E8A838] to-transparent" />
        </div>
      </section>

      <Services />

      {/* Why Choose Us */}
      <section className="relative py-[100px] max-md:py-[70px] bg-gradient-to-b from-[#edf6f0] to-white">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(45,90,66,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-[clamp(20px,5vw,60px)] relative">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-[0.78rem] font-semibold tracking-[0.25em] uppercase text-[#2d5a42] mb-4">Why Choose Us</div>
              <h2 className="font-[family-name:var(--font-landing-display)] text-[clamp(2.5rem,5vw,3.5rem)] tracking-[0.04em] text-[#2A2520] leading-none mb-5">
                THE K9 DIFFERENCE
              </h2>
              <p className="text-[1rem] font-light text-[#9E9785] max-w-[500px] mx-auto leading-[1.7]">
                What sets us apart from the rest
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-3 gap-7 max-md:grid-cols-1 max-md:gap-6 max-md:max-w-[460px] max-md:mx-auto">
            {([
              {
                icon: (
                  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
                    <path d="M24 42s-16-9.5-16-21c0-4 2-7.5 5-9s6.5-.5 8.5 1.5L24 16l2.5-2.5c2-2 5.5-3 8.5-1.5s5 5 5 9c0 11.5-16 21-16 21z" stroke="#2d5a42" strokeWidth="2" fill="rgba(45,90,66,0.08)"/>
                    <path d="M17 18c-1.5 0-3 1-3 3" stroke="#2d5a42" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
                  </svg>
                ),
                title: 'Personalized Care',
                desc: 'Every pet has unique needs. We create custom care plans tailored to your furry friend\'s personality and requirements.',
                stat: '100%',
                statLabel: 'Tailored',
              },
              {
                icon: (
                  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
                    <path d="M24 6L20 18H8l10 7-4 13 10-8 10 8-4-13 10-7H28L24 6z" stroke="#2d5a42" strokeWidth="2" fill="rgba(45,90,66,0.08)"/>
                    <circle cx="24" cy="20" r="3" stroke="#2d5a42" strokeWidth="1.5" opacity="0.6"/>
                  </svg>
                ),
                title: 'Trail Adventures',
                desc: 'We explore the beautiful Halton trails and neighbourhood parks, giving your dog the exercise and stimulation they need.',
                stat: '50+',
                statLabel: 'Local trails',
              },
              {
                icon: (
                  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
                    <path d="M6 24l18-14 18 14" stroke="#C4891E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 22v16a2 2 0 002 2h24a2 2 0 002-2V22" stroke="#2d5a42" strokeWidth="2" fill="rgba(45,90,66,0.08)"/>
                    <path d="M20 40v-10h8v10" stroke="#C4891E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="24" cy="26" r="2" fill="#2d5a42" opacity="0.5"/>
                  </svg>
                ),
                title: 'Home Comfort',
                desc: 'For house sitting and drop-ins, your pet stays in the comfort of their own home — less stress, more love.',
                stat: '24/7',
                statLabel: 'Availability',
              },
            ] as const).map((item, i) => (
              <Reveal key={i} delay={i * 250}>
                <div className="group relative bg-white border border-[#c4e2d0] p-9 max-md:p-7 text-center hover:border-[#5a9e78] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(45,90,66,0.08)] transition-all duration-500">
                  {/* Green accent line on top */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-[#2d5a42] opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-500" />

                  {/* Icon in circle */}
                  <div className="w-[72px] h-[72px] mx-auto mb-6 rounded-full bg-[#edf6f0] border border-[#c4e2d0] flex items-center justify-center group-hover:bg-[#c4e2d0]/40 group-hover:border-[#5a9e78] transition-all duration-400">
                    {item.icon}
                  </div>

                  <h3 className="font-[family-name:var(--font-landing-display)] text-[1.4rem] tracking-[0.06em] text-[#2A2520] mb-3">{item.title}</h3>
                  <p className="text-[0.9rem] font-light text-[#9E9785] leading-[1.7] mb-6">{item.desc}</p>

                  {/* Stat */}
                  <div className="pt-5 border-t border-[#c4e2d0]">
                    <span className="font-[family-name:var(--font-landing-display)] text-[1.8rem] text-[#C4891E] tracking-wide">{item.stat}</span>
                    <span className="block text-[0.75rem] text-[#9E9785] tracking-[0.1em] uppercase mt-1">{item.statLabel}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ParallaxBreak />

      {/* Photo strip */}
      <section className="relative py-[80px] max-md:py-[50px] bg-[#FAF8F4]">
        <div className="max-w-[1240px] mx-auto px-[clamp(20px,5vw,60px)]">
          <Reveal>
            <div className="text-center mb-12">
              <div className="text-[0.78rem] font-semibold tracking-[0.25em] uppercase text-[#C4891E] mb-4">Our Happy Clients</div>
              <h2 className="font-[family-name:var(--font-landing-display)] text-[clamp(2rem,4vw,3rem)] tracking-[0.04em] text-[#2A2520] leading-none">
                TAILS OF JOY
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-4 gap-3 max-md:grid-cols-2">
            {[
              { src: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=600&q=80', alt: 'Happy dog on beach' },
              { src: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&q=80', alt: 'Dog and owner bonding' },
              { src: 'https://images.unsplash.com/photo-1494947665470-20322015e3a8?w=600&q=80', alt: 'Dog playing in park' },
              { src: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=600&q=80', alt: 'Happy dog portrait' },
            ].map((img, i) => (
              <Reveal key={i} delay={i * 180}>
                <div className="relative aspect-square overflow-hidden group rounded-sm">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
      <Footer />
    </div>
  )
}
