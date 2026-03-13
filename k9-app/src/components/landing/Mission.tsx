import { Reveal } from '../../hooks/useScrollReveal'

export function Mission() {
  return (
    <section className="relative py-[120px] max-md:py-[80px] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1600&q=80"
          alt="Two dogs running happily together"
          className="w-full h-full object-cover brightness-[0.2]"
        />
      </div>
      <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, transparent 20%, transparent 80%, #0a0a0a 100%)' }} />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_50%_50%,rgba(232,168,56,0.08)_0%,transparent_60%)]" />

      <div className="max-w-[900px] mx-auto px-[clamp(20px,5vw,60px)] relative z-[2]">
        <Reveal>
          <div className="text-center">
            <div className="text-[0.78rem] font-semibold tracking-[0.25em] uppercase text-[#E8A838] mb-5">
              Our Mission
            </div>
            <p className="font-[family-name:var(--font-landing-accent)] text-[clamp(1.4rem,2.5vw,1.85rem)] font-normal italic leading-[1.7] text-white/80 max-md:text-[1.2rem]">
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
