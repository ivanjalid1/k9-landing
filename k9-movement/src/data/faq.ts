/**
 * FAQ content. Answers use only confirmed facts.
 * Items marked `todo: true` are placeholders and are NOT rendered on the site.
 * They are listed in the README so Emma can confirm them.
 */
import { CONTACT } from '../config'

export type FaqItem = { q: string; a: string[]; todo?: boolean }

export const faq: FaqItem[] = [
  {
    q: 'How do I book?',
    a: [
      'Use the Book Now button anywhere on the site. It opens our intake form, where you tell us about you, your pet and the service you need.',
      `Prefer to talk first? Call ${CONTACT.phone} or email ${CONTACT.email}.`,
    ],
  },
  {
    q: 'Where do you work?',
    a: ['We serve Halton Region, Ontario: Oakville, Burlington, Milton and Halton Hills. If you’re close by but not on the list, call us and we’ll let you know.'],
  },
  {
    q: 'How does dog training start?',
    a: [
      'Every training program starts with a Training Assessment: a behavioural evaluation of your dog and a conversation about your goals.',
      'From there you get a personalized training plan and structured sessions, held outdoors in real-world settings.',
    ],
  },
  {
    q: 'How much does dog training cost?',
    a: ['Training is tailored to each dog, so it starts with a Training Assessment. Book an assessment and we’ll talk through the plan and the cost with you.'],
  },
  {
    q: 'How much is a dog walk?',
    a: ['$30 for 30 minutes, $40 for 45 minutes and $50 for 1 hour. Each additional dog is $15. Dog drop-in visits have the same rates.'],
  },
  {
    q: 'Do you do group walks?',
    a: ['Yes. Group or pack walks help social dogs explore new places with others. Groups are kept small, with a maximum of 6 dogs, for everyone’s safety.'],
  },
  {
    q: 'Do you look after cats?',
    a: ['Yes. Cat drop-in visits include feeding, fresh water, litter clean-up and playtime: $27 for 30 minutes, $35 on weekends and holidays, plus $12 for each additional cat.'],
  },
  {
    q: 'What does house sitting include?',
    a: [
      'We stay overnight at your home and provide three 30-minute walks or visits during the day, plus feeding and fresh water.',
      'It’s $120 per night for one dog and $145 for two dogs. Each additional cat is $15; weekends and evenings add $10, holidays add $20.',
    ],
  },
  {
    q: 'How does boarding work?',
    a: ['Boarding starts with an application, so we can learn your dog’s routine and needs before the first stay. Rates are confirmed once your application has been reviewed.'],
  },
  {
    q: 'Do you offer pet transportation?',
    a: ['Pet transportation is available on request. Mention it when you book and we’ll confirm the details.'],
  },

  // ---- Placeholders: not shown on the site until confirmed ----
  {
    q: 'What is your cancellation policy?',
    a: ['TODO: confirm with Emma (notice period, fees, holiday bookings).'],
    todo: true,
  },
  {
    q: 'Are you insured?',
    a: ['TODO: confirm with Emma (insurance / bonding details).'],
    todo: true,
  },
  {
    q: 'How do I pay?',
    a: ['TODO: confirm with Emma (accepted payment methods, when payment is due).'],
    todo: true,
  },
  {
    q: 'Does my dog need to be vaccinated?',
    a: ['TODO: confirm with Emma (required vaccinations for walks, pack walks and boarding).'],
    todo: true,
  },
]

export const publishedFaq = faq.filter((item) => !item.todo)
