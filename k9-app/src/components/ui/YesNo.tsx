interface YesNoProps {
  label?: string
  required?: boolean
  value: string
  onChange: (val: string) => void
  error?: string
}

export function YesNo({ label, required, value, onChange, error }: YesNoProps) {
  return (
    <div className="mb-5">
      {label && (
        <label className="block text-[0.82rem] font-semibold text-warm-700 mb-1.5 tracking-wide">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={() => onChange('yes')}
          className={`flex-1 py-2.5 border-[1.5px] rounded-md font-[var(--font-body)] text-[0.9rem] font-semibold cursor-pointer transition-all duration-300 text-center
            ${value === 'yes'
              ? 'border-forest-600 bg-forest-600 text-white'
              : value === ''
                ? 'border-dashed border-warm-300 bg-white text-warm-400 opacity-60 hover:opacity-100 hover:border-forest-400 hover:border-solid'
                : 'border-warm-200 bg-white text-warm-700 hover:border-forest-400'
            }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange('no')}
          className={`flex-1 py-2.5 border-[1.5px] rounded-md font-[var(--font-body)] text-[0.9rem] font-semibold cursor-pointer transition-all duration-300 text-center
            ${value === 'no'
              ? 'border-red-500 bg-red-500 text-white'
              : value === ''
                ? 'border-dashed border-warm-300 bg-white text-warm-400 opacity-60 hover:opacity-100 hover:border-warm-400 hover:border-solid'
                : 'border-warm-200 bg-white text-warm-700 hover:border-warm-400'
            }`}
        >
          No
        </button>
      </div>
      {error && (
        <p className="text-[0.78rem] text-red-500 mt-1 flex items-center gap-1">{error}</p>
      )}
    </div>
  )
}
