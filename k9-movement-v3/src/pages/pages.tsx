/**
 * Route components. Each page composes shared section components and sets its own SEO tags.
 */
import { CONTACT } from '../config'
import { PAGES } from '../data/pages'
import { training } from '../data/services'
import { useSeo } from '../lib/seo'
import { Hero } from '../components/Hero'
import { Values } from '../components/Values'
import { ServicesOverview } from '../components/ServicesOverview'
import { StoryTeaser } from '../components/StoryTeaser'
import { Statement } from '../components/Statement'
import { FinalCTA } from '../components/FinalCTA'
import { PageHeader } from '../components/PageHeader'
import { TrainingDetail } from '../components/TrainingDetail'
import { Process } from '../components/Process'
import { CareServices } from '../components/CareServices'
import { Founder } from '../components/Founder'
import { Pack } from '../components/Pack'
import { ServiceArea } from '../components/ServiceArea'
import { TownDetails } from '../components/TownDetails'
import { FaqList } from '../components/FaqList'
import { ContactBlock } from '../components/ContactBlock'
import { BookLink, ButtonLink } from '../components/ui'

const SUFFIX = 'K9 Movement'

export function HomePage() {
  useSeo({
    title: 'K9 Movement | Dog Training & Pet Care in Halton Region',
    description:
      'Premium outdoor dog training, walking, drop-in visits, house sitting and boarding in Oakville, Burlington, Milton and Halton Hills. Real discipline. Real results.',
    path: PAGES.home.path,
  })
  return (
    <>
      <Hero />
      <Values />
      <ServicesOverview />
      <StoryTeaser />
      <Statement />
      <FinalCTA />
    </>
  )
}

export function TrainingPage() {
  useSeo({
    title: `Dog Training in Halton Region | ${SUFFIX}`,
    description:
      'Structured, outdoor dog training in Oakville, Burlington, Milton and Halton Hills. Every program starts with a Training Assessment and a personalized plan.',
    path: PAGES.training.path,
  })
  return (
    <>
      <PageHeader title={['Dog', 'training.']} intro={training.summary}>
        <BookLink magnetic>{training.cta}</BookLink>
        <ButtonLink href="#process" variant="ghost-light">
          How training works
        </ButtonLink>
      </PageHeader>
      <TrainingDetail />
      <Process />
      <Statement />
      <FinalCTA />
    </>
  )
}

export function PetCarePage() {
  useSeo({
    title: `Dog Walking, Drop-Ins, House Sitting & Boarding | ${SUFFIX}`,
    description:
      'Dog walks from $30, dog and cat drop-in visits, overnight house sitting and boarding across Halton Region. See what’s included and our rates.',
    path: PAGES.petCare.path,
  })
  return (
    <>
      <PageHeader
        title={['Pet care.']}
        intro="Walks, drop-in visits and overnight care across Halton Region. Open any service to see what’s included and our rates."
      >
        <BookLink magnetic />
      </PageHeader>
      <CareServices />
      <FinalCTA />
    </>
  )
}

export function AboutPage() {
  useSeo({
    title: `About Emma, Angel & Romeo | ${SUFFIX}`,
    description:
      'Meet K9 Movement founder Emma Vázquez, an athlete and lifelong animal rescuer, and the pack: rescue dogs Angel and Romeo and cats Bonita and Casper.',
    path: PAGES.about.path,
  })
  return (
    <>
      <PageHeader
        title={['Our story.']}
        intro="K9 Movement grew out of two rescue dogs and one belief: every dog deserves more than a walk."
      />
      <Founder />
      <Pack />
      <Values
        heading="Bond. Discipline. Outside."
        intro="Three values shape every session, every walk and every visit. They’re how we work with your dog, and how we work with you."
      />
      <FinalCTA />
    </>
  )
}

export function ServiceAreaPage() {
  useSeo({
    title: `Service Area: Oakville, Burlington, Milton & Halton Hills | ${SUFFIX}`,
    description:
      'K9 Movement offers dog training, walks, drop-in visits, house sitting and boarding across Halton Region: Oakville, Burlington, Milton and Halton Hills.',
    path: PAGES.area.path,
  })
  return (
    <>
      <PageHeader
        title={['Service', 'area.']}
        intro="We train and care for dogs across Halton Region, Ontario, outdoors and in the neighbourhoods your dog already knows."
      />
      <ServiceArea />
      <TownDetails />
      <FinalCTA />
    </>
  )
}

export function FaqPage() {
  useSeo({
    title: `FAQ: Rates, Booking & Services | ${SUFFIX}`,
    description:
      'Answers about booking, rates, pack walks, house sitting, boarding and training assessments with K9 Movement in Halton Region.',
    path: PAGES.faq.path,
  })
  return (
    <>
      <PageHeader title={['Questions,', 'answered.']} intro={
          <>
            Can’t find what you need? Call <span className="whitespace-nowrap">{CONTACT.phone}</span> or email{' '}
            <span className="whitespace-nowrap">{CONTACT.email}</span>.
          </>
        }
      />
      <FaqList />
      <FinalCTA />
    </>
  )
}

export function ContactPage() {
  useSeo({
    title: `Contact & Booking | ${SUFFIX}`,
    description: `Book dog training or pet care with K9 Movement. Call ${CONTACT.phone}, email ${CONTACT.email} or message us on Instagram.`,
    path: PAGES.contact.path,
  })
  return (
    <>
      <PageHeader title={['Get in', 'touch.']} intro="Questions about training or care? We’d like to hear about your dog." />
      <ContactBlock />
    </>
  )
}

export function NotFoundPage() {
  useSeo({ title: `Page not found | ${SUFFIX}`, description: 'This page doesn’t exist.', path: '/404' })
  return (
    <PageHeader title={['Off the', 'trail.']} intro="We couldn’t find that page. It may have moved, or the link may be mistyped.">
      <ButtonLink to={PAGES.home.path}>Back to home</ButtonLink>
      <ButtonLink to={PAGES.contact.path} variant="ghost-light">
        Contact us
      </ButtonLink>
    </PageHeader>
  )
}
