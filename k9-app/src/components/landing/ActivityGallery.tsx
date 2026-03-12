import { Reveal } from '../../hooks/useScrollReveal'

const activities = [
  {
    image: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=600&q=80',
    label: 'Trail Adventures',
  },
  {
    image: 'https://images.unsplash.com/photo-1558929996-da64ba858215?w=600&q=80',
    label: 'Park Socialization',
  },
  {
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80',
    label: 'Group Pack Walks',
  },
  {
    image: 'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=600&q=80',
    label: 'Nature Exploration',
  },
  {
    image: 'https://images.unsplash.com/photo-1494947665470-20322015e3a8?w=600&q=80',
    label: 'Beach & Water Fun',
  },
  {
    image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=600&q=80',
    label: 'Forest Hikes',
  },
]

export function ActivityGallery() {
  return (
    <section className="py-[100px] bg-[#0a0a0a] relative overflow-hidden">
      {/* Header */}
      <div className="max-w-[1240px] mx-auto px-[clamp(20px,5vw,60px)] mb-14">
        <Reveal>
          <div className="text-center">
            <div className="text-[0.78rem] font-semibold tracking-[0.25em] uppercase text-[#E8A838] mb-4">
              Life in Motion
            </div>
            <h2 className="font-[family-name:var(--font-landing-display)] text-[clamp(2.5rem,5vw,4rem)] tracking-[0.04em] text-white leading-none mb-4">
              EVERY DAY IS AN ADVENTURE
            </h2>
            <p className="text-[1rem] font-light text-white/50 max-w-[500px] mx-auto">
              From mountain trails to neighbourhood parks — we keep your pets active, happy and explored
            </p>
          </div>
        </Reveal>
      </div>

      {/* Clean 3-column grid */}
      <div className="max-w-[1240px] mx-auto px-[clamp(20px,5vw,60px)]">
        <div className="grid grid-cols-3 gap-3 max-md:grid-cols-2 max-[480px]:grid-cols-1 max-[480px]:max-w-[420px] max-[480px]:mx-auto">
          {activities.map((item, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="group relative overflow-hidden h-[280px] max-md:h-[240px] max-[480px]:h-[260px] cursor-pointer">
                <img
                  src={item.image}
                  alt={item.label}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                />
                {/* Permanent bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.65)] via-[rgba(0,0,0,0.1)] to-transparent" />
                {/* Hover darker overlay */}
                <div className="absolute inset-0 bg-[rgba(0,0,0,0.2)] opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="font-[family-name:var(--font-landing-display)] text-[1.2rem] tracking-[0.1em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                    {item.label}
                  </p>
                  <div className="w-8 h-[2px] bg-[#E8A838] mt-2 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
