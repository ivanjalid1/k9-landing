/**
 * Site-wide settings. Change values here, not in components.
 */

// TODO: confirm the live URL of the intake form before launch.
// Every "Book Now" / "Book an assessment" / "Apply" button links here.
export const BOOK_NOW_URL = 'https://k9movement.com/form'

export const CONTACT = {
  phone: '289-681-9458',
  phoneHref: 'tel:+12896819458',
  email: 'info@k9movement.com',
  instagramHandle: '@k9movement.on',
  instagramUrl: 'https://instagram.com/k9movement.on',
  website: 'k9movement.com',
  websiteUrl: 'https://k9movement.com',
} as const

export const SERVICE_AREA = ['Oakville', 'Burlington', 'Milton', 'Halton Hills'] as const

/**
 * Remaining placeholder photography (Unsplash). Hero and final call to action now use
 * the client's own photos (src/assets/photos).
 * TODO: replace with K9 Movement's own photography (see README).
 */
const unsplash = (id: string) => (w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`

export const PHOTOS = {
  /** Core values background: dark misty forest. No real photo suits a full-bleed, card-covered background yet. */
  values: unsplash('1448375240586-882707db888b'),
} as const

export const srcSet = (build: (w: number) => string, widths: number[]) =>
  widths.map((w) => `${build(w)} ${w}w`).join(', ')
