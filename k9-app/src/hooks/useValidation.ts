import { useState, useCallback } from 'react'

export function useValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const clearErrors = useCallback(() => setErrors({}), [])

  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const validateStep2 = (owner: Record<string, string>): boolean => {
    const errs: Record<string, string> = {}
    if (!owner.fullName.trim()) errs.fullName = 'Full name is required'
    if (!owner.phone.trim()) errs.phone = 'Phone is required'
    if (!owner.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(owner.email))
      errs.email = 'Valid email is required'
    if (!owner.address.trim()) errs.address = 'Address is required'
    if (!owner.emergencyContact.trim()) errs.emergencyContact = 'Emergency contact is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateStep3 = (dog: Record<string, string>): boolean => {
    const errs: Record<string, string> = {}
    if (!dog.name.trim()) errs.name = 'Pet name is required'
    if (!dog.breed.trim()) errs.breed = 'Breed is required'
    if (!dog.age.trim()) errs.age = 'Age is required'
    if (!dog.gender) errs.gender = 'Gender is required'
    if (Object.keys(errs).length > 0) {
      setErrors(prev => ({ ...prev, ...errs }))
      return false
    }
    return true
  }

  const validateStep4 = (service: string, data: Record<string, any>, skipFields: string[] = []): boolean => {
    const errs: Record<string, string> = {}
    const skip = new Set(skipFields)

    if (service === 'training-assessment') {
      if (!skip.has('goals') && !data.goals.trim()) errs.goals = 'Training goals are required'
      if (!skip.has('strangerReaction') && !data.strangerReaction) errs.strangerReaction = 'Please select a reaction type'
      if (!skip.has('vaccinations') && !data.vaccinations) errs.vaccinations = 'Please select an option'
      if (!skip.has('rabiesVaccine') && !data.rabiesVaccine) errs.rabiesVaccine = 'Please select an option'
      if (!skip.has('rabiesDate') && data.rabiesVaccine === 'yes' && !data.rabiesDate) errs.rabiesDate = 'Rabies vaccination date is required'
    }

    if (service === 'training-application') {
      if (!skip.has('goals') && !data.goals.trim()) errs.goals = 'Training goals are required'
      if (!skip.has('vetClinicName') && (!data.vetClinicName || !data.vetClinicName.trim())) errs.vetClinicName = 'Vet clinic name is required'
      if (!skip.has('vaccinations') && !data.vaccinations) errs.vaccinations = 'Please select an option'
      if (!skip.has('rabiesVaccine') && !data.rabiesVaccine) errs.rabiesVaccine = 'Please select an option'
    }

    if (service === 'boarding-application') {
      if (!data.bite) errs.bite = 'Please select an option'
      if (!data.possessive) errs.possessive = 'Please select an option'
      if (!data.sizeIssue) errs.sizeIssue = 'Please select an option'
      if (!data.vaccinations) errs.vaccinations = 'Please select an option'
      if (!data.effectiveDate) errs.effectiveDate = 'Effective date is required'
      if (!data.dogNames || !data.dogNames.trim()) errs.dogNames = 'Pet name(s) are required'
      if (!data.agreeServiceTerms) errs.agreeServiceTerms = 'You must accept the service agreement'
    }

    if (service === 'waiver-form') {
      if (!data.dogNames.trim()) errs.dogNames = 'Pet name(s) are required'
      if (!data.agreeTerms) errs.agreeTerms = 'You must accept the waiver terms'
    }

    if (Object.keys(errs).length > 0) {
      setErrors(prev => ({ ...prev, ...errs }))
      return false
    }
    return true
  }

  const validateStep5 = (name: string, hasSigned: boolean, cancellation?: { agreeTerms?: boolean }): boolean => {
    const errs: Record<string, string> = {}
    if (!cancellation?.agreeTerms) errs.cancelAgree = 'You must accept the cancellation policy'
    if (!name.trim()) errs.sigName = 'Full legal name is required'
    if (!hasSigned) errs.signature = 'Signature is required'
    if (Object.keys(errs).length > 0) {
      setErrors(prev => ({ ...prev, ...errs }))
      return false
    }
    return true
  }

  return {
    errors,
    clearErrors,
    clearError,
    validateStep2,
    validateStep3,
    validateStep4,
    validateStep5,
  }
}
