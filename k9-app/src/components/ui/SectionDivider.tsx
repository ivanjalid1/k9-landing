interface SectionDividerProps {
  label: string
}

export function SectionDivider({ label }: SectionDividerProps) {
  return (
    <div className="flex items-center gap-3 my-7">
      <div className="flex-1 h-px bg-warm-200" />
      <span className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-warm-400">
        {label}
      </span>
      <div className="flex-1 h-px bg-warm-200" />
    </div>
  )
}
