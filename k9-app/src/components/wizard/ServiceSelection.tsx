import { CATEGORIES, SERVICES } from '../../lib/formConfig'

interface ServiceSelectionProps {
  category: string
  onCategorySelect: (cat: string) => void
  selectedServices: string[]
  onToggleService: (serviceId: string) => void
}

export function ServiceSelection({ category, onCategorySelect, selectedServices, onToggleService }: ServiceSelectionProps) {
  return (
    <div className="grid gap-4">
      {/* ─── CATEGORY SELECTION ─── */}
      <div className="grid gap-3">
        {CATEGORIES.map((cat) => {
          const isSelected = category === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategorySelect(cat.id)}
              className={`relative flex items-center gap-3.5 px-5 py-[18px] border-2 rounded-xl cursor-pointer transition-all duration-300 text-left overflow-hidden group
                ${isSelected
                  ? 'border-forest-600 bg-gradient-to-br from-forest-600/[0.03] to-gold-500/[0.04] selected'
                  : 'border-warm-200 hover:border-forest-400 hover:shadow-sm hover:translate-x-0.5'
                }`}
            >
              <div className="selection-card-accent" />
              <div
                className={`w-11 h-11 rounded-md flex items-center justify-center text-[1.3rem] shrink-0 transition-all duration-300
                  ${isSelected ? 'bg-forest-600 shadow-sm' : 'bg-warm-50'}`}
              >
                <span>{cat.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[0.95rem] font-semibold text-warm-800 leading-snug">{cat.title}</h3>
                <p className="text-[0.8rem] text-warm-500 mt-0.5">{cat.description}</p>
              </div>
              <div
                className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0
                  ${isSelected
                    ? 'border-gold-500 bg-gold-500 text-forest-800'
                    : 'border-warm-200'
                  }`}
              >
                {isSelected && <span className="text-[0.7rem] font-bold">✓</span>}
              </div>
            </button>
          )
        })}
      </div>

      {/* ─── SERVICE SELECTION (within category) ─── */}
      {category && (
        <div className="mt-2">
          <p className="text-[0.82rem] text-warm-500 mb-3 font-medium">
            Select the forms you need to complete:
          </p>
          <div className="grid gap-2.5">
            {SERVICES[category as keyof typeof SERVICES].map((svc) => {
              const isChecked = selectedServices.includes(svc.id)
              return (
                <label
                  key={svc.id}
                  className={`relative flex items-center gap-3.5 px-5 py-[14px] border-[1.5px] rounded-xl cursor-pointer transition-all duration-300 text-left
                    ${isChecked
                      ? 'border-forest-600 bg-forest-50/60'
                      : 'border-warm-200 hover:border-warm-400 hover:bg-warm-50/50'
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleService(svc.id)}
                    className="accent-forest-600 w-[18px] h-[18px] cursor-pointer shrink-0"
                  />
                  <div
                    className={`w-9 h-9 rounded-md flex items-center justify-center text-[1.1rem] shrink-0 transition-all duration-300
                      ${isChecked ? 'bg-forest-600 shadow-sm' : 'bg-warm-50'}`}
                  >
                    <span>{svc.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[0.88rem] font-semibold text-warm-800 leading-snug">{svc.title}</h3>
                    <p className="text-[0.75rem] text-warm-500 mt-0.5">{svc.description}</p>
                  </div>
                </label>
              )
            })}
          </div>

          {selectedServices.length > 0 && (
            <div className="mt-3 flex items-center gap-2.5 px-4 py-3 bg-forest-50/60 border border-forest-100 rounded-xl text-[0.82rem] text-forest-700">
              <span className="text-[1.1rem]">🛡️</span>
              <span><strong>Waiver & Release Form</strong> — automatically included with your selection.</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
