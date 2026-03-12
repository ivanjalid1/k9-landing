import { useState, useCallback, useMemo } from 'react'
import { useWizard } from './hooks/useWizard'
import { useFormData } from './hooks/useFormData'
import { useValidation } from './hooks/useValidation'
import { sendApplication } from './lib/emailService'
import { INITIAL_TRAINING_APP, INITIAL_BOARDING_APP, INITIAL_WAIVER, INITIAL_TRAINING_ASSESSMENT } from './lib/formConfig'

import { Header } from './components/wizard/Header'
import { ProgressBar } from './components/wizard/ProgressBar'
import { StepPanel } from './components/wizard/StepPanel'
import { FormCard } from './components/wizard/FormCard'
import { NavBar } from './components/wizard/NavBar'
import { ServiceSelection } from './components/wizard/ServiceSelection'
import { SignaturePad } from './components/wizard/SignaturePad'
import { SuccessScreen } from './components/wizard/SuccessScreen'
import { Toast } from './components/ui/Toast'
import { Input, Select } from './components/ui/Input'
import { YesNo } from './components/ui/YesNo'
import { SectionDivider } from './components/ui/SectionDivider'
import { Button } from './components/ui/Button'

import { TrainingAssessmentForm } from './components/forms/TrainingAssessmentForm'
import { TrainingApplicationForm } from './components/forms/TrainingApplicationForm'
import { BoardingApplicationForm } from './components/forms/BoardingApplicationForm'
import { WaiverForm } from './components/forms/WaiverForm'
import { CancellationPolicyForm } from './components/forms/CancellationPolicyForm'

const SERVICE_TITLES: Record<string, string> = {
  'training-assessment': 'Training Assessment',
  'training-application': 'Training Application',
  'boarding-application': 'Walking, Sitting & Boarding Application',
  'waiver-form': 'Waiver & Release Form',
}

const SERVICE_FORM_MAP: Record<string, { Component: any; dataKey: string; updateKey: string }> = {
  'training-assessment': { Component: TrainingAssessmentForm, dataKey: 'trainingAssessment', updateKey: 'updateTrainingAssessment' },
  'training-application': { Component: TrainingApplicationForm, dataKey: 'trainingApp', updateKey: 'updateTrainingApp' },
  'boarding-application': { Component: BoardingApplicationForm, dataKey: 'boardingApp', updateKey: 'updateBoardingApp' },
  'waiver-form': { Component: WaiverForm, dataKey: 'waiver', updateKey: 'updateWaiver' },
}

const REQUIRED_FIELDS: Record<string, string[]> = {
  'training-assessment': ['goals', 'strangerReaction', 'vaccinations', 'rabiesVaccine'],
  'training-application': ['goals', 'vetClinicName', 'vaccinations', 'rabiesVaccine'],
  'boarding-application': ['bite', 'possessive', 'sizeIssue', 'vaccinations', 'effectiveDate', 'dogNames', 'agreeServiceTerms'],
  'waiver-form': ['dogNames', 'agreeTerms'],
}

