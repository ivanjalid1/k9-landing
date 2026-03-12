import { Input, Select, Textarea } from '../ui/Input'
import { YesNo } from '../ui/YesNo'
import { SectionDivider } from '../ui/SectionDivider'
import type { TrainingApplicationFormProps } from '../../types'

const TASK_REACTION_OPTIONS = [
  { value: '', label: 'Select reaction' },
  { value: 'no-reaction', label: 'No Reaction' },
  { value: 'avoids', label: 'Avoids' },
  { value: 'resists', label: 'Resists' },
  { value: 'growls', label: 'Growls' },
  { value: 'snaps', label: 'Snaps' },
]

const CORRECTION_OPTIONS = [
  { value: '', label: 'Select result' },
  { value: 'have-not-tried', label: 'Have Not Tried' },
  { value: 'worsened', label: 'Worsened' },
  { value: 'no-effect', label: 'No Effect' },
  { value: 'improved', label: 'Improved' },
]

const SITUATIONAL_OPTIONS = [
  { value: '', label: 'Select response' },
  { value: 'no-response', label: 'No Response' },
  { value: 'growls', label: 'Growls' },
  { value: 'barks', label: 'Barks' },
  { value: 'snaps', label: 'Snaps' },
]

const BEHAVIOR_PROBLEM_LIST = [
  'Jumping Up',
  'Chewing',
  'Digging',
  'Barking',
  'Howling',
  'Urinating/Stool',
  'Biting Tail',
  'Chasing',
  'Aggression',
]

