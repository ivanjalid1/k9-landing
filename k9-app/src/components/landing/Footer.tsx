import { FiInstagram, FiFacebook, FiMapPin, FiMail, FiPhone } from 'react-icons/fi'
import { FaTiktok } from 'react-icons/fa'

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const serviceLinks = [
  { label: 'Dog Walking', href: '#services' },
  { label: 'Dog Visit / Drop In', href: '#services' },
  { label: 'Cat Visit / Drop In', href: '#services' },
  { label: 'House Sitting', href: '#services' },
  { label: 'Dog Training', href: '#services' },
]

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-20 pb-10">
      <div className="max-w-[1240px] mx-auto px-[clamp(20px,5vw,60px)]">

        {/* Grid */}
        <div className="grid grid-cols-[1.5fr_1.2fr_1.2fr] gap-[60px] mb-[60px] max-lg:grid-cols-[1fr_1fr] max-lg:gap-10 max-md:grid-cols-1">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <img src="/k9logo.png" alt="K9 Movement" className="w-11 h-11" />
              <span className="font-[family-name:var(--font-landing-display)] text-[1.3rem] tracking-[0.1em] text-white">
                K9 MOVEMENT
              </span>
            </div>
            <p className="text-[0.88rem] font-light text-white/50 leading-[1.7] mt-4 max-w-[280px]">
              Providing exceptional pet care in Halton and surrounding areas. Your pet is family — and we treat them as such.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { icon: <FiInstagram size={18} />, label: 'Instagram' },
                { icon: <FiFacebook size={18} />, label: 'Facebook' },
                { icon: <FaTiktok size={16} />, label: 'TikTok' },
              ].map(({ icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center border border-white/10 text-white/50 hover:border-[#E8A838] hover:text-[#E8A838] hover:bg-[rgba(232,168,56,0.15)] transition-all duration-300"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigate + Services side by side */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-[family-name:var(--font-landing-display)] text-[1.1rem] tracking-[0.15em] text-white mb-6">
                NAVIGATE
              </h4>
              <ul className="flex flex-col gap-3.5 list-none">
                {navLinks.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-[0.88rem] font-light text-white/50 hover:text-[#E8A838] transition-colors duration-300"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-[family-name:var(--font-landing-display)] text-[1.1rem] tracking-[0.15em] text-white mb-6">
                SERVICES
              </h4>
              <ul className="flex flex-col gap-3.5 list-none">
                {serviceLinks.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-[0.88rem] font-light text-white/50 hover:text-[#E8A838] transition-colors duration-300"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-[family-name:var(--font-landing-display)] text-[1.1rem] tracking-[0.15em] text-white mb-6">
              CONTACT
            </h4>
            <div className="flex flex-col gap-[18px]">
              <div className="flex items-start gap-3 text-[0.88rem] font-light text-white/50">
                <FiMapPin size={16} className="flex-shrink-0 text-[#E8A838] mt-[3px]" />
                <span>Halton &amp; Surrounding Areas<br />Ontario, Canada</span>
              </div>
              <div className="flex items-start gap-3 text-[0.88rem] font-light text-white/50">
                <FiMail size={16} className="flex-shrink-0 text-[#E8A838] mt-[3px]" />
                <span>info@k9movement.ca</span>
              </div>
              <div className="flex items-start gap-3 text-[0.88rem] font-light text-white/50">
                <FiPhone size={16} className="flex-shrink-0 text-[#E8A838] mt-[3px]" />
                <span>(905) 555-K9MV</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex justify-between items-center max-md:flex-col max-md:gap-4 max-md:text-center">
          <p className="text-[0.78rem] text-white/40 tracking-wide">
            &copy; 2025 K9 Movement. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cancellation Policy'].map((label) => (
              <a key={label} href="#" className="text-[0.78rem] text-white/40 hover:text-[#E8A838] transition-colors duration-300">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
