import type { FormComponentProps } from '../../types'

export function CancellationPolicyForm({ data, onChange, errors, onClearError }: FormComponentProps) {
  return (
    <>
      <div className="legal-scroll bg-warm-50 border border-warm-200 rounded-xl p-6 max-h-[420px] overflow-y-auto text-[0.85rem] leading-[1.7] text-warm-600 mb-5 max-sm:max-h-[300px] max-sm:p-4">
        <h3 className="font-[var(--font-display)] text-[1.2rem] font-bold text-forest-800 mb-1">
          Cancellation Policy
        </h3>
        <p className="text-[0.78rem] text-warm-500 mb-4">K9 MOVEMENT / 171 Elmwood Rd, Oakville, ON, L6K 2A8 / 289-681-9458</p>

        <p className="mt-2"><strong>Dog Walking:</strong> <strong>We all know life happens and there is an understanding that plans can change,</strong> Cancellations with adequate notice will not be charge. However, cancellation made with less than <strong>48 hours notices</strong> will incur a full charge of the charge of the schedule walk.</p>
        <p className="mt-2">Termination of regular walking services requires <strong>two weeks notice</strong>.</p>

        <p className="mt-3"><strong>In-Home &amp; Overnight Pet Sitting Services:</strong> K9 MOVEMENT Sitter service is limited in the amount of pet sitting and overnight services that can be schedule, when this service is fully booked K9 MOVEMENT sitter services may need to turn down other request, the Clients will be required to pay in full at least <strong>7 days prior</strong> to the day the service it's schedule to begging to guarantee service, in case of no received payment K9 MOVEMENT Sitter service will not be provided.</p>
        <p className="mt-2">There will be a <strong>full refund of deposit</strong> if pet sitting/overnight visits are cancelled with <strong>1-week notice</strong>. However, if the pet sitting/overnight services are cancelled with less than 1-week notice, the deposit will be forfeited.</p>

        <p className="mt-3"><strong>Dog training:</strong> Training services are schedule days or weeks in advance, cancellations with adequate notice will not be charge. However, cancellation made with less than <strong>48 hours notices</strong> will incur a full charge.</p>

        <h4 className="text-[0.88rem] font-bold text-warm-700 mt-5 mb-2 uppercase tracking-[0.05em]">Payment and Cancellation Policies for Holiday Services:</h4>

        <p className="mt-1"><strong>Holiday Overnight Services and Pet Sitting Visits:</strong> Clients will be asked to pay in full within <strong>14 days of booking</strong> all services in order to guarantee holiday service. Holiday surcharges for pet sitting visits and overnight pet sitting will apply for all services.</p>

        <p className="mt-2">There will be a <strong>50% refund</strong> of deposit if services are cancelled with <strong>2-weeks notice</strong>.</p>
        <p className="mt-1">If cancellation occurs with less than 2-weeks notice, there is <strong>no refund</strong> of the deposit.</p>
        <p className="mt-1">For early returns, <strong>no refunds or credits</strong> will be issued.</p>

        <div className="mt-4 p-3 bg-gold-200/50 rounded-lg border border-gold-500/20">
          <p className="font-semibold text-warm-700 text-[0.82rem] mb-1">Holidays include:</p>
          <p className="text-[0.82rem]">Christmas Holiday Weekend, New Year's Eve, New Year's Day, Family Day Weekend, Easter Weekend, Victoria Day Weekend, Canada Day Weekend, Civic Holiday, Labor Day Weekend, Thanksgiving.</p>
        </div>

        <div className="mt-5 pt-4 border-t border-warm-300 text-center">
          <p className="font-semibold text-forest-800">By signing you agree to the above terms</p>
        </div>
      </div>

      <label className="flex items-center gap-2.5 mt-4 p-2.5 border-[1.5px] border-warm-200 rounded-md cursor-pointer transition-all duration-300 hover:border-forest-400 hover:bg-warm-50">
        <input
          type="checkbox"
          checked={data.agreeTerms}
          onChange={(e) => { onChange('agreeTerms', e.target.checked); onClearError?.('cancelAgree') }}
          className="w-[18px] h-[18px] accent-forest-600 cursor-pointer"
        />
        <span className="text-[0.88rem]">
          I have read, understand, and agree to the Cancellation Policy.
          <span className="text-red-500 ml-0.5">*</span>
        </span>
      </label>
      {errors.cancelAgree && (
        <p className="text-[0.78rem] text-red-500 mt-1">{errors.cancelAgree}</p>
      )}
    </>
  )
}
