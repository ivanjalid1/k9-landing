import angel from '../assets/photos/angel-portrait.webp'
import romeo from '../assets/photos/romeo-portrait.webp'
import { PAGES } from '../data/pages'
import { ButtonLink } from './ui'
import { Reveal } from './motion'
import { DogPhoto } from './DogPhoto'
import { clipUp } from '../lib/motion'

/** Home page: short Angel & Romeo intro that links to the About page. */
export function StoryTeaser() {
  return (
    <section aria-labelledby="teaser-title" className="relative isolate overflow-hidden bg-night py-24 text-cloud sm:py-32">
      <div className="mx-auto grid max-w-[1320px] items-center gap-14 px-4 sm:px-8 lg:grid-cols-12 lg:gap-10">
        <div className="grid max-w-[560px] grid-cols-2 items-end gap-3 sm:gap-5 lg:col-span-5 lg:max-w-none">
          <DogPhoto src={angel} width={900} height={1200} name="Angel" alt="Angel, a tan rescue dog, looking into the camera on a walk" depth={40} />
          <DogPhoto src={romeo} width={900} height={1200} name="Romeo" alt="Romeo, a black and white rescue dog, looking up on a gravel trail" depth={-70} className="sm:mb-14" />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal as="h2" variants={clipUp} className="display text-[clamp(2rem,4.6vw,4rem)]">
            <span id="teaser-title">Meet Angel &amp; Romeo.</span>
          </Reveal>
          <Reveal as="p" delay={0.12} className="mt-8 max-w-[52ch] text-[1.05rem] leading-relaxed text-cloud/85">
            Angel and Romeo were rescued from a high-kill shelter in Georgia. Watching them rebuild their sense of safety
            through consistency and trust is where our founder’s belief in real training was born.
          </Reveal>
          <Reveal delay={0.24} className="mt-9">
            <ButtonLink to={PAGES.about.path} variant="ghost-light">
              Read our story
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
