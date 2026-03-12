import { STEP_LABELS } from '../../lib/formConfig'

interface ProgressBarProps {
  currentStep: number
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="bg-cream border-b border-warm-100 px-4 py-5 sticky top-0 z-50 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
      <div className="max-w-[600px] mx-auto flex items-center">
        {STEP_LABELS.map((label, i) => {
          const num = i + 1
          const isActive = num === currentStep
          const isCompleted = num < currentStep
          const isLast = i === STEP_LABELS.length - 1

          return (
            <div key={num} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-[0.8rem] font-bold transition-all duration-300
                    ${isCompleted
                      ? 'bg-gradient-to-br from-gold-500 to-gold-600 text-white shadow-[0_2px_10px_rgba(200,164,85,0.4)]'
                      : isActive
                        ? 'bg-forest-600 text-white shadow-[0_0_0_4px_rgba(26,58,42,0.1),0_2px_10px_rgba(26,58,42,0.25)]'
                        : 'bg-warm-100 text-warm-400'
                    }
                    max-sm:w-9 max-sm:h-9 max-sm:text-[0.7rem]`}
                >
                  {isCompleted ? '✓' : num}
                </div>
                <span
                  className={`text-[0.65rem] uppercase tracking-[0.08em] text-center mt-2 font-bold transition-colors duration-300
                    ${isCompleted ? 'text-gold-600' : isActive ? 'text-forest-600' : 'text-warm-300'}
                    max-sm:text-[0.55rem]`}
                >
                  {label}
                </span>
              </div>

              {!isLast && (
                <div className="flex-1 h-[2.5px] mx-4 mt-[-16px] rounded-full overflow-hidden bg-warm-100 max-sm:mx-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out
                      ${num < currentStep ? 'w-full bg-gradient-to-r from-gold-500 to-gold-400' : 'w-0'}`}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
