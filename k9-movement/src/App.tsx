import { useEffect, useRef } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { Route, Routes, useLocation } from 'react-router'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { PAGES } from './data/pages'
import { EASE_OUT } from './lib/motion'
import {
  AboutPage,
  ContactPage,
  FaqPage,
  HomePage,
  NotFoundPage,
  PetCarePage,
  ServiceAreaPage,
  TrainingPage,
} from './pages/pages'

/** After the old page has faded out: jump to the hash target if there is one, otherwise to the top. */
function restoreScroll(hash: string) {
  const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
  if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' })
  else window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
}

export function App() {
  const location = useLocation()
  const lastPath = useRef<string | null>(null)

  // First load with a hash, or a hash change on the same page (e.g. footer link to /pet-care#walks
  // while already on /pet-care). Route changes are handled after the exit animation instead.
  useEffect(() => {
    const samePage = lastPath.current === location.pathname
    const firstLoad = lastPath.current === null
    lastPath.current = location.pathname
    if ((firstLoad || samePage) && location.hash) {
      requestAnimationFrame(() => {
        document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({ block: 'start' })
      })
    }
  }, [location.pathname, location.hash, location.key])

  return (
    // "user": transform animations are skipped when the OS asks for reduced motion; opacity fades remain.
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="fixed left-4 top-3 z-[70] -translate-y-24 bg-trail px-4 py-2 font-bold text-ink focus:translate-y-0"
      >
        Skip to content
      </a>
      <Nav />
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => restoreScroll(window.location.hash)}>
        <motion.main
          id="main"
          key={location.pathname}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } }}
          exit={{ opacity: 0, y: -12, transition: { duration: 0.22, ease: EASE_OUT } }}
        >
          <Routes location={location}>
            <Route path={PAGES.home.path} element={<HomePage />} />
            <Route path={PAGES.training.path} element={<TrainingPage />} />
            <Route path={PAGES.petCare.path} element={<PetCarePage />} />
            <Route path={PAGES.about.path} element={<AboutPage />} />
            <Route path={PAGES.area.path} element={<ServiceAreaPage />} />
            <Route path={PAGES.faq.path} element={<FaqPage />} />
            <Route path={PAGES.contact.path} element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </MotionConfig>
  )
}
