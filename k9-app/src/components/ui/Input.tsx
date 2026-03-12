import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  required?: boolean
  error?: string
}

export function Input({ label, required, error, className = '', ...props }: InputProps) {
  return (
    <div className={`mb-5 ${className}`}>
      {label && (
        <label className="block text-[0.82rem] font-semibold text-warm-700 mb-1.5 tracking-wide">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        className={`w-full px-3.5 py-3 border-[1.5px] rounded-md font-[var(--font-body)] text-[0.95rem] text-warm-800 bg-white outline-none transition-all duration-300
          ${error
            ? 'border-red-400 bg-red-50'
            : 'border-warm-200 focus:border-forest-600 focus:shadow-[0_0_0_3px_rgba(26,58,42,0.1)]'
          }`}
        {...props}
      />
      {error && (
        <p className="text-[0.78rem] text-red-500 mt-1 flex items-center gap-1">{error}</p>
      )}
    </div>
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  required?: boolean
  error?: string
}

export function Select({ label, required, error, children, className = '', ...props }: SelectProps) {
  return (
    <div className={`mb-5 ${className}`}>
      {label && (
        <label className="block text-[0.82rem] font-semibold text-warm-700 mb-1.5 tracking-wide">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <select
        className={`w-full px-3.5 py-3 border-[1.5px] rounded-md font-[var(--font-body)] text-[0.95rem] text-warm-800 bg-white outline-none transition-all duration-300 appearance-none bg-no-repeat cursor-pointer pr-9
          ${error
            ? 'border-red-400 bg-red-50'
            : 'border-warm-200 focus:border-forest-600 focus:shadow-[0_0_0_3px_rgba(26,58,42,0.1)]'
          }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239e9a90' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 14px center',
        }}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-[0.78rem] text-red-500 mt-1 flex items-center gap-1">{error}</p>
      )}
    </div>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  required?: boolean
  error?: string
}

export function Textarea({ label, required, error, className = '', ...props }: TextareaProps) {
  return (
    <div className={`mb-5 ${className}`}>
      {label && (
        <label className="block text-[0.82rem] font-semibold text-warm-700 mb-1.5 tracking-wide">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        className={`w-full px-3.5 py-3 border-[1.5px] rounded-md font-[var(--font-body)] text-[0.95rem] text-warm-800 bg-white outline-none transition-all duration-300 resize-y min-h-[90px]
          ${error
            ? 'border-red-400 bg-red-50'
            : 'border-warm-200 focus:border-forest-600 focus:shadow-[0_0_0_3px_rgba(26,58,42,0.1)]'
          }`}
        {...props}
      />
      {error && (
        <p className="text-[0.78rem] text-red-500 mt-1 flex items-center gap-1">{error}</p>
      )}
    </div>
  )
}
