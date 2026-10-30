export type Rate = { label: string; price: string }

export type CareService = {
  id: string
  name: string
  summary: string
  /** Lowest price, shown in the collapsed row. Omit when there is no public price. */
  from?: string
  description: string[]
  rates?: Rate[]
  notes?: string[]
  cta: string
}

export type ServiceGroup = {
  id: string
  title: string
  icon: 'walking' | 'boarding'
  services: CareService[]
}

const walkRates: Rate[] = [
  { label: '30 minutes', price: '$30' },
  { label: '45 minutes', price: '$40' },
  { label: '1 hour', price: '$50' },
]

export const training = {
  name: 'Dog training',
  summary:
    'Structured, outdoor training built around your dog. Every program starts with a Training Assessment: a behavioural evaluation and a personalized training plan.',
  points: [
    'Behavioural evaluation and personalized plan',
    'Structured programs with measurable goals',
    'Sessions on trails, in parks and in real-world settings',
  ],
  cta: 'Book an assessment',
}

export const careGroups: ServiceGroup[] = [
  {
    id: 'walks',
    title: 'Walks & drop-in visits',
    icon: 'walking',
    services: [
      {
        id: 'dog-walking',
        name: 'Dog walking',
        summary: 'Exercise, sniffing and socializing, around the neighbourhood or out on the trail.',
        from: '$30',
        description: [
          'Your dog gets the chance to stretch, exercise, sniff and take care of their bathroom business around the neighbourhood.',
          'Group or pack walks are available so your dog can socialize and explore new places. Groups stay small, with a maximum of 6 dogs, for everyone’s safety.',
        ],
        rates: walkRates,
        notes: ['Each additional dog: +$15'],
        cta: 'Book a walk',
      },
      {
        id: 'dog-drop-in',
        name: 'Dog drop-in visits',
        summary: 'Play, attention and a potty break at home while you’re away.',
        from: '$30',
        description: [
          'We visit your dog in the comfort of your home to play, give some attention and make sure they get a potty break.',
        ],
        rates: walkRates,
        notes: ['Each additional dog: +$15'],
        cta: 'Book a visit',
      },
      {
        id: 'cat-drop-in',
        name: 'Cat drop-in visits',
        summary: 'Feeding, fresh water, litter and plenty of playtime.',
        from: '$27',
        description: [
          'For our cat clients we take care of feeding, fresh water and litter clean-up, with plenty of playtime in between.',
        ],
        rates: [
          { label: '30 minutes', price: '$27' },
          { label: '30 minutes, weekends & holidays', price: '$35' },
        ],
        notes: ['Each additional cat: +$12'],
        cta: 'Book a visit',
      },
    ],
  },
  {
    id: 'overnight',
    title: 'Overnight care',
    icon: 'boarding',
    services: [
      {
        id: 'house-sitting',
        name: 'House sitting',
        summary: 'Overnight care at your home, with three 30-minute walks a day.',
        from: '$120',
        description: [
          'House sitting keeps stress low for you and your pets. We stay overnight and provide all the care your pets need at home.',
          'Includes three 30-minute walks or visits during the day, the overnight stay, feeding and fresh water.',
        ],
        rates: [
          { label: 'One dog, per night', price: '$120' },
          { label: 'Two dogs, per night', price: '$145' },
        ],
        notes: ['Each additional cat: +$15', 'Weekends & evenings: +$10', 'Holidays: +$20'],
        cta: 'Book house sitting',
      },
      {
        id: 'boarding',
        name: 'Boarding',
        summary: 'Care for your dog while you travel. Starts with an application.',
        description: [
          'Boarding starts with an application so we can get to know your dog, their routine and their needs before the first stay.',
          'Rates are confirmed once your application has been reviewed.',
        ],
        cta: 'Apply for boarding',
      },
    ],
  },
]
