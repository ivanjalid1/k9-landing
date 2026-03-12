import { useState, useEffect } from 'react'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Home', href: '#' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ]

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
    document.body.style.overflow = menuOpen ? '' : 'hidden'
  }

  const closeMobileNav = () => {
    setMenuOpen(false)
    document.body.style.overflow = ''
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        scrolled
          ? 'bg-[rgba(10,10,10,0.92)] backdrop-blur-[20px] py-3.5 border-b border-white/10'
          : 'py-5'
      }`}>
        <div className="flex items-center justify-between max-w-[1240px] mx-auto px-[clamp(20px,5vw,60px)]">
          <a href="#" className="flex items-center gap-3">
            <img
              src="/k9logo.png"
              alt="K9 Movement"
              className={`transition-all duration-400 ${scrolled ? 'w-12 h-12' : 'w-16 h-16'}`}
            />
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-9 list-none">
            {links.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className="relative text-[0.82rem] font-medium tracking-[0.12em] uppercase text-white/70 hover:text-white transition-colors group"
                >
                  {label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#E8A838] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            className="hidden md:inline-block text-[0.82rem] font-semibold tracking-[0.12em] uppercase text-[#0a0a0a] bg-[#E8A838] px-6 py-2.5 border-2 border-[#E8A838] hover:bg-transparent hover:text-[#E8A838] transition-all duration-300"
          >
            Book Now
          </a>

          {/* Hamburger */}
          <button
            className="flex md:hidden flex-col gap-[5px] p-2 z-[1001]"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-[2px] bg-white transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-[2px] bg-white transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div className={`fixed inset-0 z-[999] bg-[rgba(10,10,10,0.97)] backdrop-blur-[30px] flex-col items-center justify-center gap-8 transition-opacity duration-400 md:hidden ${
        menuOpen ? 'flex opacity-100 pointer-events-auto' : 'hidden opacity-0 pointer-events-none'
      }`}>
        {links.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            onClick={closeMobileNav}
            className="font-[family-name:var(--font-landing-display)] text-[2rem] tracking-[0.15em] text-white/70 hover:text-[#E8A838] transition-colors"
          >
            {label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={closeMobileNav}
          className="mt-4 text-[0.88rem] font-bold tracking-[0.15em] uppercase text-[#0a0a0a] bg-[#E8A838] px-10 py-4 hover:bg-[#F0B840] transition-all duration-300"
        >
          Book Now
        </a>
      </div>
    </>
  )
}
