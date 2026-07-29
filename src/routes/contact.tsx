import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { readContent } from '#/lib/content'

export const Route = createFileRoute('/contact')({
  loader: async () => readContent(),
  component: ContactUs,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tab: search.tab as string | undefined,
      position: search.position as string | undefined,
      materials: search.materials as string | undefined,
    }
  },
})

const categoryToFirstPosition: Record<string, string> = {
  'collection-logistics': 'e-waste-collection-staff',
  'sorting-processing': 'sorting-operator',
  'technical-it': 'data-destruction-specialist',
  'compliance-certification': 'ehs-officer',
  'business-operations': 'operations-manager',
  'sales-marketing': 'epr-consultant',
  'research-innovation': 'rd-specialist',
  'admin-support': 'hr-executive',
}

function ContactUs() {
  const content = Route.useLoaderData()!
  const { tab, position, materials } = Route.useSearch()
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    if (tab === 'career') setActiveTab(1)
    if (tab === 'quote') setActiveTab(2)
  }, [tab])

  const tabs = content.contact.tabs
  const { heading, generalSegment, careerSegment, quoteSegment } = content.contact

  return (
    <div className="font-sans text-text">
      <Navbar active="/contact" links={content.navbar.links} cta={content.navbar.cta} logo={content.site.logo} siteName={content.site.name} socialLinks={content.social?.links || []} />

      <main className="relative overflow-hidden">
        <div className="absolute top-40 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10 motion-preset-float motion-duration-4000" />
        <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl -z-10 motion-preset-float motion-duration-5000 motion-delay-1000" />

        <div className="pt-32 pb-24 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="mb-10 motion-preset-slide-up">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-10 h-1 bg-secondary rounded-full" />
                <span className="w-20 h-1 bg-primary/40 rounded-full" />
              </div>
              <h1 className="font-title text-5xl sm:text-6xl lg:text-7xl font-bold text-text">
                {heading.prefix}<span className="text-gradient">{heading.highlight}</span>
              </h1>
            </div>

            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-1.5 border border-primary/10 flex mb-8 motion-preset-slide-up">
              {tabs.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`flex-1 px-6 py-3 font-semibold text-sm rounded-xl transition-all duration-300 ${
                    activeTab === i
                      ? 'bg-white text-primary shadow-lg shadow-primary/10'
                      : 'text-text/50 hover:text-text/80'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="motion-preset-pop motion-duration-500">
              {activeTab === 0 && <GeneralForm segment={generalSegment} />}
              {activeTab === 1 && <CareerForm segment={careerSegment} preselectedPosition={position} />}
              {activeTab === 2 && <QuoteForm segment={quoteSegment} materialsQuery={materials} />}
            </div>
          </div>
        </div>

        {/* ====== WHATSAPP QUICK PICKUP HOOK ====== */}
        <div className="px-4 pb-24 motion-preset-slide-up">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-br from-green-50 to-green-100/50 rounded-3xl border border-green-200/50 p-8 md:p-12 text-center overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-green-500/5 rounded-full blur-3xl" />

              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-green-500/25">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>

                <h2 className="font-title text-2xl md:text-3xl font-bold text-text mb-3">
                  Quick Pickup via <span className="text-green-600">WhatsApp</span>
                </h2>
                <p className="text-text/60 max-w-lg mx-auto mb-6">
                  For individuals and households — skip the long form. Send us a message on WhatsApp with what you have, and we will arrange a pickup in minutes.
                </p>

                <a
                  href="https://wa.me/919999999999?text=Hi%20Terionix%2C%20I%20want%20to%20recycle%20some%20home%20e-waste.%20Can%20you%20help%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:brightness-110 transition-all duration-300"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Chat on WhatsApp</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>

                <p className="text-xs text-text/40 mt-4">
                  Typically replies within 5 minutes • Available during business hours
                </p>
              </div>
            </div>
          </div>
        </div>

        <Footer content={content} />
      </main>
    </div>
  )
}

const API_BASE = import.meta.env.SSR
  ? (process.env.API_URL || 'http://localhost:8001/api')
  : '/api'

function GeneralForm({ segment }: { segment: { heading: string; description: string } }) {
  const content = Route.useLoaderData()!
  const { fields, submitText } = content.contact.generalForm
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    try {
      const res = await fetch(`${API_BASE}/contact/general`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 border border-primary/10 card-hover text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-title text-xl font-bold mb-1">Thank You!</h3>
        <p className="text-text/60">Your message has been sent successfully. We'll get back to you soon.</p>
      </div>
    )
  }

  const fieldName = (label: string) => label.toLowerCase().replace(/\s+/g, '_')

  return (
    <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 border border-primary/10 card-hover">
      <h2 className="font-title text-2xl font-bold mb-2">{segment.heading}</h2>
      <p className="text-text/60 mb-8 font-light">{segment.description}</p>
      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map((field) => (
          <div key={field.label} className="group">
            <label className="block text-sm font-semibold text-text/80 mb-1.5 group-focus-within:text-primary transition-colors">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                name={fieldName(field.label)}
                rows={field.rows ?? 4}
                required={field.required}
                className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-white/60 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-text transition-all duration-300 resize-y"
              />
            ) : (
              <input
                name={fieldName(field.label)}
                type={field.type}
                required={field.required}
                className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-white/60 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-text transition-all duration-300"
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-gradient-to-r from-primary to-primary-deep text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:brightness-110 transition-all duration-300 disabled:opacity-50"
        >
          {status === 'submitting' ? 'Sending...' : submitText}
        </button>
        {status === 'error' && (
          <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
        )}
      </form>
    </div>
  )
}

function CareerForm({ segment, preselectedPosition }: { segment: { heading: string; description: string }; preselectedPosition?: string }) {
  const content = Route.useLoaderData()!
  const { fields, submitText, positions } = content.contact.careerForm
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    try {
      const res = await fetch(`${API_BASE}/contact/career`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 border border-primary/10 card-hover text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-title text-xl font-bold mb-1">Application Submitted!</h3>
        <p className="text-text/60">Thank you for your interest. We'll review your application and get back to you.</p>
      </div>
    )
  }

  const defaultPosition = preselectedPosition
    ? categoryToFirstPosition[preselectedPosition] || ''
    : ''

  const fieldName = (label: string) => label.toLowerCase().replace(/\s+/g, '_')

  return (
    <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 border border-primary/10 card-hover">
      <h2 className="font-title text-2xl font-bold mb-2">{segment.heading}</h2>
      <p className="text-text/60 mb-8 font-light">{segment.description}</p>
      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map((field) => {
          if (field.type === 'select') {
            return (
              <div key={field.label} className="group">
                <label className="block text-sm font-semibold text-text/80 mb-1.5 group-focus-within:text-primary transition-colors">{field.label}</label>
                <select
                  name={fieldName(field.label)}
                  required={field.required}
                  defaultValue={defaultPosition}
                  className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-white/60 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-text transition-all duration-300"
                >
                  <option value="">Select a position</option>
                  {positions.map((group) => (
                    <optgroup key={group.group} label={group.group}>
                      {group.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </optgroup>
                  ))}
                  <option value="other">Other</option>
                </select>
              </div>
            )
          }

          if (field.type === 'url') {
            return (
              <div key={field.label} className="group">
                <label className="block text-sm font-semibold text-text/80 mb-1.5 group-focus-within:text-primary transition-colors">{field.label}</label>
                <input
                  name={fieldName(field.label)}
                  type="url"
                  required={field.required}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-white/60 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-text transition-all duration-300"
                />
                {field.note && <p className="text-xs text-text/50 mt-1.5">{field.note}</p>}
              </div>
            )
          }

          if (field.type === 'textarea') {
            return (
              <div key={field.label} className="group">
                <label className="block text-sm font-semibold text-text/80 mb-1.5 group-focus-within:text-primary transition-colors">{field.label}</label>
                <textarea
                  name={fieldName(field.label)}
                  rows={field.rows ?? 4}
                  required={field.required}
                  className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-white/60 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-text transition-all duration-300 resize-y"
                />
              </div>
            )
          }

          return (
            <div key={field.label} className="group">
              <label className="block text-sm font-semibold text-text/80 mb-1.5 group-focus-within:text-primary transition-colors">{field.label}</label>
              <input
                name={fieldName(field.label)}
                type={field.type}
                required={field.required}
                className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-white/60 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-text transition-all duration-300"
              />
            </div>
          )
        })}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-gradient-to-r from-accent to-accent/80 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:brightness-110 transition-all duration-300 disabled:opacity-50"
        >
          {status === 'submitting' ? 'Sending...' : submitText}
        </button>
        {status === 'error' && (
          <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
        )}
      </form>
    </div>
  )
}

function QuoteForm({ segment, materialsQuery }: { segment: { heading: string; description: string }; materialsQuery?: string }) {
  const content = Route.useLoaderData()!
  const { fields, submitText, types } = content.contact.quoteForm
  const calculatorItems = content.home.impactCalculator?.items || []
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [isBusiness, setIsBusiness] = useState(false)
  const [quantities, setQuantities] = useState<Map<number, number>>(new Map())
  let urlMaterials: { name: string; quantity: number }[] = []
  let parseError = false
  if (materialsQuery) {
    try {
      urlMaterials = JSON.parse(decodeURIComponent(materialsQuery))
    } catch {
      parseError = true
    }
  }

  const getQuantity = (index: number): number => quantities.get(index) ?? 0

  const increment = (index: number) => {
    setQuantities((prev) => {
      const next = new Map(prev)
      next.set(index, (next.get(index) ?? 0) + 1)
      return next
    })
  }

  const decrement = (index: number) => {
    setQuantities((prev) => {
      const current = prev.get(index) ?? 0
      if (current <= 1) {
        const next = new Map(prev)
        next.delete(index)
        return next
      }
      const next = new Map(prev)
      next.set(index, current - 1)
      return next
    })
  }

  const manualMaterials: { name: string; quantity: number }[] = []
  quantities.forEach((qty, index) => {
    const item = calculatorItems[index]
    if (item) {
      manualMaterials.push({ name: item.name, quantity: qty })
    }
  })

  const allMaterialsMap = new Map<string, number>()
  for (const m of urlMaterials) {
    allMaterialsMap.set(m.name, (allMaterialsMap.get(m.name) ?? 0) + m.quantity)
  }
  for (const m of manualMaterials) {
    allMaterialsMap.set(m.name, (allMaterialsMap.get(m.name) ?? 0) + m.quantity)
  }
  const allMaterials = Array.from(allMaterialsMap.entries()).map(([name, quantity]) => ({ name, quantity }))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    try {
      const res = await fetch(`${API_BASE}/contact/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 border border-primary/10 card-hover text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-title text-xl font-bold mb-1">Quote Requested!</h3>
        <p className="text-text/60">Your quote request has been submitted successfully. We'll get back to you soon.</p>
      </div>
    )
  }

  const fieldName = (label: string) => label.toLowerCase().replace(/\s+/g, '_')

  return (
    <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 border border-primary/10 card-hover">
      <h2 className="font-title text-2xl font-bold mb-2">{segment.heading}</h2>
      <p className="text-text/60 mb-8 font-light">{segment.description}</p>

      <div className="mb-6">
        <div className="flex gap-2 p-1.5 bg-white/60 rounded-xl border border-primary/10">
          {types.map((t: { id: string; label: string }) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setIsBusiness(t.id === 'business')}
              className={`flex-1 px-6 py-2.5 font-semibold text-sm rounded-lg transition-all duration-300 ${
                (t.id === 'business' ? isBusiness : !isBusiness)
                  ? 'bg-white text-primary shadow-md shadow-primary/10'
                  : 'text-text/50 hover:text-text/80'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {calculatorItems.length > 0 && (
        <div className="mb-8 p-5 bg-white/50 rounded-xl border border-primary/10">
          <h3 className="font-title text-lg font-semibold mb-4 text-text">Select Materials</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {calculatorItems.map((item: { name: string; co2: number; image: string }, index: number) => {
              const qty = getQuantity(index)
              const isSelected = qty > 0
              return (
                <button
                  key={`${item.name}-${index}`}
                  type="button"
                  onClick={() => !isSelected && increment(index)}
                  className={`relative group bg-white/40 backdrop-blur-sm rounded-xl border p-3 text-center transition-all duration-300 ${
                    isSelected
                      ? 'border-primary/30 shadow-lg shadow-primary/10 bg-white/60 ring-2 ring-primary/20'
                      : 'border-primary/10 hover:border-primary/20 hover:bg-white/60 hover:shadow-md'
                  }`}
                >
                  <div className={`text-2xl mb-1.5 transition-all duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`} aria-hidden="true">
                    {item.image}
                  </div>
                  <p className="font-title text-xs sm:text-sm font-bold text-text mb-1.5 leading-tight">{item.name}</p>
                  {!isSelected ? (
                    <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                      + Add
                    </span>
                  ) : (
                    <div className="flex items-center justify-center gap-1.5">
                      <span
                        onClick={(e) => { e.stopPropagation(); decrement(index) }}
                        className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-primary/25 transition-colors select-none"
                      >
                        &minus;
                      </span>
                      <span className="text-sm font-bold text-primary min-w-[1.5ch] text-center">{qty}</span>
                      <span
                        onClick={(e) => { e.stopPropagation(); increment(index) }}
                        className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-primary/25 transition-colors select-none"
                      >
                        +
                      </span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {allMaterials.length > 0 && (
        <div className="mb-8 p-5 bg-accent/5 rounded-xl border border-accent/20">
          <h3 className="font-title text-lg font-semibold mb-3 text-accent">Requested Materials</h3>
          <div className="space-y-2">
            {allMaterials.map((item, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5 bg-white/60 rounded-lg border border-accent/10">
                <span className="font-medium text-text">{item.name}</span>
                <span className="text-sm font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                  Qty: {item.quantity}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-accent/10 flex justify-between px-4 text-sm text-text/60">
            <span>Total Items</span>
            <span className="font-semibold text-text">{allMaterials.length}</span>
          </div>
        </div>
      )}

      {parseError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          Could not parse material data. Please verify the link and try again.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input type="hidden" name="type" value={isBusiness ? 'business' : 'individual'} />
        <input type="hidden" name="materials" value={JSON.stringify(allMaterials)} />
        {fields.map((field: { label: string; type: string; required: boolean; rows?: number }) => {
          const label = isBusiness && field.label === 'Full Name' ? 'Company Name' : field.label
          if (field.type === 'textarea') {
            return (
              <div key={field.label} className="group">
                <label className="block text-sm font-semibold text-text/80 mb-1.5 group-focus-within:text-primary transition-colors">{label}</label>
                <textarea
                  name={fieldName(field.label)}
                  rows={field.rows ?? 4}
                  required={field.required}
                  className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-white/60 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-text transition-all duration-300 resize-y"
                />
              </div>
            )
          }

          return (
            <div key={field.label} className="group">
              <label className="block text-sm font-semibold text-text/80 mb-1.5 group-focus-within:text-primary transition-colors">{label}</label>
              <input
                name={fieldName(field.label)}
                type={field.type}
                required={field.required}
                className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-white/60 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-text transition-all duration-300"
              />
            </div>
          )
        })}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-gradient-to-r from-primary to-primary-deep text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:brightness-110 transition-all duration-300 disabled:opacity-50"
        >
          {status === 'submitting' ? 'Sending...' : submitText}
        </button>
        {status === 'error' && (
          <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
        )}
      </form>
    </div>
  )
}
