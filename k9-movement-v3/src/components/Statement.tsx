const primary = ['Real discipline.', 'Real results.', 'Ready for the real world.', 'Unleash the full potential.']
const secondary = ['Your dog deserves more than a walk.', 'Professional care. Real results.']

/** A short 45° bar, the Stride pattern's mark, used as the separator. */
function Stride({ className }: { className: string }) {
  return <span aria-hidden="true" className={`inline-block shrink-0 -rotate-45 ${className}`} />
}

function Track({ items, className, itemClassName, sepClassName }: { items: string[]; className: string; itemClassName: string; sepClassName: string }) {
  // Two identical halves; the animation moves the track by exactly one half, so the loop is seamless.
  const half = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {items.map((t) => (
        <span key={t} className="flex items-center">
          <span className={`whitespace-nowrap ${itemClassName}`}>{t}</span>
          <Stride className={sepClassName} />
        </span>
      ))}
    </div>
  )
  return <div className={`flex w-max ${className}`}>{[half('a'), half('b')]}</div>
}

export function Statement() {
  return (
    <section aria-label="Our promise" className="relative isolate overflow-hidden bg-forest py-16 sm:py-24">
      <div aria-hidden="true" className="texture-stride-dark animate-drift -z-10 opacity-30 mix-blend-multiply" />
      <p className="sr-only">Real discipline. Real results. Ready for the real world.</p>

      <div aria-hidden="true" className="flex flex-col gap-4 sm:gap-6">
        <Track
          items={primary}
          className="animate-marquee hover:[animation-play-state:paused]"
          itemClassName="display text-[clamp(2.6rem,7vw,7rem)] leading-none text-cloud"
          sepClassName="mx-6 h-[0.12em] w-[1.1em] bg-mist text-[clamp(2.6rem,7vw,7rem)] sm:mx-10"
        />
        <Track
          items={secondary}
          className="animate-marquee-reverse hover:[animation-play-state:paused]"
          itemClassName="display text-[clamp(1.3rem,2.6vw,2.4rem)] leading-none text-ink"
          sepClassName="mx-5 h-[0.14em] w-[1.1em] bg-ink/70 text-[clamp(1.3rem,2.6vw,2.4rem)] sm:mx-8"
        />
      </div>
    </section>
  )
}
