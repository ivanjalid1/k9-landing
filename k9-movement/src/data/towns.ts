/**
 * Service-area copy. Deliberately general: no specific parks, distances or
 * statistics we can't verify. Edit freely once Emma confirms local details.
 */
export type Town = { name: string; slug: string; body: string[] }

export const towns: Town[] = [
  {
    name: 'Oakville',
    slug: 'oakville',
    body: [
      'We walk, visit and train dogs across Oakville. Walks follow your dog’s routine and pace, whether that means a steady loop of the neighbourhood or more time out on a trail.',
      'Drop-in visits and house sitting keep your pets at home and on schedule while you’re at work or away.',
    ],
  },
  {
    name: 'Burlington',
    slug: 'burlington',
    body: [
      'In Burlington we train outdoors, in the kind of places your dog actually spends time: sidewalks, parks and paths with real distractions.',
      'Practising there, instead of in a quiet room, is what makes good behaviour hold up on your everyday walks.',
    ],
  },
  {
    name: 'Milton',
    slug: 'milton',
    body: [
      'For Milton families we offer the full range of care, from 30-minute walks and drop-ins to overnight house sitting and boarding.',
      'Every training program here starts the same way as anywhere else: with a Training Assessment, so the plan fits your dog.',
    ],
  },
  {
    name: 'Halton Hills',
    slug: 'halton-hills',
    body: [
      'We serve Halton Hills, including Georgetown and Acton, with walks, drop-in visits, house sitting and outdoor training.',
      'Small pack walks (never more than 6 dogs) give social dogs time with others while keeping every walk safe and manageable.',
    ],
  },
]
