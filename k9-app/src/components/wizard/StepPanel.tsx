import { ReactNode } from 'react'

interface StepPanelProps {
  stepNumber: number
  currentStep: number
  children: ReactNode
}

export function StepPanel({ stepNumber, currentStep, children }: StepPanelProps) {
  if (stepNumber !== currentStep) return null

  return (
    <div key={stepNumber} className="animate-step-in">
      {children}
    </div>
  )
}
