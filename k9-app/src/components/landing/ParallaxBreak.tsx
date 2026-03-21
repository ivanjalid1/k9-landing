import { Reveal } from '../../hooks/useScrollReveal'

export function ParallaxBreak() {
  return (
    <section className="relative py-[100px] max-md:py-[70px] flex items-center justify-center text-center overflow-hidden bg-gradient-to-br from-[#2A2520] via-[#3D3833] to-[#2A2520]">
      {/* Warm gold radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(196,137,30,0.15)_0%,transparent_65%)] pointer-events-none" />
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(196,137,30,0.1)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(196,137,30,0.08)_0%,transparent_70%)] pointer-events-none" />
      {/* Top/bottom gold lines */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#C4891E] to-transparent opacity-40" />
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#C4891E] to-transparent opacity-40" />

      {/* Content */}
      <div className="relative z-[1] px-[clamp(20px,5vw,60px)] flex flex-col items-center max-w-[800px] mx-auto">
        <Reveal direction="scale">
          <img
            src="/k9movement_logo.svg"
            alt="K9 Movement"
            className="w-20 h-20 max-md:w-16 max-md:h-16 mb-8 drop-shadow-[0_4px_20px_rgba(196,137,30,0.3)]"
          />
        </Reveal>
        <Reveal direction="scale" delay={150}>
          <div className="relative">
            <span className="absolute -top-6 -left-4 text-[4rem] leading-none text-[#C4891E]/30 font-[family-name:var(--font-landing-accent)]">"</span>
            <p className="font-[family-name:var(--font-landing-accent)] text-[clamp(1.4rem,2.8vw,2.2rem)] italic text-white/90 max-w-[700px] mx-auto leading-[1.7]">
              We understand that each animal is <span className="text-[#E8A838] font-semibold not-italic">unique</span>, and we tailor our services
              to meet the individual needs of your pet.
            </p>
          </div>
        </Reveal>
        <Reveal direction="scale" delay={250}>
          <div className="w-[60px] h-[2px] bg-gradient-to-r from-transparent via-[#E8A838] to-transparent mx-auto mt-9" />
        </Reveal>
      </div>
    </section>
  )
}
