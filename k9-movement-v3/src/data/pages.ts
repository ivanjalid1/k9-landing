/** Single source for page paths and labels (nav, footer, contact links). */
export const PAGES = {
  home: { path: '/', label: 'Home' },
  training: { path: '/training', label: 'Training' },
  petCare: { path: '/pet-care', label: 'Pet care' },
  about: { path: '/about', label: 'About' },
  area: { path: '/service-area', label: 'Service area' },
  faq: { path: '/faq', label: 'FAQ' },
  contact: { path: '/contact', label: 'Contact' },
} as const

export const NAV_PAGES = [PAGES.training, PAGES.petCare, PAGES.about, PAGES.area, PAGES.faq, PAGES.contact]
