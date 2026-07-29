import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

export interface CalculatorItem {
  name: string
  co2: number
  image: string
}

interface ImpactCalculatorProps {
  title?: string
  description?: string
  items: CalculatorItem[]
}

function formatValue(value: number): string {
  if (value >= 1000) return (value / 1000).toFixed(1)
  if (value >= 1) return value.toFixed(1)
  if (value >= 0.01) return value.toFixed(2)
  if (value > 0) return value.toFixed(3)
  return '0'
}

function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toLocaleString()
}

export function ImpactCalculator({
  title = 'E-Waste Impact Calculator',
  description = 'Select the devices you\'ve recycled and see the environmental impact of your contribution.',
  items = [],
}: ImpactCalculatorProps) {
  const navigate = useNavigate()
  const [quantities, setQuantities] = useState<Map<number, number>>(new Map())

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

  const clearAll = () => setQuantities(new Map())

  const hasSelection = quantities.size > 0

  let totalCO2 = 0
  const selectedEntries: { name: string; quantity: number }[] = []
  quantities.forEach((qty, index) => {
    const item = items[index]
    if (item) {
      totalCO2 += item.co2 * qty
      selectedEntries.push({ name: item.name, quantity: qty })
    }
  })

  const totalDevices = Array.from(quantities.values()).reduce((sum, q) => sum + q, 0)

  const trees = Math.round(totalCO2 / 20)
  const carMiles = Math.round(totalCO2 / 0.4)
  const homesEnergy = Math.round(totalCO2 / 15)

  const handleRequestQuote = () => {
    const entries = selectedEntries.map((e) => ({ name: e.name, quantity: e.quantity }))
    const encoded = encodeURIComponent(JSON.stringify(entries))
    const search: Record<string, string> = { tab: 'quote', materials: encoded }
    navigate({ to: '/contact', search })
  }

  return (
    <div className="relative">
      {/* Floating decorative blobs */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-secondary/8 rounded-full blur-3xl -z-10 motion-preset-float motion-duration-4000" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/8 rounded-full blur-3xl -z-10 motion-preset-float motion-duration-5000 motion-delay-1000" />
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 motion-preset-pulse motion-duration-6000" />

      {/* Header */}
      <div className="text-center mb-10 motion-preset-slide-up motion-duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4">
          <span className="w-2 h-2 rounded-full bg-primary motion-preset-pulse" />
          Calculate Your Impact
        </div>
        <h2 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold text-text mb-4">
          {title}
        </h2>
        {description && (
          <p className="text-base sm:text-lg text-text/60 max-w-2xl mx-auto font-light">{description}</p>
        )}
      </div>

      {/* Device Grid */}
      {items.length === 0 ? (
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-primary/10 p-12 text-center motion-preset-pop">
          <p className="text-text/40 font-light">No devices available to calculate impact.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {items.map((item, index) => {
            const qty = getQuantity(index)
            const isSelected = qty > 0
            return (
              <button
                key={`${item.name}-${index}`}
                onClick={() => !isSelected && increment(index)}
                className={`relative group bg-white/40 backdrop-blur-sm rounded-2xl border p-4 sm:p-5 text-center transition-all duration-300 card-hover motion-preset-slide-up motion-duration-500 ${
                  isSelected
                    ? 'border-primary/30 shadow-lg shadow-primary/10 bg-white/60 ring-2 ring-primary/20'
                    : 'border-primary/10 hover:border-primary/20 hover:bg-white/60 hover:shadow-md'
                }`}
              >
                {/* Emoji */}
                <div
                  className={`text-3xl sm:text-4xl mb-2.5 transition-all duration-300 ${
                    isSelected ? 'scale-110' : 'group-hover:scale-105'
                  }`}
                  aria-hidden="true"
                >
                  {item.image}
                </div>

                {/* Name */}
                <p className="font-title text-sm sm:text-base font-bold text-text mb-2 leading-tight">
                  {item.name}
                </p>

                {!isSelected ? (
                  <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-300 bg-accent/10 text-accent group-hover:bg-accent/15">
                    + Add
                  </span>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span
                      onClick={(e) => {
                        e.stopPropagation()
                        decrement(index)
                      }}
                      className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold cursor-pointer hover:bg-primary/25 transition-colors select-none"
                    >
                      &minus;
                    </span>
                    <span className="text-sm font-bold text-primary min-w-[1.5ch] text-center">
                      {qty}
                    </span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation()
                        increment(index)
                      }}
                      className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold cursor-pointer hover:bg-primary/25 transition-colors select-none"
                    >
                      +
                    </span>
                  </div>
                )}

                {/* Selection check indicator */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-sm motion-preset-pop motion-duration-200">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Total Impact Panel */}
      <div
        className={`bg-white/40 backdrop-blur-sm rounded-2xl sm:rounded-3xl border p-6 sm:p-8 transition-all duration-500 motion-preset-slide-up motion-duration-700 ${
          hasSelection
            ? 'border-primary/20 shadow-xl shadow-primary/5'
            : 'border-primary/10'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-title text-xl sm:text-2xl font-bold text-text flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center ring-1 ring-primary/10">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            Your Total Impact
          </h3>

          {hasSelection && (
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm text-text/40 font-medium hidden sm:block">
                {totalDevices} {totalDevices === 1 ? 'device' : 'devices'}
              </span>
              <button
                onClick={clearAll}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-text/5 text-text/40 hover:bg-error/10 hover:text-error transition-all duration-300"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {!hasSelection ? (
          <div className="text-center py-10 sm:py-14">
            <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-text/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <p className="text-text/40 font-light text-sm sm:text-base">
              Select devices above to calculate your environmental impact
            </p>
          </div>
        ) : (
          <>
            {/* CO₂ Metric Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              {/* CO₂ Prevented */}
              <div className="bg-success/5 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-success/10 transition-all duration-500 hover:shadow-lg hover:scale-[1.02] motion-preset-slide-up">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-success/10 flex items-center justify-center ring-1 ring-success/20 transition-all duration-300">
                    <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold text-text/40 uppercase tracking-[0.08em]">CO&#8322; Prevented</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-title text-2xl sm:text-3xl font-bold text-success transition-all duration-300">
                    {formatValue(totalCO2)}
                  </span>
                  <span className="text-xs text-text/30 font-medium">kg</span>
                </div>
              </div>

              {/* Trees Planted */}
              <div className="bg-primary/5 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-primary/10 transition-all duration-500 hover:shadow-lg hover:scale-[1.02] motion-preset-slide-up">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20 transition-all duration-300">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold text-text/40 uppercase tracking-[0.08em]">Trees Planted</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-title text-2xl sm:text-3xl font-bold text-primary transition-all duration-300">
                    {formatCompact(trees)}
                  </span>
                  <span className="text-xs text-text/30 font-medium">trees/year</span>
                </div>
              </div>

              {/* Car Miles Avoided */}
              <div className="bg-secondary/5 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-secondary/10 transition-all duration-500 hover:shadow-lg hover:scale-[1.02] motion-preset-slide-up">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center ring-1 ring-secondary/20 transition-all duration-300">
                    <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-9.86a4.5 4.5 0 10-6.364 6.364L8.757 4.93"
                      />
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold text-text/40 uppercase tracking-[0.08em]">Car Miles Avoided</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-title text-2xl sm:text-3xl font-bold text-secondary transition-all duration-300">
                    {formatCompact(carMiles)}
                  </span>
                  <span className="text-xs text-text/30 font-medium">miles</span>
                </div>
              </div>

              {/* Homes' Energy */}
              <div className="bg-accent/5 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-accent/10 transition-all duration-500 hover:shadow-lg hover:scale-[1.02] motion-preset-slide-up">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center ring-1 ring-accent/20 transition-all duration-300">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                      />
                    </svg>
                  </div>
                  <span className="text-[11px] font-semibold text-text/40 uppercase tracking-[0.08em]">Homes&#39; Energy</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-title text-2xl sm:text-3xl font-bold text-accent transition-all duration-300">
                    {formatCompact(homesEnergy)}
                  </span>
                  <span className="text-xs text-text/30 font-medium">homes/day</span>
                </div>
              </div>
            </div>

            {/* CO₂ equivalence callout */}
            {totalCO2 > 0 && (
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-text/50 font-light motion-preset-slide-up motion-duration-500">
                  <svg className="w-4 h-4 text-success shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span>
                    That&apos;s <strong className="text-success font-semibold">{formatValue(totalCO2)} kg</strong> of CO
                    <sub className="text-[0.6em]">2</sub> emissions prevented.
                  </span>
                </div>

                <div className="bg-white/30 rounded-xl p-4 sm:p-5 border border-primary/5 transition-all duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                      <span className="block font-title text-xl sm:text-2xl font-bold text-primary">{formatCompact(trees)}</span>
                      <span className="text-xs text-text/40 font-medium">
                        trees planted<br />this year
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-secondary/5 border border-secondary/10">
                      <span className="block font-title text-xl sm:text-2xl font-bold text-secondary">{formatCompact(carMiles)}</span>
                      <span className="text-xs text-text/40 font-medium">
                        car miles<br />avoided
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-accent/5 border border-accent/10">
                      <span className="block font-title text-xl sm:text-2xl font-bold text-accent">{formatCompact(homesEnergy)}</span>
                      <span className="text-xs text-text/40 font-medium">
                        homes&apos; energy<br />for a day
                      </span>
                    </div>
                  </div>
                </div>

                {/* Request a Quote Button */}
                <div className="flex justify-center mt-4 motion-preset-slide-up motion-duration-500">
                  <button
                    onClick={handleRequestQuote}
                    className="group relative font-sans font-semibold px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white hover:brightness-110 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-500"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Request a Quote
                    </span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
