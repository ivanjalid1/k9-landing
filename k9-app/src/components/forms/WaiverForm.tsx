import { Input } from '../ui/Input'
import type { FormComponentProps } from '../../types'

export function WaiverForm({ data, onChange, errors, onClearError }: FormComponentProps) {
  const u = (field: string) => (e: any) => { onChange(field, e.target ? e.target.value : e); onClearError?.(field) }

  return (
    <>
      <Input
        label="Dog(s) Name(s)"
        required
        value={data.dogNames}
        onChange={u('dogNames')}
        placeholder="List all dogs covered by this waiver"
        error={errors.dogNames}
      />

      <div className="legal-scroll bg-warm-50 border border-warm-200 rounded-xl p-6 max-h-[400px] overflow-y-auto text-[0.85rem] leading-[1.7] text-warm-600 mb-5 max-sm:max-h-[280px] max-sm:p-4">
        <h3 className="font-[var(--font-display)] text-[1.2rem] font-bold text-forest-800 mb-3">
          Dog Walking / Pet Sitting / Boarding &amp; Waiver Form
        </h3>

        <p>I understand that I am solely responsible for any harm caused by my dog(s) while my dog(s) is/are attending walks, pet sitting, boarding, training or any activities with K9 MOVEMENT.</p>

        <p className="mt-2">I also understand and agree that in releasing my dog(s) in K9 MOVEMENT care, K9 MOVEMENT has relied upon my representation that my dog(s) is/are in good health and have not harmed or shown aggressive or threatening behavior towards any person or any other dog.</p>

        <p className="mt-2">I further understand that due to the way dogs interact with one another, minor cuts and scratches can occur even though the dogs are carefully supervised at all times. While my dog(s) is/are in the care and custody of K9 MOVEMENT, if I am unreachable in the event of an emergency, I hereby authorize K9 MOVEMENT, its agents, and/or representatives to seek immediate veterinary care for my dog.</p>

        <p className="mt-2">I understand that all costs in connection with veterinary, medical or other treatment shall be my responsibility.</p>

        <p className="mt-2"><strong>I hereby release and agree to save and hold harmless K9 MOVEMENT,</strong> its directors, officers, shareholders, employees, assistants, members and agents from any and all liability, claims, suits, actions, loss, injury or damage of any nature or kind, or for any liability, claims, suits, actions, loss, injury or damage which I or my dog(s) may sustain or which may be caused in any way by my dog(s). I specifically, without limitation, agree to fully indemnify K9 MOVEMENT for any and all such liability, claims, suits, actions, losses, injury or damage.</p>

        <p className="mt-2">I certify that I have read and understand the rules and regulations set forth herein and that I have read and understand this agreement. I agree to abide by the rules and regulations and accept all the terms, conditions and statements of this agreement and confirm the truthfulness of the contents of the application form completed by me.</p>

        <p className="mt-2">Although we carefully screen all applicants, occasionally we discover that this is not an appropriate service for every dog. <strong>K9 MOVEMENT reserves the right to permanently remove a dog from our services at any time.</strong></p>

        <p className="mt-2">I understand that I will provide the ways to access my home and get my dog(s). I'm fully aware that in the case of not providing keys, codes, or access controls, the Contractor will not provide the service. In no circumstances will the Contractor jump fences, backyards, enter through a window or climb to a window. The service will be cancelled with no option to refund payment.</p>

        <p className="mt-4 font-bold text-warm-700">Photo, Video and Media Release</p>
        <p className="mt-2">The Owner agrees to allow K9 Movement to use the pet's name and any images taken while in care, in any format, for use in any media, marketing, advertising, or promotional material.</p>
      </div>

      <label className="flex items-center gap-2.5 mt-4 p-2.5 border-[1.5px] border-warm-200 rounded-md cursor-pointer transition-all duration-300 hover:border-forest-400 hover:bg-warm-50">
        <input
          type="checkbox"
          checked={data.agreeTerms}
          onChange={(e) => { onChange('agreeTerms', e.target.checked); onClearError?.('agreeTerms') }}
          className="w-[18px] h-[18px] accent-forest-600 cursor-pointer"
        />
        <span className="text-[0.88rem]">
          I have read, understand, and accept all the terms of this waiver and release form, including the Photo, Video and Media Release.
          <span className="text-red-500 ml-0.5">*</span>
        </span>
      </label>
      {errors.agreeTerms && (
        <p className="text-[0.78rem] text-red-500 mt-1">{errors.agreeTerms}</p>
      )}
    </>
  )
}
