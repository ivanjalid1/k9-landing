import { useState, useEffect } from 'react'
import { LandingPage } from './pages/LandingPage'
import { ServicesPage } from './pages/ServicesPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { IntakeApp } from './IntakeApp'

function getRoute() {
  const hash = window.location.hash.replace('#', '')
  if (hash === 'intake' || hash.startsWith('intake/')) return 'intake'
  if (hash === 'services') return 'services'
  if (hash === 'about') return 'about'
  if (hash === 'contact') return 'contact'
  return 'landing'
}

function App() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const onHashChange = () => {
      setRoute(getRoute())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (route === 'intake') return <IntakeApp />
  if (route === 'services') return <ServicesPage />
  if (route === 'about') return <AboutPage />
  if (route === 'contact') return <ContactPage />
  return <LandingPage />
}

export default App
