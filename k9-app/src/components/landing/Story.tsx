import { Reveal } from '../../hooks/useScrollReveal'

export function Story() {
  return (
    <section id="story" className="py-[140px] max-md:py-20 bg-[#FAF8F4] text-[#222] relative overflow-hidden scroll-mt-20">
      {/* Decorative blobs */}
      <div className="absolute -top-[100px] -left-[100px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(232,168,56,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-[100px] -right-[100px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(232,168,56,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-[clamp(20px,5vw,60px)]">
        <div className="grid grid-cols-[1fr_1.1fr] gap-20 items-center max-md:grid-cols-1 max-md:gap-12">

          {/* Image */}
          <Reveal direction="left">
            <div className="relative">
              {/* Corner accents */}
              <div className="absolute -top-3 -left-3 w-20 h-20 border-t-[3px] border-l-[3px] border-[#E8A838] z-[2]" />
              <div className="absolute -bottom-3 -right-3 w-20 h-20 border-b-[3px] border-r-[3px] border-[#E8A838] z-[2]" />

              <div className="relative overflow-hidden aspect-[4/5] bg-[#D4CFC4] max-md:aspect-video max-md:max-w-[500px] max-md:mx-auto">
                {/* Replace with Emma's actual photo (IMG_8932.jpg) */}
                <img
                  src="https://images.unsplash.com/photo-1544568100-847a948585b9?w=800&q=80"
                  alt="Emma Vazquez with dogs"
                  className="w-full h-full object-cover transition-transform duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04]"
                />
              </div>
            </div>
          </Reveal>

          {/* Content */}
          <Reveal direction="right">
            <div className="relative z-[1]">
              <div className="text-[0.78rem] font-semibold tracking-[0.25em] uppercase text-[#C4891E] mb-4">
                Our Story
              </div>
              <h2 className="font-[family-name:var(--font-landing-display)] text-[clamp(2.5rem,5vw,3.5rem)] tracking-[0.04em] text-[#222] leading-none mb-2">
                FINDING INSPIRATION
              </h2>
              <span className="font-[family-name:var(--font-landing-accent)] italic font-normal text-[clamp(1.2rem,2vw,1.5rem)] text-[#C4891E] block mb-8">
                in Every Paw
              </span>

              <p className="text-[0.95rem] font-light leading-[1.85] text-[#5C574D] mb-5">
                Welcome to <strong className="font-semibold text-[#222]">K9 Movement</strong>, where our passion for animals and sports come
                together to create a unique and enriching experience for your furry friends. I'm Emma Vazquez,
                the founder, and I couldn't be more thrilled to share our journey with you.
              </p>
              <p className="text-[0.95rem] font-light leading-[1.85] text-[#5C574D] mb-5">
                From a young age, I found myself drawn to various breeds of dogs and cats, fostering a deep
                love and care for them. As I got more involved in animal rescue and relocation, I learned the
                true power of kindness, love, and patience.
              </p>
              <p className="text-[0.95rem] font-light leading-[1.85] text-[#5C574D]">
                Sports have also played a significant role in my life — from captaining basketball teams to
                competing in 5K, 10K, and half marathon races. The connection with nature, animals, and people
                fueled my desire to combine my two passions into something extraordinary.
              </p>

              <div className="mt-9 pt-7 border-t border-[#D4CFC4]">
                <div className="font-[family-name:var(--font-landing-accent)] italic text-[1.3rem] text-[#222]">
                  Emma Vazquez
                </div>
                <div className="text-[0.82rem] text-[#9E9785] tracking-[0.08em] uppercase mt-0.5">
                  Founder, K9 Movement
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
