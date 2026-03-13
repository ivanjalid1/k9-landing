export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0a]">
      {/* Background image */}
      <div className="absolute inset-0 z-[1]">
        <img
          src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1600&q=80"
          alt="Dog in nature"
          className="w-full h-full object-cover object-[center_20%]"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(10,10,10,0.92)] via-[rgba(10,10,10,0.6)] to-[rgba(10,10,10,0.15)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,10,10,0.3)] via-transparent to-[#0a0a0a]" />
        {/* Noise */}
        <div
          className="absolute inset-0 z-[2] opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-[3] w-full max-w-[1240px] mx-auto px-[clamp(20px,5vw,60px)] pt-[120px] max-md:pt-[100px]">
        <p className="text-[clamp(0.9rem,1.5vw,1.15rem)] font-normal italic tracking-[0.2em] uppercase text-white/70 mb-3 opacity-0 -translate-x-10 max-md:-translate-x-4 animate-[fadeLeft_0.8s_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          Your Dog in Motion
        </p>
        <h1 className="font-[family-name:var(--font-landing-display)] text-[clamp(5rem,14vw,10rem)] leading-[0.88] tracking-tight text-[#E8A838] mb-7 max-md:mb-5 opacity-0 -translate-x-12 max-md:-translate-x-5 animate-[fadeLeft_0.8s_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          BUILT<br />FOR THIS
        </h1>
        <p className="flex items-center gap-3 text-[clamp(0.85rem,1.2vw,1.05rem)] font-light text-white/70 tracking-[0.08em] mb-10 pl-5 border-l-[3px] border-[#E8A838] opacity-0 -translate-x-10 max-md:-translate-x-4 animate-[fadeLeft_0.8s_0.7s_cubic-bezier(0.16,1,0.3,1)_forwards] max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-0">
          Pet Sitting <span className="text-white/50 max-[480px]:hidden">&bull;</span> Dog Walking <span className="text-white/50 max-[480px]:hidden">&bull;</span> Dog Training
        </p>
        <a
          href="#services"
          className="inline-flex items-center gap-3 bg-[#E8A838] text-[#0a0a0a] text-[0.88rem] font-bold tracking-[0.15em] uppercase px-10 py-[18px] border-2 border-[#E8A838] hover:bg-transparent hover:text-[#E8A838] hover:gap-[18px] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 -translate-x-8 max-md:-translate-x-3 animate-[fadeLeft_0.8s_0.9s_cubic-bezier(0.16,1,0.3,1)_forwards]"
        >
          Start Your Journey
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[3] flex flex-col items-center gap-2 text-white/50 text-[0.7rem] tracking-[0.2em] uppercase animate-[scrollBounce_2s_infinite] max-md:hidden">
        <div className="w-px h-10 bg-gradient-to-b from-[#E8A838] to-transparent" />
        SCROLL
      </div>
    </section>
  )
}
