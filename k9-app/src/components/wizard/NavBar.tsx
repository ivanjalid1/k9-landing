import { Button } from '../ui/Button'

interface NavBarProps {
  onPrev?: () => void
  onNext?: () => void
  showPrev?: boolean
  showNext?: boolean
  nextLabel?: string
}

export function NavBar({ onPrev, onNext, showPrev = true, showNext = true, nextLabel = 'Next' }: NavBarProps) {
  return (
    <div className="flex justify-between items-center pt-6 mt-2 border-t border-warm-100">
      {showPrev ? (
        <Button variant="secondary" onClick={onPrev}>
          <span className="mr-1">&#8592;</span> Back
        </Button>
      ) : <div />}
      {showNext && (
        <Button variant="primary" onClick={onNext}>
          {nextLabel} <span className="ml-1">&#8594;</span>
        </Button>
      )}
    </div>
  )
}
