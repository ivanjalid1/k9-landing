import { Textarea, Input } from '../ui/Input'
import { YesNo } from '../ui/YesNo'
import { SectionDivider } from '../ui/SectionDivider'
import type { FormComponentProps } from '../../types'

export function BoardingApplicationForm({ data, onChange, errors, onClearError }: FormComponentProps) {
  const u = (field: string) => (e: any) => { onChange(field, e.target ? e.target.value : e); onClearError?.(field) }

  return (
    <>
      <YesNo
        label="Has your dog ever attempted to bite another dog or person?"
        required
        value={data.bite}
        onChange={u('bite')}
        error={errors.bite}
      />
      {data.bite === 'yes' && (
        <Textarea
          label="If yes, please explain"
          value={data.biteDetails}
          onChange={u('biteDetails')}
          placeholder="Describe the incident(s)..."
        />
      )}

      <YesNo
        label="Is your dog toy or food possessive?"
        required
        value={data.possessive}
        onChange={u('possessive')}
        error={errors.possessive}
      />
      {data.possessive === 'yes' && (
        <Textarea
          label="If yes, please explain"
          value={data.possessiveDetails}
          onChange={u('possessiveDetails')}
          placeholder="Describe the possessive behavior..."
        />
      )}

      <YesNo
        label="Has your dog ever been in a fight with another dog?"
        value={data.fight}
        onChange={u('fight')}
      />
      {data.fight === 'yes' && (
        <Textarea
          label="If yes, please explain"
          value={data.fightDetails}
          onChange={u('fightDetails')}
          placeholder="Describe what happened..."
        />
      )}

      <YesNo
        label="Does your dog have problems with dogs smaller or larger than them?"
        required
        value={data.sizeIssue}
        onChange={u('sizeIssue')}
        error={errors.sizeIssue}
      />
      {data.sizeIssue === 'yes' && (
        <Textarea
          label="Please explain"
          value={data.sizeIssueDetails}
          onChange={u('sizeIssueDetails')}
          placeholder="Describe the issue..."
        />
      )}

      <YesNo
        label="Has your dog been to dog parks?"
        value={data.parks}
        onChange={u('parks')}
      />
      {data.parks === 'yes' && (
        <Textarea
          label="How do they interact at dog parks?"
          value={data.parksDetails}
          onChange={u('parksDetails')}
          placeholder="Describe how your dog plays and interacts with other dogs..."
        />
      )}

      <SectionDivider label="Veterinary Information" />

      <Input
        label="Vet name"
        value={data.vetName}
        onChange={u('vetName')}
        placeholder="Name of the veterinarian"
      />

      <Input
        label="Clinic name"
        value={data.vetClinicName}
        onChange={u('vetClinicName')}
        placeholder="Name of the veterinary clinic"
      />

      <Input
        label="Phone"
        value={data.vetPhone}
        onChange={u('vetPhone')}
        placeholder="Clinic phone number"
      />

      <Input
        label="Address"
        value={data.vetAddress}
        onChange={u('vetAddress')}
        placeholder="Clinic address"
      />

      <SectionDivider label="Health & Medication" />

      <Textarea
        label="Any medical conditions we need to know about?"
        value={data.medical}
        onChange={u('medical')}
        placeholder="Describe any medical conditions, or write 'None'..."
      />

      <YesNo
        label="Is your dog taking any medication?"
        value={data.onMeds}
        onChange={u('onMeds')}
      />
      {data.onMeds === 'yes' && (
        <Textarea
          label="Please list medications and feeding/dosing times"
          value={data.medsDetails}
          onChange={u('medsDetails')}
          placeholder="Medication name, dosage, and schedule..."
        />
      )}

      <YesNo
        label="Is your dog up to date on all vaccinations?"
        required
        value={data.vaccinations}
        onChange={u('vaccinations')}
        error={errors.vaccinations}
      />

      <Textarea
        label="Any restricted exercises by the veterinarian?"
        value={data.restrictions}
        onChange={u('restrictions')}
        placeholder="List any exercise restrictions, or 'None'..."
      />

      <Input
        label="How did you hear about K9 Movement?"
        value={data.referral}
        onChange={u('referral')}
        placeholder="e.g., social media, referral, Google..."
      />

      {/* ─── SERVICE AGREEMENT ─── */}
      <SectionDivider label="Service Agreement" />

      <Input
        label="Effective Date"
        required
        type="date"
        value={data.effectiveDate}
        onChange={u('effectiveDate')}
        error={errors.effectiveDate}
      />

      <Input
        label="Dog(s) / Pet(s) Names"
        required
        value={data.dogNames}
        onChange={u('dogNames')}
        placeholder="List all dogs/pets covered by this agreement"
        error={errors.dogNames}
      />

      <div className="legal-scroll bg-warm-50 border border-warm-200 rounded-xl p-6 max-h-[400px] overflow-y-auto text-[0.85rem] leading-[1.7] text-warm-600 mb-5 max-sm:max-h-[280px] max-sm:p-4">
        <h3 className="font-[var(--font-display)] text-[1.2rem] font-bold text-forest-800 mb-3">
          Dog Walking / Pet Sitting Agreement / Pet Boarding
        </h3>
        <p><strong>NOTICE TO THE PET OWNER/GUARDIAN: PLEASE READ CAREFULLY.</strong></p>
        <p className="mt-2">This Walking / Boarding / Pet Sitting Agreement ("The Agreement") is entered into effective by and between <strong>K9 MOVEMENT</strong> ("Contractor") and the undersigned individual ("The Owner").</p>

        <h4 className="text-[0.88rem] font-bold text-warm-700 mt-4 mb-2 uppercase tracking-[0.05em]">Terms and Conditions</h4>
        <ul className="ml-5 list-disc space-y-1">
          <li>The Owner agrees to provide the Contractor with all necessary special instructions for the Contractor's duties.</li>
          <li>The Owner will provide any medication or special needs instructions and/or information relevant to the care and well-being for each pet.</li>
          <li>The Owner will provide suitable harnesses, collars and leashes, as well as coats or muzzles if required.</li>
          <li>The Owner understands that the Contractor may utilize playgroups where multiple dogs interact. Dogs play with their mouth and paws, which can result in nicks and scratches. While the Contractor provides reasonable care and supervision, these may not always be noticed.</li>
          <li>The Owner understands that the Contractor may take multiple dogs for pack walks for socialization. Nicks and scratches can occur during supervised walks.</li>
          <li>The Contractor will perform duties to the best of their abilities in a reliable and caring manner.</li>
          <li>The Contractor will keep secure and confidential any keys, pass codes, access numbers and personal information and will return them at the end of the contracted service date.</li>
          <li>The Contractor will be equipped with disposable waste bags.</li>
          <li>The Contractor undertakes to notify the Owner of any occurrence pertaining to the pet, which may be relevant to the care and well-being of the pet.</li>
        </ul>

        <h4 className="text-[0.88rem] font-bold text-warm-700 mt-4 mb-2 uppercase tracking-[0.05em]">Liability</h4>
        <ul className="ml-5 list-disc space-y-1">
          <li>The Owner will be considered liable for any damages or injuries caused by the Dog or Pet while under the care of the Contractor.</li>
          <li>The Contractor will not be liable for injuries to dogs or Pets caused by animals or people outside of the Contractor's control.</li>
          <li>The Contractor will not be liable for any incident that occurs during transportation of the dogs or Pet to a vet, kennel, clinic, group walks or boarding location.</li>
          <li>The Contractor accepts no liability for any breach of security, loss of or damage to the Owner's property or pet, if any other person has access to the property during the terms of this agreement.</li>
          <li>The Owner shall be liable for all medical expenses and damages resulting from an injury to the Contractor caused by the pet as well as damages to the Owner's property.</li>
          <li>The parties agree to indemnify and hold harmless each other from any claims arising from willful or negligent conduct.</li>
        </ul>

        <h4 className="text-[0.88rem] font-bold text-warm-700 mt-4 mb-2 uppercase tracking-[0.05em]">Compensation</h4>
        <ul className="ml-5 list-disc space-y-1">
          <li>The Contractor's payment shall be determined based on number of walks, days or visits booked and type/duration as discussed.</li>
          <li>Invoices for services shall be sent out weekly by email to the address provided.</li>
          <li>Payment is accepted in the form of cash, E-Transfer and/or Credit Card.</li>
          <li>All services are subject to HST.</li>
          <li>Failure to remit payment on time may result in cancellation of services.</li>
        </ul>

        <h4 className="text-[0.88rem] font-bold text-warm-700 mt-4 mb-2 uppercase tracking-[0.05em]">Cancellation or Early Termination</h4>
        <ul className="ml-5 list-disc space-y-1">
          <li>Either Party may terminate this agreement as instructed in the Cancellation Policy.</li>
          <li>The Contractor may appoint a substitute contractor with the approval of the Owner, if available.</li>
          <li>Walks may be cancelled on short notice due to inclement weather when it is not safe to travel or walk.</li>
          <li>Should any dog become aggressive or dangerous, the Contractor may terminate with immediate effect.</li>
          <li>Any wrongful or misleading information may constitute a breach and be grounds for instant termination.</li>
          <li>The Owner will provide access to the home. The Contractor will not jump fences, enter through windows, or climb structures. Service will be cancelled with no refund if access is not provided.</li>
        </ul>

        <h4 className="text-[0.88rem] font-bold text-warm-700 mt-4 mb-2 uppercase tracking-[0.05em]">Emergencies</h4>
        <p>In the event of any emergency, the Contractor shall contact the Owner. If unreachable, the Contractor is authorized to: transport the pet to the listed veterinarian; request treatment from an onsite vet; or transport to an emergency clinic.</p>

        <h4 className="text-[0.88rem] font-bold text-warm-700 mt-4 mb-2 uppercase tracking-[0.05em]">Security</h4>
        <p>The Contractor warrants to keep safe and confidential all keys, remote control entry devices, access codes and personal information and to return them at the end of the contract period or immediately upon demand.</p>

        <h4 className="text-[0.88rem] font-bold text-warm-700 mt-4 mb-2 uppercase tracking-[0.05em]">Governing Law</h4>
        <p>This Agreement shall be governed in accordance with the laws of the Province of Ontario.</p>
      </div>

      <label
        className={`flex items-start gap-3 mb-5 p-3.5 border-[1.5px] rounded-md cursor-pointer transition-all duration-300
          ${data.agreeServiceTerms
            ? 'border-forest-600 bg-forest-50'
            : 'border-warm-200 bg-white hover:border-warm-400'
          }
          ${errors.agreeServiceTerms ? 'border-red-400 bg-red-50' : ''}`}
      >
        <input
          type="checkbox"
          checked={data.agreeServiceTerms || false}
          onChange={(e) => { onChange('agreeServiceTerms', e.target.checked); onClearError?.('agreeServiceTerms') }}
          className="accent-forest-600 w-[18px] h-[18px] mt-0.5"
        />
        <span className="text-[0.85rem] text-warm-700 leading-relaxed">
          I have read, understand, and agree to all terms and conditions of this service agreement.
          <span className="text-red-500 ml-0.5">*</span>
        </span>
      </label>
      {errors.agreeServiceTerms && (
        <p className="text-[0.78rem] text-red-500 -mt-3 mb-4">{errors.agreeServiceTerms}</p>
      )}
    </>
  )
}
