// ═══ K9 MOVEMENT — Shared Types ═══

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormData = Record<string, any>
export type FormErrors = Record<string, string>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormUpdater = (field: string, value: any) => void

export interface FormComponentProps {
  data: FormData
  onChange: FormUpdater
  errors: FormErrors
  onClearError?: (field: string) => void
}

export interface TrainingApplicationFormProps extends FormComponentProps {
  hideDuplicates?: boolean
}

export interface Owner {
  fullName: string
  phone: string
  email: string
  address: string
  city: string
  postalCode: string
  emergencyContact: string
}

export interface Dog {
  name: string
  breed: string
  age: string
  gender: string
  weight: string
  spayedNeutered: string
}

export interface Cancellation {
  agreeTerms: boolean
}
