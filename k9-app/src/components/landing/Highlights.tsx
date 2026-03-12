import { Reveal } from '../../hooks/useScrollReveal'

const stats = [
  { value: '500+', label: 'Happy Pets Served', icon: (<svg viewBox="0 0 48 48" fill="none" className="w-9 h-9"><path d="M14 18c-2 0-5-2-5-6s2-6 5-6c2 0 3 1 3 1s-1 3 0 5 2 4 2 4-2 2-5 2zM34 18c2 0 5-2 5-6s-2-6-5-6c-2 0-3 1-3 1s1 3 0 5-2 4-2 4 2 2 5 2zM8 28c-1 0-4-1.5-4-5s2-5 4-5 3 1 3 1-1 2.5 0 4 1.5 3.5 1.5 3.5S10 28 8 28zM40 28c1 0 4-1.5 4-5s-2-5-4-5-3 1-3 1 1 2.5 0 4-1.5 3.5-1.5 3.5 1.5 1.5 3.5 1.5z" stroke="#E8A838" strokeWidth="1.8" fill="rgba(232,168,56,0.1)"/><path d="M24 42s-12-7-12-16c0-4 3-8 7-8 2.5 0 4 1.5 5 3 1-1.5 2.5-3 5-3 4 0 7 4 7 8 0 9-12 16-12 16z" stroke="#E8A838" strokeWidth="2" fill="rgba(232,168,56,0.12)"/></svg>) },
  { value: '50+', label: 'Trails Explored', icon: (<svg viewBox="0 0 48 48" fill="none" className="w-9 h-9"><path d="M4 40l12-24 8 12 6-8 14 20" stroke="#E8A838" strokeWidth="2" fill="rgba(232,168,56,0.08)" strokeLinejoin="round"/><circle cx="36" cy="12" r="4" stroke="#E8A838" strokeWidth="1.8" fill="rgba(232,168,56,0.1)"/></svg>) },
  { value: '5+', label: 'Years Experience', icon: (<svg viewBox="0 0 48 48" fill="none" className="w-9 h-9"><path d="M24 6L20 18H8l10 7-4 13 10-8 10 8-4-13 10-7H28L24 6z" stroke="#E8A838" strokeWidth="2" fill="rgba(232,168,56,0.1)"/></svg>) },
  { value: '100%', label: 'Love & Dedication', icon: (<svg viewBox="0 0 48 48" fill="none" className="w-9 h-9"><path d="M24 42s-16-9.5-16-21c0-4 2-7.5 5-9s6.5-.5 8.5 1.5L24 16l2.5-2.5c2-2 5.5-3 8.5-1.5s5 5 5 9c0 11.5-16 21-16 21z" stroke="#E8A838" strokeWidth="2" fill="rgba(232,168,56,0.12)"/></svg>) },
]

export function Highlights() {
  return (
    <section className="relative py-[100px] max-md:py-[70px] bg-[#0a0a0a]">
      {/* Subtle top/bottom glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(232,168,56,0.04)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-[clamp(20px,5vw,60px)] relative">
        <Reveal>
          <div className="text-center mb-14 max-md:mb-10">
            <div className="text-[0.78rem] font-semibold tracking-[0.25em] uppercase text-[#E8A838] mb-4">By The Numbers</div>
            <h2 className="font-[family-name:var(--font-landing-display)] text-[clamp(2.5rem,5vw,3.5rem)] tracking-[0.04em] text-white leading-none">
              WHY FAMILIES TRUST US
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-4 gap-6 max-md:grid-cols-2 max-md:gap-5">
          {stats.map((stat, i) => (
            <Reveal key={i} delay={i * 150}>
              <div className="text-center group">
                <div className="w-[72px] h-[72px] mx-auto mb-5 rounded-full bg-[rgba(232,168,56,0.06)] border border-[rgba(232,168,56,0.12)] flex items-center justify-center group-hover:bg-[rgba(232,168,56,0.1)] group-hover:border-[rgba(232,168,56,0.25)] transition-all duration-400">
                  {stat.icon}
                </div>
                <div className="font-[family-name:var(--font-landing-display)] text-[clamp(2.2rem,4vw,3rem)] text-[#E8A838] tracking-wide leading-none mb-2">
                  {stat.value}
                </div>
                <div className="text-[0.82rem] text-white/40 tracking-[0.1em] uppercase font-medium">
                  {stat.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
