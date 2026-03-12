export const CATEGORIES = [
  {
    id: 'training',
    icon: '🎓',
    title: 'Training',
    description: 'Assessment & training program applications',
  },
  {
    id: 'walking-boarding',
    icon: '🐕',
    title: 'Walking / Sitting / Boarding',
    description: 'Service agreements, applications & waivers',
  },
]

export const SERVICES = {
  training: [
    {
      id: 'training-assessment',
      icon: '🐕',
      title: 'Dog Training Assessment',
      description: 'Behavioral evaluation & personalized training plan',
    },
    {
      id: 'training-application',
      icon: '🏆',
      title: 'Training Application Form',
      description: 'Apply for our structured training programs',
    },
  ],
  'walking-boarding': [
    {
      id: 'boarding-application',
      icon: '🏠',
      title: 'Walking / Sitting & Boarding Application',
      description: 'Application form for walking, sitting & boarding services',
    },
  ],
}

export const STEP_LABELS = ['Services', 'Owner', 'Pet', 'Details', 'Sign']

export const INITIAL_OWNER = {
  fullName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  postalCode: '',
  emergencyContact: '',
}

export const INITIAL_DOG = {
  name: '',
  breed: '',
  age: '',
  gender: '',
  weight: '',
  spayedNeutered: '',
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
  possessive: '',
  possessiveDetails: '',
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