export function TrainingApplicationForm({ data, onChange, errors, onClearError, hideDuplicates }: TrainingApplicationFormProps) {
  const u = (field: string) => (e: any) => { onChange(field, e.target ? e.target.value : e); onClearError?.(field) }

  const toggleBehaviorProblem = (problem: string) => {
    const current = data.behaviorProblems || []
    const next = current.includes(problem)
      ? current.filter((p: string) => p !== problem)
      : [...current, problem]
    onChange('behaviorProblems', next)
  }

  return (
    <>
      {/* ─── ABOUT YOU ─── */}
      <SectionDivider label="Additional Information" />

      {!hideDuplicates && (
        <Input
          label="How did you hear about K9 Movement?"
          value={data.referral}
          onChange={u('referral')}
          placeholder="e.g., social media, referral, Google..."
        />
      )}

      <Input
        label="Number of dogs you currently have"
        value={data.numberOfDogs}
        onChange={u('numberOfDogs')}
        placeholder="e.g., 1, 2, 3..."
      />

      <YesNo
        label="Do you have any other animals at home?"
        value={data.otherAnimalsYN || 'no'}
        onChange={(val) => {
          onChange('otherAnimalsYN', val)
          if (val === 'no') onChange('otherAnimals', '')
        }}
      />
      {data.otherAnimalsYN === 'yes' && (
        <Textarea
          label="Please describe"
          value={data.otherAnimals}
          onChange={u('otherAnimals')}
          placeholder="e.g., cats, birds..."
        />
      )}

      {/* ─── BEHAVIOR & TEMPERAMENT ─── */}
      <SectionDivider label="Behaviour & Temperament" />

      <Input
        label="Where does your dog sleep at night?"
        value={data.sleepLocation}
        onChange={u('sleepLocation')}
        placeholder="e.g., crate, bed, couch..."
      />

      <YesNo
        label="Is your dog house trained?"
        value={data.houseTrained}
        onChange={u('houseTrained')}
      />

      <Input
        label="Where is the area in your home where you feed your dog?"
        value={data.feedingArea}
        onChange={u('feedingArea')}
        placeholder="e.g., kitchen, laundry room..."
      />

      {!hideDuplicates && (
        <Textarea
          label="Briefly state what you hope to accomplish in our sessions"
          required
          value={data.goals}
          onChange={u('goals')}
          placeholder="e.g., basic obedience, behavior modification, advanced commands..."
          error={errors.goals}
        />
      )}

      <YesNo
        label="Does your dog know how to walk on a leash?"
        value={data.leashWalking}
        onChange={u('leashWalking')}
      />

      {/* ─── Task Reactions (within Behavior & Temperament) ─── */}
      <p className="text-[0.8rem] text-warm-500 mb-4 mt-2 font-medium">
        How does your dog react to the following tasks?
      </p>

      {[
        ['taskTrimmingNails', 'Trimming Nails'],
        ['taskGivingPills', 'Giving Pills'],
        ['taskCleaningEars', 'Cleaning Ears'],
        ['taskGrooming', 'Grooming'],
        ['taskBathing', 'Bathing'],
        ['taskPattingHead', 'Petting'],
      ].map(([field, label]) => (
        <Select key={field} label={label} value={data[field]} onChange={u(field)}>
          {TASK_REACTION_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
      ))}

      {/* ─── When Left Alone (within Behavior & Temperament) ─── */}
      <p className="text-[0.8rem] text-warm-500 mb-4 mt-2 font-medium">
        Describe how your dog reacts when left alone:
      </p>

      <Textarea
        label="What does your dog do during the day when left alone?"
        value={data.aloneDay}
        onChange={u('aloneDay')}
        placeholder="Describe behavior when left alone during the day..."
      />

      <Textarea
        label="What does your dog do during the evening when left alone?"
        value={data.aloneEvening}
        onChange={u('aloneEvening')}
        placeholder="Describe behavior when left alone during the evening..."
      />

      <Textarea
        label="Reaction to your departure"
        value={data.reactionDeparture}
        onChange={u('reactionDeparture')}
        placeholder="How does your dog react when you leave?"
      />

      <Textarea
        label="Reaction to your homecoming"
        value={data.reactionHomecoming}
        onChange={u('reactionHomecoming')}
        placeholder="How does your dog react when you come home?"
      />

      <YesNo
        label="Do you use a crate?"
        value={data.useCrate}
        onChange={u('useCrate')}
      />

      {/* ─── TRAINING & GOALS ─── */}
      <SectionDivider label="Training & Goals" />
      <p className="text-[0.8rem] text-warm-500 mb-4 -mt-3">
        What effect have these correction techniques had?
      </p>

      {[
        ['corrTimeOut', 'Time Out'],
        ['corrLeashCorrection', 'Leash Correction'],
        ['corrVerbalScolding', 'Verbal Scolding'],
      ].map(([field, label]) => (
        <Select key={field} label={label} value={data[field]} onChange={u(field)}>
          {CORRECTION_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
      ))}

      <p className="text-[0.8rem] text-warm-500 mb-4 mt-2 font-medium">
        Check all behavior problems that apply to your dog:
      </p>

      <div className="mb-5 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {BEHAVIOR_PROBLEM_LIST.map((problem) => {
          const checked = (data.behaviorProblems || []).includes(problem)
          return (
            <label
              key={problem}
              className={`flex items-center gap-2 px-3.5 py-2.5 border-[1.5px] rounded-md cursor-pointer transition-all duration-300 text-[0.88rem] font-[var(--font-body)]
                ${checked
                  ? 'border-forest-600 bg-forest-50 text-forest-800'
                  : 'border-warm-200 bg-white text-warm-700 hover:border-warm-400'
                }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleBehaviorProblem(problem)}
                className="accent-forest-600 w-4 h-4"
              />
              {problem}
            </label>
          )
        })}
      </div>

      <YesNo
        label="Does your dog have problems with dogs smaller or larger than them?"
        value={data.sizeIssue}
        onChange={u('sizeIssue')}
      />
      {data.sizeIssue === 'yes' && (
        <Textarea
          label="Please explain"
          value={data.sizeIssueDetails}
          onChange={u('sizeIssueDetails')}
          placeholder="Describe the issue..."
        />
      )}

      {/* ─── VETERINARY INFO ─── */}
      <SectionDivider label="Veterinary Information" />

      <Input
        label="Vet name"
        value={data.vetName}
        onChange={u('vetName')}
        placeholder="Name of the veterinarian"
      />

      <Input
        label="Clinic name" required
        value={data.vetClinicName}
        onChange={u('vetClinicName')}
        placeholder="Name of the veterinary clinic"
        error={errors.vetClinicName}
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

      {/* ─── VACCINATIONS / HEALTH ─── */}
      {!hideDuplicates && (
        <>
          <SectionDivider label="Vaccinations / Health" />

          <YesNo
            label="Is your dog up to date on vaccinations?"
            required
            value={data.vaccinations}
            onChange={u('vaccinations')}
            error={errors.vaccinations}
          />

          <YesNo
            label="Is your dog up to date on Rabies vaccine?"
            required
            value={data.rabiesVaccine}
            onChange={u('rabiesVaccine')}
            error={errors.rabiesVaccine}
          />
          {data.rabiesVaccine === 'yes' && (
            <Input
              label="Rabies vaccination date"
              type="date"
              value={data.rabiesDate}
              onChange={u('rabiesDate')}
            />
          )}

          <YesNo
            label="Is your dog protected against heartworm and other parasites?"
            value={data.heartworm}
            onChange={u('heartworm')}
          />
          {data.heartworm === 'yes' && (
            <Textarea
              label="If yes, please provide details"
              value={data.heartwormDetails}
              onChange={u('heartwormDetails')}
              placeholder="Describe the heartworm/parasite prevention used..."
            />
          )}

          <Textarea
            label="Are there any specific health concerns you would like to discuss with the trainer?"
            value={data.healthConcerns}
            onChange={u('healthConcerns')}
            placeholder="Any health-related concerns relevant to training..."
          />
        </>
      )}

      {/* ─── EXHIBITED BEHAVIORS ─── */}
      <SectionDivider label="Exhibited Behaviors" />
      <p className="text-[0.8rem] text-warm-500 mb-4 -mt-3">
        If your dog exhibits any of these behaviors, describe when it occurs.
      </p>

      {[
        ['exhibitCowering', 'Cowering'],
        ['exhibitEarBack', 'Ears Back'],
        ['exhibitTailTucked', 'Tail Tucked'],
        ['exhibitRetreating', 'Retreating'],
        ['exhibitHiding', 'Hiding'],
        ['exhibitSalivating', 'Excessive Salivating'],
        ['exhibitPacing', 'Pacing'],
      ].map(([field, label]) => (
        <div key={field} className="mb-4">
          <YesNo
            label={label}
            value={data[field + 'YN'] || 'no'}
            onChange={(val) => {
              onChange(field + 'YN', val)
              if (val === 'no') onChange(field, '')
            }}
          />
          {data[field + 'YN'] === 'yes' && (
            <Textarea
              label={`Describe when ${label.toLowerCase()} occurs`}
              value={data[field]}
              onChange={u(field)}
              placeholder={`Describe when ${label.toLowerCase()} occurs...`}
            />
          )}
        </div>
      ))}

      {/* ─── FEAR / ANXIETY ─── */}
      <SectionDivider label="Fear & Anxiety" />

      <YesNo
        label="Any additional information regarding fear or anxiety"
        value={data.fearAnxietyInfoYN || 'no'}
        onChange={(val) => {
          onChange('fearAnxietyInfoYN', val)
          if (val === 'no') onChange('fearAnxietyInfo', '')
        }}
      />
      {data.fearAnxietyInfoYN === 'yes' && (
        <Textarea
          label="Please describe"
          value={data.fearAnxietyInfo}
          onChange={u('fearAnxietyInfo')}
          placeholder="Describe any fear or anxiety behaviors..."
        />
      )}

      <YesNo
        label="Any situations where dog appears fearful and/or aggressive"
        value={data.fearfulSituationsYN || 'no'}
        onChange={(val) => {
          onChange('fearfulSituationsYN', val)
          if (val === 'no') onChange('fearfulSituations', '')
        }}
      />
      {data.fearfulSituationsYN === 'yes' && (
        <Textarea
          label="Please describe"
          value={data.fearfulSituations}
          onChange={u('fearfulSituations')}
          placeholder="Describe specific situations..."
        />
      )}

      <YesNo
        label="Do you ever muzzle your dog for safety?"
        value={data.muzzleForSafety}
        onChange={u('muzzleForSafety')}
      />

      <YesNo
        label="Is anyone in the family afraid of your dog?"
        value={data.familyAfraidOfDogYN || 'no'}
        onChange={(val) => {
          onChange('familyAfraidOfDogYN', val)
          if (val === 'no') onChange('familyAfraidOfDog', '')
        }}
      />
      {data.familyAfraidOfDogYN === 'yes' && (
        <Textarea
          label="Please describe the situation"
          value={data.familyAfraidOfDog}
          onChange={u('familyAfraidOfDog')}
          placeholder="Describe the situation..."
        />
      )}

      {/* ─── SITUATIONAL REACTIONS ─── */}
      <SectionDivider label="Situational Reactions" />
      <p className="text-[0.8rem] text-warm-500 mb-4 -mt-3">
        How does your dog react in these situations?
      </p>

      {[
        ['reactEating', 'When approached while eating'],
        ['reactTreatToy', 'When approached with a treat or toy'],
        ['reactScolded', 'When dog is scolded'],
        ['reactPushedOff', 'When dog is removed from furniture or bed'],
        ['reactSleeping', 'When dog is approached while sleeping'],
        ['reactStrangersOutside', 'To strangers outside of the house'],
        ['reactPeopleEntering', 'To people entering house/yard'],
        ['reactChildren', 'To children or infants'],
        ['reactInCar', 'While in car to people outside'],
        ['reactDogsHome', 'To other dogs in your home'],
        ['reactDogsOutside', 'To other dogs outside your home'],
      ].map(([field, label]) => (
        <Select key={field} label={label} value={data[field]} onChange={u(field)}>
          {SITUATIONAL_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
      ))}

      <YesNo
        label="Has your dog ever bitten a person or dog?"
        value={data.bittenPerson}
        onChange={u('bittenPerson')}
      />

    </>
  )
}
