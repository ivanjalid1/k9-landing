export function Header() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-forest-900 via-forest-800 to-forest-800">
      {/* Subtle diagonal texture */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Radial glow behind logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] bg-gold-500/[0.06] rounded-full blur-[60px]" />

      {/* Back to site */}
      <a
        href="/#contact"
        className="absolute top-4 left-4 z-[2] flex items-center gap-1.5 text-[0.78rem] font-medium text-white/60 hover:text-white transition-colors duration-300 max-sm:top-3 max-sm:left-3"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Back
      </a>

      {/* Content */}
      <div className="relative flex flex-col items-center py-5 max-sm:py-4">
        {/* Logo with ring */}
        <div className="relative">
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-gold-500/30 to-gold-400/10 blur-[2px]" />
          <img
            src="/k9logo.png"
            alt="K9 Movement"
            className="relative w-[80px] h-[80px] object-cover rounded-full ring-2 ring-gold-500/40 max-sm:w-[64px] max-sm:h-[64px]"
          />
        </div>

        <h1 className="font-[var(--font-display)] text-[1.5rem] font-bold text-white tracking-[0.06em] leading-none mt-2.5 max-sm:text-[1.25rem]">
          K9 Movement
        </h1>

        <p className="text-[0.7rem] text-gold-400/90 tracking-[0.22em] uppercase font-medium mt-1">
          Client Application Portal
        </p>
      </div>

      {/* Bottom gold gradient line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
    </header>
  )
}
