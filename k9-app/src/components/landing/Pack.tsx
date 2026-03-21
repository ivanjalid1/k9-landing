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
        <div className="relative w-[200px] h-[200px] max-md:w-[150px] max-md:h-[150px] max-[480px]:w-[180px] max-[480px]:h-[180px] mx-auto mb-7 rounded-full overflow-hidden border-[3px] border-[#c4e2d0] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-[#2d5a42] group-hover:shadow-[0_0_30px_rgba(45,90,66,0.15),0_0_60px_rgba(196,137,30,0.08)]">
          <img
            src={pet.image}
            alt={pet.name}
            className="w-full h-full object-cover transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
          />
        </div>

        <h3 className="font-[family-name:var(--font-landing-display)] text-[1.8rem] tracking-[0.1em] text-[#2d5a42] mb-2">
          {pet.name}
        </h3>
        <p className="text-[0.78rem] font-medium tracking-[0.12em] uppercase text-[#C4891E] mb-4">
          {pet.breed}
        </p>
        <p className="text-[0.88rem] font-light leading-[1.7] text-[#5C574D] max-w-[240px] mx-auto">
          {pet.story}
        </p>
      </div>
    </Reveal>
  )
}

export function Pack() {
  return (
    <section id="pack" className="py-[120px] pb-[140px] bg-gradient-to-b from-[#faf5ea] to-white relative scroll-mt-20">
      {/* Subtle green glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(90,158,120,0.06)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-[clamp(20px,5vw,60px)] relative z-[1]">
        <div className="text-center mb-[72px]">
          <Reveal>
            <div className="text-[0.78rem] font-semibold tracking-[0.25em] uppercase text-[#C4891E] mb-4">
              The Family
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="font-[family-name:var(--font-landing-display)] text-[clamp(3rem,6vw,4.5rem)] tracking-[0.04em] text-[#2A2520] leading-none mb-4">
              MEET THE PACK
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="font-[family-name:var(--font-landing-accent)] italic text-[1.1rem] text-[#9E9785] max-w-[460px] mx-auto">
              The heart and soul of K9 Movement
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-4 gap-7 max-lg:grid-cols-2 max-lg:gap-10 max-[480px]:grid-cols-1">
          {pets.map((pet, i) => (
            <PetCard key={pet.name} pet={pet} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}
