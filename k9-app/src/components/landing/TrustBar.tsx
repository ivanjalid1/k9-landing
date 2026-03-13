import { useEffect, useRef, useState } from 'react'
import { Reveal } from '../../hooks/useScrollReveal'

interface AnimatedCounterProps { target: number; suffix?: string }
function AnimatedCounter({ target, suffix = '' }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 2000
          const step = target / (duration / 16)
          let current = 0
          const timer = setInterval(() => {
            current += step
            if (current >= target) {
              current = target
              clearInterval(timer)
            }
            setCount(Math.floor(current))
          }, 16)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}

const stats = [
  { value: 500, suffix: '+', label: 'Happy Pets' },
  { display: '6 MAX', label: 'Dogs Per Group' },
  { display: '24/7', label: 'House Sitting Care' },
  { display: '100%', label: 'Love & Dedication' },
]

export function TrustBar() {
  return (
    <section className="relative bg-[#0a0a0a] py-12 overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-[clamp(20px,5vw,60px)] relative z-[1]">
        <div className="grid grid-cols-4 gap-10 text-center max-md:grid-cols-2 max-md:gap-7 max-[480px]:gap-5">
          {stats.map((stat, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="flex flex-col items-center gap-1">
                <div className="font-[family-name:var(--font-landing-display)] text-[clamp(2.5rem,4vw,3.5rem)] text-[#E8A838] leading-none">
                  {stat.value ? (
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  ) : (
                    stat.display
                  )}
                </div>
                <div className="text-[0.82rem] font-normal text-white/50 tracking-[0.08em] uppercase">
                  {stat.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
