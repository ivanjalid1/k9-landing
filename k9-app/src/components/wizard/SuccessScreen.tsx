import { Button } from '../ui/Button'

interface SuccessScreenProps {
  refNumber: string
  onReset: () => void
}

export function SuccessScreen({ refNumber, onReset }: SuccessScreenProps) {
  return (
    <div className="animate-success-in">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-black/[0.04]">
        <div className="py-14 px-7 text-center max-sm:py-10 max-sm:px-5">
          {/* Success icon */}
          <div className="w-22 h-22 rounded-full bg-gradient-to-br from-forest-600 to-forest-500 flex items-center justify-center mx-auto mb-6 shadow-[0_8px_32px_rgba(26,58,42,0.2)] animate-success-icon">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="font-[var(--font-display)] text-[2rem] font-bold text-forest-800 mb-3">
            Application Submitted!
          </h2>
          <p className="text-[0.95rem] text-warm-500 max-w-[400px] mx-auto leading-relaxed">
            Thank you for choosing K9 Movement. We've received your application and will review it shortly.
            A member of our team will contact you within 24-48 business hours.
          </p>

          <div className="inline-block mt-5 px-5 py-2 bg-gold-200 rounded-md text-[0.82rem] font-semibold text-forest-800 tracking-[0.05em]">
            REF: {refNumber}
          </div>

          <div className="mt-7">
            <Button variant="primary" onClick={onReset}>
              Submit Another Application
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
