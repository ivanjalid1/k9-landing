import { Nav } from '../components/landing/Nav'
import { Story } from '../components/landing/Story'
import { Pack } from '../components/landing/Pack'
import { ActivityGallery } from '../components/landing/ActivityGallery'
import { FinalCTA } from '../components/landing/FinalCTA'
import { Footer } from '../components/landing/Footer'

export function AboutPage() {
  return (
    <div className="bg-[#FAF8F4] text-[#2A2520] overflow-x-hidden">
      <Nav />
      {/* Page header */}
      <section className="pt-[140px] pb-[60px] max-md:pt-[110px] max-md:pb-10 bg-[#FAF8F4] relative overflow-hidden">
        <div className="absolute -top-[200px] -left-[200px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(196,137,30,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-[clamp(20px,5vw,60px)] relative z-[1]">
          <div className="text-[0.78rem] max-md:text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-[#C4891E] mb-4 max-md:mb-3 opacity-0 -translate-x-10 max-md:-translate-x-4 animate-[fadeLeft_0.8s_0.2s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            Our Story
          </div>
          <h1 className="font-[family-name:var(--font-landing-display)] text-[clamp(3rem,10vw,7rem)] leading-[0.9] tracking-tight text-[#2A2520] mb-5 max-md:mb-3 opacity-0 -translate-x-12 max-md:-translate-x-5 animate-[fadeLeft_0.8s_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            ABOUT<br />K9 MOVEMENT
          </h1>
          <p className="text-[1.05rem] max-md:text-[0.92rem] font-light text-[#9E9785] max-w-[480px] leading-[1.7] opacity-0 -translate-x-10 max-md:-translate-x-4 animate-[fadeLeft_0.8s_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            Where our passion for animals and sports come together to create a unique experience for your furry friends.
          </p>
        </div>
      </section>
      <Story />
      <Pack />
      <ActivityGallery />
      <FinalCTA />
      <Footer />
    </div>
  )
}
