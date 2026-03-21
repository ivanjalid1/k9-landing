import { useState } from 'react'
import { Nav } from '../components/landing/Nav'
import { Footer } from '../components/landing/Footer'

const SERVICES = [
  'Dog Walking',
  'Dog Visit / Drop In',
  'Cat Visit / Drop In',
  'House Sitting',
  'Dog Training',
  'Other',
]

export function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('')
  const [refNumber, setRefNumber] = useState('')

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name.trim() || !form.email.trim() || !form.service) {
      setErrorMsg('Please fill in your name, email, and select a service.')
      return
    }

    setStatus('sending')
    setErrorMsg('')

    try {
      const apiUrl = import.meta.env.VITE_CONTACT_API_URL || '/api/contact.php'
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (data.success) {
        setRefNumber(data.ref || '')
        setStatus('sent')
      } else {
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Connection error. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div className="bg-[#FAF8F4] text-[#2A2520] min-h-screen flex flex-col">
      <Nav />

      <main className="flex-grow pt-[120px] pb-[80px] max-md:pt-[100px]">
        <div className="max-w-[1240px] mx-auto px-[clamp(20px,5vw,60px)]">
          <div className="grid grid-cols-2 gap-20 items-start max-md:grid-cols-1 max-md:gap-12">

            {/* Left — Info */}
            <div>
              <div className="text-[0.78rem] font-semibold tracking-[0.25em] uppercase text-[#2d5a42] mb-4">
                Get in Touch
              </div>
              <h1 className="font-[family-name:var(--font-landing-display)] text-[clamp(3rem,6vw,4.5rem)] tracking-[0.04em] text-[#2A2520] leading-none mb-6">
                LET'S TALK<br />ABOUT YOUR PET
              </h1>
              <p className="text-[1rem] font-light text-[#9E9785] leading-[1.8] mb-10 max-w-[400px]">
                Ready to give your furry friend the best care? Fill out the form and we'll get back to you within 24 hours.
              </p>

              {/* Contact details */}
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 flex items-center justify-center bg-[#edf6f0] border border-[#c4e2d0] text-[#2d5a42]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <div className="text-[0.82rem] font-medium text-[#2A2520]">Service Area</div>
                    <div className="text-[0.88rem] font-light text-[#9E9785]">Halton &amp; Surrounding Areas, Ontario</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 flex items-center justify-center bg-[#edf6f0] border border-[#c4e2d0] text-[#2d5a42]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <div>
                    <div className="text-[0.82rem] font-medium text-[#2A2520]">Email</div>
                    <div className="text-[0.88rem] font-light text-[#9E9785]">info@k9movement.ca</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 flex items-center justify-center bg-[#edf6f0] border border-[#c4e2d0] text-[#2d5a42]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                  <div>
                    <div className="text-[0.82rem] font-medium text-[#2A2520]">Phone</div>
                    <div className="text-[0.88rem] font-light text-[#9E9785]">(905) 555-K9MV</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Form options */}
            <div>
              {/* Two options: consult or book directly */}
              <div className="grid grid-cols-2 gap-3 mb-6 max-[480px]:grid-cols-1">
                <button
                  onClick={() => { setStatus('idle'); }}
                  className={`flex flex-col items-center gap-2 p-5 border transition-all duration-300 cursor-pointer ${
                    status !== 'booking'
                      ? 'bg-[#edf6f0] border-[#2d5a42] text-[#2A2520]'
                      : 'bg-transparent border-[#E5E0D8] text-[#9E9785] hover:border-[#2d5a42]'
                  }`}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#2d5a42]"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <span className="text-[0.82rem] font-bold tracking-[0.1em] uppercase">Ask a Question</span>
                  <span className="text-[0.72rem] text-[#9E9785] font-light">Have a question? Send us a message</span>
                </button>
                <a
                  href="#intake"
                  className="flex flex-col items-center gap-2 p-5 border border-[#E5E0D8] text-[#9E9785] hover:border-[#2d5a42] hover:text-[#2A2520] hover:bg-[#edf6f0] transition-all duration-300"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#2d5a42]"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  <span className="text-[0.82rem] font-bold tracking-[0.1em] uppercase">Book a Service</span>
                  <span className="text-[0.72rem] text-[#9E9785] font-light">Ready? Start your application now</span>
                </a>
              </div>

              {status === 'sent' ? (
                <div className="bg-white border border-[#c4e2d0] p-12 max-md:p-8 animate-[fadeUp_0.5s_ease-out]">
                  {/* Success icon */}
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#edf6f0] border border-[#c4e2d0] flex items-center justify-center">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2d5a42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <h3 className="font-[family-name:var(--font-landing-display)] text-[2rem] tracking-[0.08em] text-[#2A2520] mb-2">
                      MESSAGE SENT
                    </h3>
                    <p className="text-[0.92rem] font-light text-[#9E9785]">
                      Thank you, <span className="text-[#2A2520] font-medium">{form.name}</span>! We'll get back to you within 24 hours.
                    </p>
                  </div>

                  {/* Reference card */}
                  {refNumber && (
                    <div className="bg-[#edf6f0] border border-[#c4e2d0] p-6 mb-6">
                      <div className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#2d5a42]/60 mb-1">Reference Number</div>
                      <div className="text-[1.4rem] font-bold tracking-[0.08em] text-[#2d5a42]">{refNumber}</div>
                    </div>
                  )}

                  {/* Summary */}
                  <div className="bg-[#F5F3EF] border border-[#E5E0D8] p-5 mb-6">
                    <div className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#9E9785] mb-4">Your Inquiry</div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[0.82rem] text-[#9E9785]">Service</span>
                        <span className="text-[0.85rem] text-[#2A2520] font-medium bg-[#edf6f0] px-3 py-1 border border-[#c4e2d0]">{form.service}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[0.82rem] text-[#9E9785]">Email</span>
                        <span className="text-[0.85rem] text-[#2A2520]">{form.email}</span>
                      </div>
                      {form.phone && (
                        <div className="flex justify-between items-center">
                          <span className="text-[0.82rem] text-[#9E9785]">Phone</span>
                          <span className="text-[0.85rem] text-[#2A2520]">{form.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* What's next */}
                  <div className="mb-8">
                    <div className="text-[0.78rem] font-semibold tracking-[0.12em] uppercase text-[#5C574D] mb-4">What happens next?</div>
                    <div className="space-y-3">
                      {[
                        'Our team reviews your message',
                        'We respond with personalized info about your service',
                        'We schedule a consultation or next steps together!',
                      ].map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-[#C4891E] text-white text-[0.75rem] font-bold rounded-full">
                            {i + 1}
                          </div>
                          <span className="text-[0.88rem] text-[#5C574D]">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Confirmation email note */}
                  <div className="bg-[#edf6f0] border border-[#c4e2d0] px-5 py-4 mb-6 flex items-start gap-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2d5a42" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <p className="text-[0.82rem] text-[#5C574D] leading-relaxed">
                      A confirmation email has been sent to <span className="text-[#2A2520] font-medium">{form.email}</span>. Please check your inbox (and spam folder).
                    </p>
                  </div>

                  {/* Send another */}
                  <div className="text-center">
                    <button
                      onClick={() => { setStatus('idle'); setForm({ name: '', email: '', phone: '', service: '', message: '' }); setRefNumber(''); }}
                      className="text-[0.82rem] font-semibold tracking-[0.1em] uppercase text-[#2d5a42] hover:text-[#3d7a5a] transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white border border-[#E5E0D8] p-10 max-md:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                  <h2 className="font-[family-name:var(--font-landing-display)] text-[1.6rem] tracking-[0.1em] text-[#2A2520] mb-8">
                    SEND US A MESSAGE
                  </h2>

                  {errorMsg && (
                    <div className="mb-6 px-4 py-3 bg-[rgba(200,50,50,0.06)] border border-[rgba(200,50,50,0.2)] text-[0.85rem] text-red-600">
                      {errorMsg}
                    </div>
                  )}

                  {/* Name */}
                  <div className="mb-5">
                    <label className="block text-[0.78rem] font-medium tracking-[0.08em] uppercase text-[#5C574D] mb-2">
                      Full Name <span className="text-[#2d5a42]">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="John Smith"
                      className="w-full bg-[#F5F3EF] border border-[#E5E0D8] px-4 py-3.5 text-[0.92rem] text-[#2A2520] placeholder-[#C4C1BA] outline-none focus:border-[#2d5a42] transition-colors duration-300"
                    />
                  </div>

                  {/* Email + Phone */}
                  <div className="grid grid-cols-2 gap-4 mb-5 max-[480px]:grid-cols-1">
                    <div>
                      <label className="block text-[0.78rem] font-medium tracking-[0.08em] uppercase text-[#5C574D] mb-2">
                        Email <span className="text-[#2d5a42]">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-[#F5F3EF] border border-[#E5E0D8] px-4 py-3.5 text-[0.92rem] text-[#2A2520] placeholder-[#C4C1BA] outline-none focus:border-[#2d5a42] transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[0.78rem] font-medium tracking-[0.08em] uppercase text-[#5C574D] mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        placeholder="(416) 555-0123"
                        className="w-full bg-[#F5F3EF] border border-[#E5E0D8] px-4 py-3.5 text-[0.92rem] text-[#2A2520] placeholder-[#C4C1BA] outline-none focus:border-[#2d5a42] transition-colors duration-300"
                      />
                    </div>
                  </div>

                  {/* Service */}
                  <div className="mb-5">
                    <label className="block text-[0.78rem] font-medium tracking-[0.08em] uppercase text-[#5C574D] mb-2">
                      Service Interested In <span className="text-[#2d5a42]">*</span>
                    </label>
                    <select
                      value={form.service}
                      onChange={(e) => update('service', e.target.value)}
                      className="w-full bg-[#F5F3EF] border border-[#E5E0D8] px-4 py-3.5 text-[0.92rem] text-[#2A2520] outline-none focus:border-[#2d5a42] transition-colors duration-300 appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%232d5a42' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 16px center',
                      }}
                    >
                      <option value="" className="bg-white">Select a service</option>
                      {SERVICES.map((s) => (
                        <option key={s} value={s} className="bg-white">{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div className="mb-8">
                    <label className="block text-[0.78rem] font-medium tracking-[0.08em] uppercase text-[#5C574D] mb-2">
                      Message
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      placeholder="Tell us about your pet and what you're looking for..."
                      rows={4}
                      className="w-full bg-[#F5F3EF] border border-[#E5E0D8] px-4 py-3.5 text-[0.92rem] text-[#2A2520] placeholder-[#C4C1BA] outline-none focus:border-[#2d5a42] transition-colors duration-300 resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full inline-flex items-center justify-center gap-2.5 bg-[#2d5a42] text-white text-[0.88rem] font-bold tracking-[0.15em] uppercase py-[18px] border-2 border-[#2d5a42] hover:bg-[#3d7a5a] hover:shadow-[0_0_30px_rgba(45,90,66,0.15)] transition-all duration-400 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'sending' ? (
                      <>
                        <span className="inline-block w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
