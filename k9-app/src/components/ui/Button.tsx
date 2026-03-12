import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'submit'
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-md font-[var(--font-body)] font-semibold border-none cursor-pointer transition-all duration-300 active:scale-[0.97] leading-none'

  const variants: Record<string, string> = {
    primary:
      'px-7 py-3 text-[0.9rem] bg-gradient-to-br from-forest-600 to-forest-500 text-white shadow-sm hover:shadow-md hover:brightness-110',
    secondary:
      'px-7 py-3 text-[0.9rem] bg-transparent text-warm-600 border-[1.5px] border-warm-200 hover:border-warm-400 hover:text-warm-800',
    ghost:
      'px-4 py-2 text-[0.82rem] bg-transparent text-warm-500 hover:text-red-500',
    submit:
      'px-9 py-3.5 text-[1rem] bg-gradient-to-br from-gold-500 to-gold-400 text-forest-800 shadow-md font-bold tracking-wide hover:shadow-lg hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale-[0.4]',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
