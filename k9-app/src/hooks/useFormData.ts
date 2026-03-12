import { useState, useCallback, useMemo, useEffect } from 'react'
import {
  INITIAL_OWNER,
  INITIAL_DOG,
  INITIAL_TRAINING_ASSESSMENT,
  INITIAL_TRAINING_APP,
  INITIAL_BOARDING_APP,
  INITIAL_WAIVER,
  INITIAL_CANCELLATION,
} from '../lib/formConfig'

const STORAGE_KEY = 'k9_form_draft'

function loadDraft(): any {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch { return null }
}

function saveDraft(data: Record<string, any>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch { /* storage full or unavailable */ }
}

function clearDraft(): void {
  try { localStorage.removeItem(STORAGE_KEY) } catch { /* noop */ }
}

export function useFormData() {
  const draft = useMemo(() => loadDraft(), [])

  const [selectedCategory, setSelectedCategory] = useState(draft?.selectedCategory || '')
  const [selectedServices, setSelectedServices] = useState(draft?.selectedServices || [])

  const handleCategorySelect = useCallback((cat: string) => {
    setSelectedCategory(cat)
    setSelectedServices([])
  }, [])

  const toggleService = useCallback((serviceId: string) => {
    setSelectedServices((prev: string[]) => {
      const next = prev.includes(serviceId)
        ? prev.filter((s: string) => s !== serviceId)
        : [...prev, serviceId]
      // Auto-add waiver-form when any service is selected (always included)
      const hasAnyService = next.some((s: string) => s !== 'waiver-form')
      if (hasAnyService && !next.includes('waiver-form')) {
        return [...next, 'waiver-form']
      }
      if (!hasAnyService) {
        return next.filter((s: string) => s !== 'waiver-form')
      }
      return next
    })
  }, [])
  const [owner, setOwner] = useState(draft?.owner || INITIAL_OWNER)
  const [dog, setDog] = useState(draft?.dog || INITIAL_DOG)
  const [additionalDogs, setAdditionalDogs] = useState(draft?.additionalDogs || [])
  const [trainingAssessment, setTrainingAssessment] = useState(draft?.trainingAssessment || INITIAL_TRAINING_ASSESSMENT)
  const [trainingApp, setTrainingApp] = useState(draft?.trainingApp || INITIAL_TRAINING_APP)
  const [boardingApp, setBoardingApp] = useState(draft?.boardingApp || INITIAL_BOARDING_APP)
  const [waiver, setWaiver] = useState(draft?.waiver || INITIAL_WAIVER)
  const [cancellation, setCancellation] = useState(draft?.cancellation || INITIAL_CANCELLATION)
  const [signatureName, setSignatureName] = useState(draft?.signatureName || '')
  const [signatureDate, setSignatureDate] = useState(draft?.signatureDate || '')
  const [signatureDataURL, setSignatureDataURL] = useState('')

  // Persist form data to localStorage (exclude signatureDataURL — too large)
  useEffect(() => {
    saveDraft({
      selectedCategory, selectedServices, owner, dog, additionalDogs,
      trainingAssessment, trainingApp, boardingApp,
      waiver, cancellation, signatureName, signatureDate,
    })
  }, [
    selectedCategory, selectedServices, owner, dog, additionalDogs,
    trainingAssessment, trainingApp, boardingApp,
    waiver, cancellation, signatureName, signatureDate,
  ])

  const updateOwner = useCallback((field: string, value: any) => {
    setOwner((prev: Record<string, any>) => ({ ...prev, [field]: value }))
  }, [])

  const updateDog = useCallback((field: string, value: any) => {
    setDog((prev: Record<string, any>) => ({ ...prev, [field]: value }))
  }, [])

  const addDog = useCallback(() => {
    setAdditionalDogs((prev: Record<string, any>[]) => prev.length < 4 ? [...prev, { ...INITIAL_DOG }] : prev)
  }, [])

  const removeDog = useCallback((index: number) => {
    setAdditionalDogs((prev: Record<string, any>[]) => prev.filter((_: any, i: number) => i !== index))
  }, [])

  const updateAdditionalDog = useCallback((index: number, field: string, value: any) => {
    setAdditionalDogs((prev: Record<string, any>[]) => prev.map((d: Record<string, any>, i: number) => i === index ? { ...d, [field]: value } : d))
  }, [])

  const updateTrainingAssessment = useCallback((field: string, value: any) => {
    setTrainingAssessment((prev: Record<string, any>) => ({ ...prev, [field]: value }))
  }, [])

  const updateTrainingApp = useCallback((field: string, value: any) => {
    setTrainingApp((prev: Record<string, any>) => ({ ...prev, [field]: value }))
  }, [])

  const updateBoardingApp = useCallback((field: string, value: any) => {
    setBoardingApp((prev: Record<string, any>) => ({ ...prev, [field]: value }))
  }, [])

  const updateWaiver = useCallback((field: string, value: any) => {
    setWaiver((prev: Record<string, any>) => ({ ...prev, [field]: value }))
  }, [])

  const updateCancellation = useCallback((field: string, value: any) => {
    setCancellation((prev: Record<string, any>) => ({ ...prev, [field]: value }))
  }, [])

  const SERVICE_DATA_MAP: Record<string, any> = useMemo(() => ({
    'training-assessment': trainingAssessment,
    'training-application': trainingApp,
    'boarding-application': boardingApp,
    'waiver-form': waiver,
  }), [trainingAssessment, trainingApp, boardingApp, waiver])

  const getAllData = useCallback(() => {
    const hasBoth = selectedServices.includes('training-assessment') && selectedServices.includes('training-application')

    const allServiceData = selectedServices.reduce((acc: Record<string, any>, svc: string) => {
      acc[svc] = { ...(SERVICE_DATA_MAP[svc] || {}) }
      return acc
    }, {})

    // When both training forms selected, copy duplicate fields from assessment to application
    if (hasBoth && allServiceData['training-application'] && allServiceData['training-assessment']) {
      const assessment = allServiceData['training-assessment']
      const app = allServiceData['training-application']
      const duplicateFields = ['goals', 'referral', 'vaccinations', 'rabiesVaccine', 'rabiesDate', 'heartworm', 'heartwormDetails', 'healthConcerns']
      for (const field of duplicateFields) {
        if (!app[field] && assessment[field]) {
          app[field] = assessment[field]
        }
      }
    }

    return {
      category: selectedCategory,
      services: selectedServices,
      owner,
      dog,
      additionalDogs: additionalDogs.length > 0 ? additionalDogs : undefined,
      allServiceData,
      signatureName,
      signatureDate,
      signatureDataURL,
    }
  }, [selectedCategory, selectedServices, owner, dog, additionalDogs, SERVICE_DATA_MAP, signatureName, signatureDate, signatureDataURL])

  const reset = useCallback(() => {
    clearDraft()
    setSelectedCategory('')
    setSelectedServices([])
    setOwner(INITIAL_OWNER)
    setDog(INITIAL_DOG)
    setAdditionalDogs([])
    setTrainingAssessment(INITIAL_TRAINING_ASSESSMENT)
    setTrainingApp(INITIAL_TRAINING_APP)
    setBoardingApp(INITIAL_BOARDING_APP)
    setWaiver(INITIAL_WAIVER)
    setCancellation(INITIAL_CANCELLATION)
    setSignatureName('')
    setSignatureDate('')
    setSignatureDataURL('')
  }, [])

  return {
    selectedCategory, handleCategorySelect,
    selectedServices, toggleService,
    owner, updateOwner,
    dog, updateDog,
    additionalDogs, addDog, removeDog, updateAdditionalDog,
    trainingAssessment, updateTrainingAssessment,
    trainingApp, updateTrainingApp,
    boardingApp, updateBoardingApp,
    waiver, updateWaiver,
    cancellation, updateCancellation,
    signatureName, setSignatureName,
    signatureDate, setSignatureDate,
    signatureDataURL, setSignatureDataURL,
    getAllData,
    reset,
  }
}
