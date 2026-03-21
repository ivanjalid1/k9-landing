import { Nav } from '../components/landing/Nav'
import { Hero } from '../components/landing/Hero'
import { TrustBar } from '../components/landing/TrustBar'
import { Mission } from '../components/landing/Mission'
import { Highlights } from '../components/landing/Highlights'
import { FinalCTA } from '../components/landing/FinalCTA'
import { Footer } from '../components/landing/Footer'

export function LandingPage() {
  return (
    <div className="bg-[#FAF8F4] text-[#2A2520] overflow-x-hidden">
      <Nav darkHero />
      <Hero />
      <TrustBar />
      <Mission />
      <Highlights />
      <FinalCTA />
      <Footer />
    </div>
  )
}
