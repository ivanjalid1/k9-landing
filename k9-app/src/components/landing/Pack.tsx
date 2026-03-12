import { Reveal } from '../../hooks/useScrollReveal'

const pets = [
  {
    name: 'CASPER',
    breed: 'Siberian Cat',
    image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&q=80',
    story: 'Affectionate and well-mannered, Casper embodies the perfect gentleman. He brings joy and comfort to everyone around him.',
  },
  {
    name: 'BONITA',
    breed: 'Siamese Lynx Point',
    image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=400&q=80',
    story: 'A courageous fighter who was only 3 weeks old when adopted. Now she reigns as the queen of the house with a zest for life.',
  },
  {
    name: 'ANGEL',
    breed: 'Rescue',
    image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&q=80',
    story: 'Abandoned as a puppy, rescued from a high-killing shelter in Georgia. Her sweet nature reminds us that love heals all wounds.',
  },
  {
    name: 'ROMEO',
    breed: 'Rescue',
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&q=80',
    story: 'From scared and sick to a confident swimmer. Romeo\'s journey is a testament to the power of resilience and healing.',
  },
]

interface PetCardProps { pet: typeof pets[number]; delay: number }
function PetCard({ pet, delay }: PetCardProps) {
  return (
    <Reveal delay={delay}>
      <div className="group text-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2">
        {/* Circular image */}
        <div className="relative w-[200px] h-[200px] max-md:w-[150px] max-md:h-[150px] max-[480px]:w-[180px] max-[480px]:h-[180px] mx-auto mb-7 rounded-full overflow-hidden border-[3px] border-white/10 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-[#E8A838] group-hover:shadow-[0_0_40px_rgba(232,168,56,0.15),0_0_80px_rgba(232,168,56,0.15)]">
          <img
            src={pet.image}
            alt={pet.name}
            className="w-full h-full object-cover transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
          />
        </div>

        <h3 className="font-[family-name:var(--font-landing-display)] text-[1.8rem] tracking-[0.1em] text-[#E8A838] mb-2">
          {pet.name}
        </h3>
        <p className="text-[0.78rem] font-medium tracking-[0.12em] uppercase text-white/50 mb-4">
          {pet.breed}
        </p>
        <p className="text-[0.88rem] font-light leading-[1.7] text-white/50 max-w-[240px] mx-auto">
          {pet.story}
        </p>
      </div>
    </Reveal>
  )
}

export function Pack() {
  return (
    <section id="pack" className="py-[120px] pb-[140px] bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#0a0a0a] relative scroll-mt-20">
      {/* Center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(232,168,56,0.15)_0%,transparent_60%)] pointer-events-none opacity-50" />

      <div className="max-w-[1240px] mx-auto px-[clamp(20px,5vw,60px)] relative z-[1]">
        {/* Header */}
        <div className="text-center mb-[72px]">
          <Reveal>
            <div className="text-[0.78rem] font-semibold tracking-[0.25em] uppercase text-[#E8A838] mb-4">
              The Family
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="font-[family-name:var(--font-landing-display)] text-[clamp(3rem,6vw,4.5rem)] tracking-[0.04em] text-white leading-none mb-4">
              MEET THE PACK
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="font-[family-name:var(--font-landing-accent)] italic text-[1.1rem] text-white/50 max-w-[460px] mx-auto">
              The heart and soul of K9 Movement
            </p>
          </Reveal>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 gap-7 max-lg:grid-cols-2 max-lg:gap-10 max-[480px]:grid-cols-1">
          {pets.map((pet, i) => (
            <PetCard key={pet.name} pet={pet} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}
