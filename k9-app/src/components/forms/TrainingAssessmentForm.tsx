import { Input, Select, Textarea } from '../ui/Input'
import { YesNo } from '../ui/YesNo'
import { SectionDivider } from '../ui/SectionDivider'
import type { FormComponentProps } from '../../types'

export function TrainingAssessmentForm({ data, onChange, errors, onClearError }: FormComponentProps) {
  const u = (field: string) => (e: any) => { onChange(field, e.target ? e.target.value : e); onClearError?.(field) }

  return (
    <>
      <Textarea
        label="What are your training goals for your dog?"
        required
        value={data.goals}
        onChange={u('goals')}
        placeholder="Describe what you hope to achieve through training..."
        error={errors.goals}
      />

      <SectionDivider label="Dog General Information" />

      <Input
        label="Where did you get your dog from?"
        value={data.source}
        onChange={u('source')}
        placeholder="e.g., breeder, shelter, rescue..."
      />

      <Input
        label="How long have you owned this dog?"
        value={data.howLong}
        onChange={u('howLong')}
        placeholder="e.g., 2 years, 6 months..."
      />

      <Textarea
        label="Are you familiar with the necessities of your dog breed?"
        value={data.breedFamiliarity}
        onChange={u('breedFamiliarity')}
        placeholder="Describe your knowledge of your dog's breed-specific needs..."
      />

      <Input
        label="What are the reasons that you got your dog?"
        value={data.reasonsForDog}
        onChange={u('reasonsForDog')}
        placeholder="e.g., companionship, for the look, for work..."
      />

      <Input
        label="Who is the principal dog handler in your home?"
        value={data.principalHandler}
        onChange={u('principalHandler')}
        placeholder="Name of the main person who handles the dog..."
      />

      <SectionDivider label="Behaviour & Temperament" />

      <Select
        label="How does your dog react to strangers and other dogs?"
        required
        value={data.strangerReaction}
        onChange={u('strangerReaction')}
        error={errors.strangerReaction}
      >
        <option value="">Select reaction type</option>
        <option value="calm">Calm & Friendly</option>
        <option value="anxious">Anxious / Nervous</option>
        <option value="aggressive">Aggressive / Reactive</option>
        <option value="indifferent">Indifferent / Ignores them</option>
        <option value="excited">Overly Excited</option>
      </Select>

      <Textarea
        label="How would you describe your dog's overall temperament?"
        value={data.temperament}
        onChange={u('temperament')}
        placeholder="e.g., calm, energetic, anxious — please elaborate..."
      />

      <YesNo
        label="Does your dog have any fears or phobias?"
        value={data.fearsYN || 'no'}
        onChange={(val) => {
          onChange('fearsYN', val)
          if (val === 'no') onChange('fears', '')
        }}
      />
      {data.fearsYN === 'yes' && (
        <Textarea
          label="Please describe"
          value={data.fears}
          onChange={u('fears')}
          placeholder="e.g., thunderstorms, vacuum cleaners, fireworks..."
        />
      )}

      <YesNo
        label="Does your dog show any signs of aggression?"
        value={data.aggression}
        onChange={(val) => {
          onChange('aggression', val)
          if (val === 'no') onChange('aggressionDetails', '')
        }}
      />
      {data.aggression === 'yes' && (
        <Textarea
          label="If yes, please provide details"
          value={data.aggressionDetails}
          onChange={u('aggressionDetails')}
          placeholder="Describe the signs of aggression..."
        />
      )}

      <YesNo
        label="Has your dog ever bitten another dog or person?"
        value={data.bitten}
        onChange={u('bitten')}
      />
      {data.bitten === 'yes' && (
        <Textarea
          label="If yes, please provide details"
          value={data.bittenDetails}
          onChange={u('bittenDetails')}
          placeholder="Please describe the incident(s)..."
        />
      )}

      <Textarea
        label="How does your dog react to new environments or situations?"
        value={data.newEnvironments}
        onChange={u('newEnvironments')}
        placeholder="Describe how your dog behaves in unfamiliar places..."
      />

      <SectionDivider label="Training History" />

      <YesNo
        label="Has your dog received any formal training before?"
        value={data.prevTraining}
        onChange={u('prevTraining')}
      />
      {data.prevTraining === 'yes' && (
        <Textarea
          label="If yes, what type of training was it?"
          value={data.prevTrainingDetails}
          onChange={u('prevTrainingDetails')}
          placeholder="Describe the training type and duration..."
        />
      )}

      <Input
        label="What commands does your dog currently know?"
        value={data.commands}
        onChange={u('commands')}
        placeholder="e.g., sit, stay, come, down..."
      />

      <SectionDivider label="Training Goals" />

      <Textarea
        label="Are there specific behaviors you would like to address or change?"
        value={data.behaviors}
        onChange={u('behaviors')}
        placeholder="Please list the behaviors you want to change..."
      />

      <Select
        label="How often are you willing to train with your dog each week?"
        value={data.frequency}
        onChange={u('frequency')}
      >
        <option value="">Select frequency</option>
        <option value="1-2">1-2 times per week</option>
        <option value="3-4">3-4 times per week</option>
        <option value="5+">5+ times per week</option>
        <option value="daily">Daily</option>
      </Select>

      <SectionDivider label="Activity" />

      <Textarea
        label="Describe your dog's daily routine"
        value={data.routine}
        onChange={u('routine')}
        placeholder="e.g., walks, playtime, feeding schedule..."
      />

      <Textarea
        label="How often and for how long do you engage your dog in physical activities?"
        value={data.physicalActivities}
        onChange={u('physicalActivities')}
        placeholder="e.g., 30 min walk twice a day, fetch in the park..."
      />

      <Textarea
        label="How often and for how long do you engage your dog in cognitive activities?"
        value={data.cognitiveActivities}
        onChange={u('cognitiveActivities')}
        placeholder="e.g., puzzle toys, training sessions, nose work..."
      />

      <Input
        label="What are your dog's favorite physical and cognitive activities?"
        value={data.favoriteActivities}
        onChange={u('favoriteActivities')}
        placeholder="e.g., fetch, tug-of-war, puzzle feeders..."
      />

      <YesNo
        label="Does your dog interact with other animals regularly?"
        value={data.interactsAnimals}
        onChange={u('interactsAnimals')}
      />

      <YesNo
        label="Do you have a fenced yard or access to a safe outdoor area for exercise?"
        value={data.fencedYard}
        onChange={u('fencedYard')}
      />

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

      <SectionDivider label="General Health" />

      <YesNo
        label="Is your dog currently on any medication?"
        value={data.medicationYN || 'no'}
        onChange={(val) => {
          onChange('medicationYN', val)
          if (val === 'no') onChange('medication', '')
        }}
      />
      {data.medicationYN === 'yes' && (
        <Textarea
          label="Please list medications and schedules"
          value={data.medication}
          onChange={u('medication')}
          placeholder="List medications and schedules..."
        />
      )}

      <Input
        label="Any known allergies or medical conditions?"
        value={data.allergies}
        onChange={u('allergies')}
        placeholder="e.g., food allergies, hip dysplasia, or 'None'"
      />

      <Input
        label="How often do you groom your dog?"
        value={data.grooming}
        onChange={u('grooming')}
        placeholder="e.g., weekly brushing, monthly grooming..."
      />

      <Input
        label="What type of food is your dog currently eating?"
        value={data.foodType}
        onChange={u('foodType')}
        placeholder="e.g., dry kibble, raw diet, brand name..."
      />

      <YesNo
        label="Any recent changes in your dog's health or behaviour?"
        value={data.recentHealthChangesYN || 'no'}
        onChange={(val) => {
          onChange('recentHealthChangesYN', val)
          if (val === 'no') onChange('recentHealthChanges', '')
        }}
      />
      {data.recentHealthChangesYN === 'yes' && (
        <Textarea
          label="Please describe"
          value={data.recentHealthChanges}
          onChange={u('recentHealthChanges')}
          placeholder="Describe any recent changes you've noticed..."
        />
      )}

      <SectionDivider label="Vaccinations & Health" />

      <YesNo
        label="Is your dog up to date on vaccinations?"
        required
        value={data.vaccinations}
        onChange={u('vaccinations')}
        error={errors.vaccinations}
      />
      {data.vaccinations === 'yes' && (
        <Input
          label="Please provide the date of the last vaccinations"
          type="date"
          value={data.lastVaccDate}
          onChange={u('lastVaccDate')}
        />
      )}

      <YesNo
        label="Is your dog up to date on Rabies vaccine?"
        required
        value={data.rabiesVaccine}
        onChange={u('rabiesVaccine')}
        error={errors.rabiesVaccine}
      />
      {data.rabiesVaccine === 'yes' && (
        <Input
          label="Please provide the date of the last Rabies vaccination"
          required
          type="date"
          value={data.rabiesDate}
          onChange={u('rabiesDate')}
          error={errors.rabiesDate}
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

      <YesNo
        label="Are there any specific health concerns you would like to discuss with the trainer?"
        value={data.healthConcernsYN || 'no'}
        onChange={(val) => {
          onChange('healthConcernsYN', val)
          if (val === 'no') onChange('healthConcerns', '')
        }}
      />
      {data.healthConcernsYN === 'yes' && (
        <Textarea
          label="Please describe"
          value={data.healthConcerns}
          onChange={u('healthConcerns')}
          placeholder="Any health-related concerns relevant to training..."
        />
      )}

      <Input
        label="Please tell us how you heard about K9 Movement?"
        value={data.referral}
        onChange={u('referral')}
        placeholder="e.g., social media, referral, Google..."
      />

    </>
  )
}
