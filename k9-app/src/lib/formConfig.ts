export type PetType = 'dog' | 'other' | ''

export const PET_TYPES = [
  {
    id: 'dog',
    icon: '🐕',
    title: 'Dog',
    description: 'Training, walking, sitting & boarding',
  },
  {
    id: 'other',
    icon: '🐾',
    title: 'Other Pets',
    description: 'Cats, guinea pigs, rabbits, birds & more',
  },
]

export const CATEGORIES = [
  {
    id: 'training',
    icon: '🎓',
    otherIcon: '🎓',
    title: 'Training',
    otherTitle: 'Training',
    description: 'Assessment & training program applications',
    dogOnly: true,
  },
  {
    id: 'walking-boarding',
    icon: '🐕',
    otherIcon: '🏠',
    title: 'Walking / Sitting / Boarding',
    otherTitle: 'Sitting / Boarding',
    description: 'Service agreements, applications & waivers',
    dogOnly: false,
  },
]

export const SERVICES = {
  training: [
    {
      id: 'training-assessment',
      icon: '🐕',
      title: 'Dog Training Assessment',
      otherTitle: 'Dog Training Assessment',
      description: 'Behavioral evaluation & personalized training plan',
      otherDescription: 'Behavioral evaluation & personalized training plan',
    },
    {
      id: 'training-application',
      icon: '🏆',
      title: 'Training Application Form',
      otherTitle: 'Training Application Form',
      description: 'Apply for our structured training programs',
      otherDescription: 'Apply for our structured training programs',
    },
  ],
  'walking-boarding': [
    {
      id: 'boarding-application',
      icon: '🏠',
      title: 'Walking / Sitting & Boarding Application',
      otherTitle: 'Sitting & Boarding Application',
      description: 'Application form for walking, sitting & boarding services',
      otherDescription: 'Application form for pet sitting & boarding services',
    },
  ],
}

export type CategoryId = keyof typeof SERVICES

/** Categories available for the chosen pet type (training is dog-only). */
export function getCategories(petType: PetType) {
  return CATEGORIES
    .filter((cat) => petType !== 'other' || !cat.dogOnly)
    .map((cat) => ({
      ...cat,
      icon: petType === 'other' ? cat.otherIcon : cat.icon,
      title: petType === 'other' ? cat.otherTitle : cat.title,
    }))
}

/** Forms of a category, with titles adapted to the pet type. */
export function getServices(category: string, petType: PetType) {
  const list = SERVICES[category as CategoryId] || []
  return list.map((svc) => ({
    ...svc,
    title: petType === 'other' ? svc.otherTitle : svc.title,
    description: petType === 'other' ? svc.otherDescription : svc.description,
  }))
}

/** All form IDs of a category (used to pre-check every form on category select). */
export function getCategoryServiceIds(category: string): string[] {
  return (SERVICES[category as CategoryId] || []).map((svc) => svc.id)
}

/** Short titles used for the step-4 tabs / form cards. */
export function getServiceTitle(svcId: string, petType: PetType): string {
  const titles: Record<string, string> = {
    'training-assessment': 'Training Assessment',
    'training-application': 'Training Application',
    'boarding-application': petType === 'other' ? 'Sitting & Boarding Application' : 'Walking, Sitting & Boarding Application',
    'waiver-form': 'Waiver & Release Form',
  }
  return titles[svcId] || svcId
}

/** Boarding-application questions that only make sense for dogs. */
export const DOG_ONLY_BOARDING_FIELDS = [
  'bite', 'biteDetails',
  'fight', 'fightDetails',
  'sizeIssue', 'sizeIssueDetails',
  'parks', 'parksDetails',
]

export const STEP_LABELS = ['Services', 'Owner', 'Pet', 'Details', 'Sign']

export const INITIAL_OWNER = {
  fullName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  postalCode: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
}

export const INITIAL_DOG = {
  name: '',
  breed: '',
  age: '',
  gender: '',
  weight: '',
  spayedNeutered: '',
}

/** Shared pet-care info asked in the Pet step for every species. */
export const INITIAL_PET_CARE = {
  vetName: '',
  vetClinicName: '',
  vetPhone: '',
  feedingInstructions: '',
}