function scrollToFirstError() {
  setTimeout(() => {
    const el = document.querySelector('.border-red-400')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, 100)
}

function App() {
  const wizard = useWizard(5)
  const form = useFormData()
  const validation = useValidation()
  const [toast, setToast] = useState({ show: false, message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [refNumber, setRefNumber] = useState('')
  const [activeFormTab, setActiveFormTab] = useState(0)

  const showToast = useCallback((message: string) => {
    setToast({ show: true, message })
  }, [])

  const hasWalkingOrBoarding = useMemo(() =>
    form.selectedServices.includes('boarding-application'),
    [form.selectedServices]
  )

  const hasBothTraining = useMemo(() =>
    form.selectedServices.includes('training-assessment') && form.selectedServices.includes('training-application'),
    [form.selectedServices]
  )

  const isServiceComplete = useCallback((svcId: string) => {
    const mapping = SERVICE_FORM_MAP[svcId]
    if (!mapping) return false
    const data = (form as any)[mapping.dataKey]
    let required = REQUIRED_FIELDS[svcId] || []
    // Skip duplicate required fields when both training forms selected
    if (svcId === 'training-application' && hasBothTraining) {
      required = required.filter((f: string) => f !== 'goals' && f !== 'vaccinations' && f !== 'rabiesVaccine')
    }
    // If filtering removed all required fields, require that at least one
    // field in the form data has been changed from its initial value
    if (required.length === 0) {
      const INITIALS: Record<string, any> = {
        'training-assessment': INITIAL_TRAINING_ASSESSMENT,
        'training-application': INITIAL_TRAINING_APP,
        'boarding-application': INITIAL_BOARDING_APP,
        'waiver-form': INITIAL_WAIVER,
      }
      const initial = INITIALS[svcId] || {}
      return Object.keys(data).some((key: string) => {
        const val = data[key]
        const init = initial[key]
        if (Array.isArray(val)) return val.length !== (Array.isArray(init) ? init.length : 0)
        return val !== init
      })
    }
    return required.every(field => {
      const val = data[field]
      if (typeof val === 'boolean') return val === true
      if (Array.isArray(val)) return val.length > 0
      return val && String(val).trim() !== ''
    })
  }, [form, hasBothTraining])

  const handleNext = useCallback(() => {
    validation.clearErrors()

    if (wizard.currentStep === 1) {
      if (!form.selectedCategory) {
        showToast('Please select a category to continue')
        return
      }
      if (form.selectedServices.length === 0) {
        showToast('Please select at least one service')
        return
      }
    }

    if (wizard.currentStep === 2) {
      if (!validation.validateStep2(form.owner)) {
        showToast('Please fill in all required fields')
        scrollToFirstError()
        return
      }
    }

    if (wizard.currentStep === 3) {
      if (!validation.validateStep3(form.dog)) {
        showToast('Please fill in all required pet fields')
        scrollToFirstError()
        return
      }
      // Auto-fill dogNames for waiver & boarding application
      const allDogNames = [form.dog.name, ...form.additionalDogs.map((d: any) => d.name)].filter(Boolean).join(', ')
      if (allDogNames) {
        if (form.selectedServices.includes('waiver-form') && !form.waiver.dogNames) {
          form.updateWaiver('dogNames', allDogNames)
        }
        if (form.selectedServices.includes('boarding-application') && !form.boardingApp.dogNames) {
          form.updateBoardingApp('dogNames', allDogNames)
        }
      }
      // Auto-fill effective date for boarding application
      if (form.selectedServices.includes('boarding-application') && !form.boardingApp.effectiveDate) {
        form.updateBoardingApp('effectiveDate', new Date().toISOString().split('T')[0])
      }
    }

    if (wizard.currentStep === 4) {
      for (const svc of form.selectedServices) {
        const mapping = SERVICE_FORM_MAP[svc]
        if (mapping) {
          const data = (form as any)[mapping.dataKey]
          // When both training forms selected, skip duplicate required fields in application
          const skipFields = (svc === 'training-application' && hasBothTraining)
            ? ['goals', 'vaccinations', 'rabiesVaccine']
            : []
          if (!validation.validateStep4(svc, data, skipFields)) {
            showToast(`Please complete all required fields in ${SERVICE_TITLES[svc]}`)
            scrollToFirstError()
            return
          }
        }
      }
      // Auto-fill signature
      if (!form.signatureDate) {
        form.setSignatureDate(new Date().toISOString().split('T')[0])
      }
      if (!form.signatureName && form.owner.fullName) {
        form.setSignatureName(form.owner.fullName)
      }
    }

    wizard.next()
  }, [wizard, form, validation, showToast])

  const handleSubmit = useCallback(async () => {
    validation.clearErrors()

    // Validate signature
    if (!validation.validateStep5(form.signatureName, !!form.signatureDataURL, form.cancellation)) {
      showToast('Please accept the cancellation policy and complete the signature')
      scrollToFirstError()
      return
    }

    setSubmitting(true)

    try {
      const result = await sendApplication(form.getAllData())

      if (result.success) {
        setRefNumber(result.ref || '')
        wizard.setSubmitted(true)
        if (result.demo) {
          console.log('Demo mode — configure PHP backend to send real emails')
        }
      } else {
        showToast('There was an error sending. Please try again.')
      }
    } catch {
      showToast('Connection error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }, [form, validation, wizard, showToast])

  const handleReset = useCallback(() => {
    form.reset()
    validation.clearErrors()
    wizard.setSubmitted(false)
    wizard.goTo(1)
    setActiveFormTab(0)
  }, [form, validation, wizard])

  // ─── RENDER ───
  if (wizard.submitted) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="max-w-[680px] mx-auto px-4 py-6 max-sm:px-2.5">
          <SuccessScreen refNumber={refNumber} onReset={handleReset} />
        </main>
        <Toast message={toast.message} show={toast.show} onClose={() => setToast({ show: false, message: '' })} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Background texture */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: 'radial-gradient(ellipse at 20% 0%, rgba(26,58,42,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(200,164,85,0.05) 0%, transparent 50%), radial-gradient(circle at 50% 40%, rgba(26,58,42,0.02) 0%, transparent 70%)',
      }} />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23000'/%3E%3C/svg%3E")`,
      }} />

      <Header />
      <ProgressBar currentStep={wizard.currentStep} />

      <main className="max-w-[680px] mx-auto px-4 pt-6 pb-24 relative z-[1] max-sm:px-2.5">

        {/* ═══ STEP 1: CATEGORY + SERVICES ═══ */}
        <StepPanel stepNumber={1} currentStep={wizard.currentStep}>
          <FormCard
            title="Select Your Services"
            description="Choose a category, then select the forms you need to complete."
          >
            <ServiceSelection
              category={form.selectedCategory}
              onCategorySelect={form.handleCategorySelect}
              selectedServices={form.selectedServices}
              onToggleService={form.toggleService}
            />

            {form.selectedServices.length > 0 && (
              <NavBar showPrev={false} onNext={handleNext} />
            )}
          </FormCard>
        </StepPanel>

        {/* ═══ STEP 2: OWNER INFO ═══ */}
        <StepPanel stepNumber={2} currentStep={wizard.currentStep}>
          <FormCard
            title="Owner Information"
            description="Please provide your contact details so we can stay in touch regarding your pet's care."
          >
            {/* ─── Contact Info ─── */}
            <div className="rounded-xl bg-forest-50/50 border border-forest-100/60 p-5 mb-6 max-sm:p-4 max-sm:mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 rounded-full bg-forest-600 flex items-center justify-center text-white text-[0.7rem]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <span className="text-[0.78rem] font-bold uppercase tracking-[0.08em] text-forest-700">Contact Details</span>
              </div>
              <Input
                label="Full Name" required
                value={form.owner.fullName}
                onChange={(e) => { form.updateOwner('fullName', e.target.value); validation.clearError('fullName') }}
                placeholder="John Smith"
                autoComplete="name"
                error={validation.errors.fullName}
              />
              <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 max-sm:gap-0">
                <Input
                  label="Phone" required
                  type="tel"
                  value={form.owner.phone}
                  onChange={(e) => { form.updateOwner('phone', e.target.value); validation.clearError('phone') }}
                  placeholder="(416) 555-0123"
                  autoComplete="tel"
                  error={validation.errors.phone}
                />
                <Input
                  label="Email" required
                  type="email"
                  value={form.owner.email}
                  onChange={(e) => { form.updateOwner('email', e.target.value); validation.clearError('email') }}
                  placeholder="john@example.com"
                  autoComplete="email"
                  error={validation.errors.email}
                />
              </div>
            </div>

            {/* ─── Address ─── */}
            <div className="rounded-xl bg-gold-50/60 border border-gold-200/50 p-5 mb-6 max-sm:p-4 max-sm:mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 rounded-full bg-gold-500 flex items-center justify-center text-forest-800 text-[0.7rem]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </span>
                <span className="text-[0.78rem] font-bold uppercase tracking-[0.08em] text-gold-700">Address</span>
              </div>
              <Input
                label="Street Address" required
                value={form.owner.address}
                onChange={(e) => { form.updateOwner('address', e.target.value); validation.clearError('address') }}
                placeholder="123 Main Street"
                autoComplete="street-address"
                error={validation.errors.address}
              />
              <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 max-sm:gap-0">
                <Input
                  label="City"
                  value={form.owner.city}
                  onChange={(e) => form.updateOwner('city', e.target.value)}
                  placeholder="Toronto"
                  autoComplete="address-level2"
                />
                <Input
                  label="Postal Code"
                  value={form.owner.postalCode}
                  onChange={(e) => form.updateOwner('postalCode', e.target.value)}
                  placeholder="M5V 2T6"
                  autoComplete="postal-code"
                />
              </div>
            </div>

            {/* ─── Emergency Contact ─── */}
            <div className="rounded-xl bg-red-50/40 border border-red-200/40 p-5 mb-2 max-sm:p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white text-[0.7rem]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </span>
                <span className="text-[0.78rem] font-bold uppercase tracking-[0.08em] text-red-600/80">Emergency Contact</span>
              </div>
              <Input
                label="Emergency Contact" required
                value={form.owner.emergencyContact}
                onChange={(e) => { form.updateOwner('emergencyContact', e.target.value); validation.clearError('emergencyContact') }}
                placeholder="Name and phone number"
                error={validation.errors.emergencyContact}
                className="!mb-0"
              />
            </div>

            <NavBar onPrev={wizard.prev} onNext={handleNext} />
          </FormCard>
        </StepPanel>

        {/* ═══ STEP 3: PET PROFILE ═══ */}
        <StepPanel stepNumber={3} currentStep={wizard.currentStep}>
          <FormCard
            title="Pet Profile"
            description="Tell us about your furry companion so we can provide the best possible care."
          >
            <p className="text-[0.85rem] text-warm-600 mb-5 italic">
              The Owner declares they are the owner of the following pet(s):
            </p>
            <SectionDivider label="Pet #1 (Primary)" />
            <Input
              label="Pet's Name" required
              value={form.dog.name}
              onChange={(e) => { form.updateDog('name', e.target.value); validation.clearError('name') }}
              placeholder="Buddy"
              error={validation.errors.name}
            />
            <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 max-sm:gap-0">
              <Input
                label="Breed" required
                value={form.dog.breed}
                onChange={(e) => { form.updateDog('breed', e.target.value); validation.clearError('breed') }}
                placeholder="Golden Retriever"
                error={validation.errors.breed}
              />
              <Input
                label="Age" required
                value={form.dog.age}
                onChange={(e) => { form.updateDog('age', e.target.value); validation.clearError('age') }}
                placeholder="3 years"
                error={validation.errors.age}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 max-sm:gap-0">
              <Select
                label="Gender" required
                value={form.dog.gender}
                onChange={(e) => { form.updateDog('gender', e.target.value); validation.clearError('gender') }}
                error={validation.errors.gender}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Select>
              <Input
                label="Weight"
                value={form.dog.weight}
                onChange={(e) => form.updateDog('weight', e.target.value)}
                placeholder="e.g., 65 lbs"
              />
            </div>
            <YesNo
              label="Spayed / Neutered?"
              value={form.dog.spayedNeutered}
              onChange={(val) => form.updateDog('spayedNeutered', val)}
            />

            {/* ─── ADDITIONAL PETS (only for boarding & walking/sitting) ─── */}
            {hasWalkingOrBoarding && (
              <>
                {form.additionalDogs.map((aDog: any, i: number) => (
                  <div key={i}>
                    <SectionDivider label={`Pet #${i + 2}`} />
                    <div className="flex justify-end -mt-2 mb-3">
                      <button
                        type="button"
                        onClick={() => form.removeDog(i)}
                        className="text-[0.78rem] text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                    <Input
                      label="Pet's Name" required
                      value={aDog.name}
                      onChange={(e) => form.updateAdditionalDog(i, 'name', e.target.value)}
                      placeholder="Buddy"
                    />
                    <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 max-sm:gap-0">
                      <Input
                        label="Breed" required
                        value={aDog.breed}
                        onChange={(e) => form.updateAdditionalDog(i, 'breed', e.target.value)}
                        placeholder="Golden Retriever"
                      />
                      <Input
                        label="Age" required
                        value={aDog.age}
                        onChange={(e) => form.updateAdditionalDog(i, 'age', e.target.value)}
                        placeholder="3 years"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 max-sm:gap-0">
                      <Select
                        label="Gender" required
                        value={aDog.gender}
                        onChange={(e) => form.updateAdditionalDog(i, 'gender', e.target.value)}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </Select>
                      <Input
                        label="Weight"
                        value={aDog.weight}
                        onChange={(e) => form.updateAdditionalDog(i, 'weight', e.target.value)}
                        placeholder="e.g., 65 lbs"
                      />
                    </div>
                    <YesNo
                      label="Spayed / Neutered?"
                      value={aDog.spayedNeutered}
                      onChange={(val) => form.updateAdditionalDog(i, 'spayedNeutered', val)}
                    />
                  </div>
                ))}

                {form.additionalDogs.length < 4 && (
                  <button
                    type="button"
                    onClick={form.addDog}
                    className="w-full mt-2 mb-4 py-3 px-4 border-2 border-dashed border-forest-300 rounded-xl text-forest-600 text-[0.88rem] font-semibold hover:bg-forest-50 hover:border-forest-500 transition-all duration-300 cursor-pointer"
                  >
                    + Add Another Pet
                  </button>
                )}
              </>
            )}

            <NavBar onPrev={wizard.prev} onNext={handleNext} />
          </FormCard>
        </StepPanel>

        {/* ═══ STEP 4: ALL SERVICE FORMS (TABS) ═══ */}
        <StepPanel stepNumber={4} currentStep={wizard.currentStep}>
          {(() => {
            const sortedServices = [...form.selectedServices].sort((a, b) => {
              if (a === 'waiver-form') return 1
              if (b === 'waiver-form') return -1
              return 0
            })
            const currentTab = Math.min(activeFormTab, sortedServices.length - 1)
            const currentSvcId = sortedServices[currentTab]
            const mapping = currentSvcId ? SERVICE_FORM_MAP[currentSvcId] : null

            return (
              <>
                {/* Tab bar */}
                {sortedServices.length > 1 && (
                  <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1">
                    {sortedServices.map((svcId, i) => (
                      <button
                        key={svcId}
                        type="button"
                        onClick={() => { setActiveFormTab(i); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                        className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-[0.82rem] font-semibold transition-all duration-300 cursor-pointer border-[1.5px]
                          ${i === currentTab
                            ? 'bg-forest-600 text-white border-forest-600 shadow-md'
                            : 'bg-white text-warm-600 border-warm-200 hover:border-forest-400 hover:text-forest-700'
                          }`}
                      >
                        <span className="mr-1.5 text-[0.75rem] opacity-70">{i + 1}/{sortedServices.length}</span>
                        {SERVICE_TITLES[svcId]}
                        {isServiceComplete(svcId) && <span className="ml-1.5 text-[0.75rem]">&#10003;</span>}
                      </button>
                    ))}
                  </div>
                )}

                {/* Active form */}
                {mapping && (
                  <FormCard
                    key={currentSvcId}
                    title={SERVICE_TITLES[currentSvcId]}
                  >
                    <mapping.Component
                      data={(form as any)[mapping.dataKey]}
                      onChange={(form as any)[mapping.updateKey]}
                      errors={validation.errors}
                      onClearError={validation.clearError}
                      {...(currentSvcId === 'training-application' && hasBothTraining ? { hideDuplicates: true } : {})}
                    />
                  </FormCard>
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center pt-6 mt-2">
                  <Button variant="secondary" onClick={() => {
                    if (currentTab > 0) {
                      setActiveFormTab(currentTab - 1)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    } else {
                      wizard.prev()
                    }
                  }}>
                    <span className="mr-1">&#8592;</span> Back
                  </Button>
                  <Button variant="primary" onClick={() => {
                    if (currentTab < sortedServices.length - 1) {
                      // Validate current form before moving to next tab
                      const svc = sortedServices[currentTab]
                      const m = SERVICE_FORM_MAP[svc]
                      if (m) {
                        validation.clearErrors()
                        const d = (form as any)[m.dataKey]
                        const skipFields = (svc === 'training-application' && hasBothTraining)
                          ? ['goals', 'vaccinations', 'rabiesVaccine']
                          : []
                        if (!validation.validateStep4(svc, d, skipFields)) {
                          showToast(`Please complete all required fields in ${SERVICE_TITLES[svc]}`)
                          scrollToFirstError()
                          return
                        }
                      }
                      setActiveFormTab(currentTab + 1)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    } else {
                      handleNext()
                    }
                  }}>
                    {currentTab < sortedServices.length - 1 ? 'Next Form' : 'Next'} <span className="ml-1">&#8594;</span>
                  </Button>
                </div>
              </>
            )
          })()}
        </StepPanel>

        {/* ═══ STEP 5: CANCELLATION POLICY + SIGNATURE ═══ */}
        <StepPanel stepNumber={5} currentStep={wizard.currentStep}>
          <FormCard
            title="Review & Sign"
            description="Please review our cancellation policy, then sign below to confirm and submit your application."
          >
            <CancellationPolicyForm
              data={form.cancellation}
              onChange={form.updateCancellation}
              errors={validation.errors}
              onClearError={validation.clearError}
            />

            <SectionDivider label="Digital Signature" />

            <p className="text-[0.82rem] text-warm-500 mb-4">
              Use your finger on mobile or mouse on desktop to draw your signature.
            </p>

            <Input
              label="Full Legal Name" required
              value={form.signatureName}
              onChange={(e) => { form.setSignatureName(e.target.value); validation.clearError('sigName') }}
              placeholder="As it appears on your ID"
              error={validation.errors.sigName}
            />
            <Input
              label="Date"
              type="date"
              value={form.signatureDate}
              onChange={(e) => form.setSignatureDate(e.target.value)}
            />

            <SignaturePad onSignatureChange={form.setSignatureDataURL} />
            {validation.errors.signature && (
              <p className="text-[0.78rem] text-red-500 -mt-3 mb-4">{validation.errors.signature}</p>
            )}

            <div className="flex flex-col gap-3 items-stretch pt-6 mt-2 border-t border-warm-100">
              <Button
                variant="submit"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="inline-block w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
              <Button variant="secondary" onClick={wizard.prev} className="self-start">
                <span className="mr-1">&#8592;</span> Back
              </Button>
            </div>
          </FormCard>
        </StepPanel>

      </main>

      <Toast
        message={toast.message}
        show={toast.show}
        onClose={() => setToast({ show: false, message: '' })}
      />
    </div>
  )
}

export default App
export { App as IntakeApp }
