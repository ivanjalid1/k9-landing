import { Reveal } from '../../hooks/useScrollReveal'

export function Mission() {
  return (
    <section className="relative py-[120px] max-md:py-[80px] overflow-hidden bg-gradient-to-b from-[#1a3a2a] to-[#142e20]">
      {/* Warm radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(232,168,56,0.12)_0%,transparent_60%)] pointer-events-none" />
      {/* Subtle leaf pattern feel */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(90,158,120,0.15)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(90,158,120,0.1)_0%,transparent_70%)] pointer-events-none" />
      {/* Gold lines */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#C4891E]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#C4891E]/30 to-transparent" />

      <div className="max-w-[900px] mx-auto px-[clamp(20px,5vw,60px)] relative z-[2]">
        <Reveal>
          <div className="text-center">
            <div className="text-[0.78rem] font-semibold tracking-[0.25em] uppercase text-[#E8A838] mb-5">
              Our Mission
            </div>
            <p className="font-[family-name:var(--font-landing-accent)] text-[clamp(1.4rem,2.5vw,1.85rem)] font-normal italic leading-[1.7] text-[#c4e2d0] max-md:text-[1.2rem]">
              Our mission is to provide <strong className="text-white font-bold not-italic">exceptional care</strong> for your pet, while giving you{' '}
              <strong className="text-white font-bold not-italic">peace of mind</strong>. We understand that your pet is a member of your family,
              and we treat them as such.
            </p>
            <div className="w-[60px] h-[2px] bg-[#E8A838] mx-auto mt-9" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