export const INITIAL_TRAINING_ASSESSMENT = {
  // Training Goals
  goals: '',
  // Dog General Info (extras beyond shared dog step)
  source: '',
  howLong: '',
  breedFamiliarity: '',
  reasonsForDog: '',
  principalHandler: '',
  // Behavior & Temperament
  strangerReaction: '',
  temperament: '',
  fearsYN: 'no',
  fears: '',
  aggression: '',
  aggressionDetails: '',
  bitten: '',
  bittenDetails: '',
  newEnvironments: '',
  behavioralChallengesYN: 'no',
  behavioralChallenges: '',
  // Training History
  prevTraining: '',
  prevTrainingDetails: '',
  commands: '',
  // Training Goals
  behaviors: '',
  frequency: '',
  // Activity
  routine: '',
  physicalActivities: '',
  cognitiveActivities: '',
  favoriteActivities: '',
  interactsAnimals: '',
  fencedYard: '',
  // Veterinary Information
  vetName: '',
  vetClinicName: '',
  vetPhone: '',
  vetAddress: '',
  // General Health
  medicationYN: 'no',
  medication: '',
  allergies: '',
  grooming: '',
  foodType: '',
  recentHealthChangesYN: 'no',
  recentHealthChanges: '',
  healthConcernsYN: 'no',
  // Vaccinations & Health
  vaccinations: '',
  lastVaccDate: '',
  rabiesVaccine: '',
  rabiesDate: '',
  heartworm: '',
  heartwormDetails: '',
  healthConcerns: '',
  // Referral
  referral: '',
}

export const INITIAL_TRAINING_APP = {
  // Owner extras
  referral: '',
  numberOfDogs: '',
  otherAnimalsYN: 'no',
  otherAnimals: '',

  // Behavior & Temperament
  sleepLocation: '',
  houseTrained: '',
  feedingArea: '',
  goals: '',

  // Veterinary extras
  vetName: '',
  vetClinicName: '',
  vetPhone: '',
  vetAddress: '',

  // Vaccinations / Health
  vaccinations: '',
  rabiesVaccine: '',
  rabiesDate: '',
  heartworm: '',
  heartwormDetails: '',
  healthConcerns: '',

  // Behavior information
  leashWalking: '',

  // Task reactions
  taskTrimmingNails: '',
  taskGivingPills: '',
  taskCleaningEars: '',
  taskGrooming: '',
  taskBathing: '',
  taskPattingHead: '',

  // Correction techniques
  corrTimeOut: '',
  corrLeashCorrection: '',
  corrVerbalScolding: '',

  // Behavior problems (multi-select stored as comma-separated)
  behaviorProblems: [],

  // Training & Goals extras
  sizeIssue: '',
  sizeIssueDetails: '',

  // When left alone
  aloneDay: '',
  aloneEvening: '',
  reactionDeparture: '',
  reactionHomecoming: '',

  // Crate
  useCrate: '',

  // Exhibited behaviors (yes/no toggle + describe when it occurs)
  exhibitCoweringYN: 'no',
  exhibitCowering: '',
  exhibitEarBackYN: 'no',
  exhibitEarBack: '',
  exhibitTailTuckedYN: 'no',
  exhibitTailTucked: '',
  exhibitRetreatingYN: 'no',
  exhibitRetreating: '',
  exhibitHidingYN: 'no',
  exhibitHiding: '',
  exhibitSalivatingYN: 'no',
  exhibitSalivating: '',
  exhibitPacingYN: 'no',
  exhibitPacing: '',

  // Fear / anxiety
  fearAnxietyInfoYN: 'no',
  fearAnxietyInfo: '',
  fearfulSituationsYN: 'no',
  fearfulSituations: '',
  muzzleForSafety: '',
  familyAfraidOfDogYN: 'no',
  familyAfraidOfDog: '',

  // Situational reactions
  reactEating: '',
  reactTreatToy: '',
  reactScolded: '',
  reactPushedOff: '',
  reactSleeping: '',
  reactStrangersOutside: '',
  reactPeopleEntering: '',
  reactChildren: '',
  reactInCar: '',
  reactDogsHome: '',
  reactDogsOutside: '',
  bittenPerson: '',

}

export const INITIAL_BOARDING_APP = {
  bite: '',
  biteDetails: '',
  fight: '',
  fightDetails: '',
  sizeIssue: '',
  sizeIssueDetails: '',
  parks: '',
  parksDetails: '',
  // Veterinary Information
  vetName: '',
  vetClinicName: '',
  vetPhone: '',
  vetAddress: '',
  medical: '',
  onMeds: '',
  medsDetails: '',
  vaccinations: '',
  restrictions: '',
  obedience: '',
  obedienceDetails: '',
  referral: '',
  // Service Agreement
  effectiveDate: '',
  dogNames: '',
  agreeServiceTerms: false,
}

export const INITIAL_WAIVER = {
  dogNames: '',
  agreeTerms: false,
}

export const INITIAL_CANCELLATION = {
  agreeTerms: false,
}
