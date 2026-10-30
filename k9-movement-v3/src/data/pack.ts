/**
 * About page: Emma's own words and the pack. Lightly edited from the texts supplied by the
 * designer (brand-assets/About Us (Fini)/…/*.txt); facts unchanged.
 */
import angel from '../assets/photos/angel-water.webp'
import romeo from '../assets/photos/romeo-grass.webp'
import bonita from '../assets/photos/bonita.webp'
import casper from '../assets/photos/casper.webp'

export const emmaBio = [
  'Welcome to K9 Movement, where our passion for animals and sports comes together to create a unique and enriching experience for your furry friends. I’m Emma Vázquez, the founder of K9 Movement, and I couldn’t be more thrilled to share our journey with you.',
  'From a young age, I was drawn to all kinds of dogs and cats, and that grew into a deep love and care for them. As I got more involved in animal rescue and relocation, I learned the true power of kindness, love and patience in helping these wonderful animals reach their full potential.',
  'Sports have also played a big role in my life, from captaining basketball teams to competing in 5K, 10K and half-marathon races. My connection with nature, animals and people fuelled my desire to bring my two passions together.',
  'That’s how K9 Movement was born: dog training, dog walking, house sitting and drop-in visits in Halton and the surrounding areas. Every animal is unique, so we tailor our services to your pet’s individual needs and give you the best customer service we can.',
]

export type PackMember = { name: string; tag: string; photo: string; width: number; height: number; alt: string; body: string; position?: string }

export const pack: PackMember[] = [
  {
    name: 'Angel',
    tag: 'High-energy rescue',
    photo: angel,
    width: 1000,
    height: 798,
    alt: 'Angel splashing through a creek with her tongue out',
    body: 'Angel was abandoned in an apartment when she was just a few months old and left without food for a long time. She was rescued from a high-kill shelter in Georgia and found her forever home with us. Her sweet, affectionate nature reminds us that love can heal even the deepest wounds.',
  },
  {
    name: 'Romeo',
    tag: 'Resilient survivor',
    photo: romeo,
    width: 1000,
    height: 750,
    alt: 'Romeo lying in the grass in the sun',
    body: 'Romeo came from the same high-kill shelter as Angel: extremely scared, skinny and sick. With love and care he learned to trust, and he even overcame his fear of water. Today he loves to swim, and he’s a reminder of what resilience and healing look like.',
  },
  {
    name: 'Bonita',
    tag: 'Siamese lynx point',
    photo: bonita,
    width: 828,
    height: 833,
    alt: 'Bonita as a tiny kitten, sleeping belly-up on a lap',
    body: 'We were told Bonita was 10 weeks old when we adopted her. She turned out to be only 3 weeks. We fought hard to nurse her back to health, and she proved to be a fighter with a strong character. Today she reigns as the queen of the house.',
  },
  {
    name: 'Casper',
    tag: 'The gentleman',
    photo: casper,
    width: 828,
    height: 826,
    position: '50% 0%',
    alt: 'Casper, a fluffy light-coloured cat, sitting on a woven mat',
    body: 'Affectionate and well-mannered, Casper is the perfect gentleman. His breeder called him a Siamese lynx point snowshoe Balinese; the vet believed he was a Siberian. Either way, he’s our fur baby, and he brings joy and comfort to everyone around him.',
  },
]
