import { ReactNode } from 'react'

interface FormCardProps {
  title: string
  description?: string
  children: ReactNode
}

export function FormCard({ title, description, children }: FormCardProps) {
  return (
    <div className="relative">
      {/* Subtle outer glow/shadow */}
      <div className="absolute -inset-3 bg-gradient-to-b from-forest-600/[0.03] via-transparent to-gold-500/[0.03] rounded-3xl blur-xl pointer-events-none" />

      <div className="relative bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] overflow-hidden border border-black/[0.04]">
        {/* Top accent bar */}
        <div className="h-[3px] bg-gradient-to-r from-forest-600 via-forest-400 to-gold-500" />

        <div className="px-7 pt-6 pb-5 border-b border-warm-100/80 bg-gradient-to-b from-forest-50/40 to-transparent max-sm:px-5 max-sm:pt-5 max-sm:pb-4">
          <h2 className="font-[var(--font-display)] text-[1.6rem] font-bold text-forest-800 leading-tight">
            {title}
          </h2>
          {description && (
            <p className="text-[0.88rem] text-warm-500 mt-1.5 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        <div className="px-7 pt-6 pb-7 max-sm:px-5 max-sm:pt-5 max-sm:pb-6">
          {children}
        </div>
      </div>
    </div>
  )
}
