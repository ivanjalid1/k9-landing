import { useState, useCallback } from 'react'

export function useWizard(totalSteps: number = 5) {
  const [currentStep, setCurrentStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)

  const goTo = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [totalSteps])

  const next = useCallback(() => goTo(currentStep + 1), [currentStep, goTo])
  const prev = useCallback(() => goTo(currentStep - 1), [currentStep, goTo])

  const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100

  return {
    currentStep,
    goTo,
    next,
    prev,
    progressPercent,
    submitted,
    setSubmitted,
    totalSteps,
  }
}
