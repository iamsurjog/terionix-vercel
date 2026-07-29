interface Step {
  number: number
  title: string
  description: string
  icon: string
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Schedule & Assess',
    description: 'Tell us what you have — whether it is a single laptop or a warehouse full of servers. We assess, quote, and schedule a pickup at your convenience.',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    number: 2,
    title: 'Logistics & Tracking',
    description: 'Our GPS-tracked fleet collects your e-waste with full chain of custody. Every item is logged, sealed, and transported in compliance with hazardous material handling guidelines.',
    icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
  },
  {
    number: 3,
    title: 'Data Destruction',
    description: 'Before recycling, all data is destroyed using certified methods — NSA/CSS degaussing, physical shredding, or DoD-standard software erasure. You get a certificate of destruction.',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  },
  {
    number: 4,
    title: 'Eco-Friendly Recycling & Certification',
    description: 'Materials are sorted, processed, and recovered. Hazardous components are safely treated. You receive a CPCB-compliant Green Certificate and Form 6 documentation for your audit trail.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
]

export function ProcessVisualizer() {
  return (
    <section className="relative">
      {/* Section heading */}
      <div className="mb-12 motion-preset-slide-up">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            How It Works
          </span>
        </div>
        <h2 className="font-title text-3xl sm:text-4xl font-bold text-text mb-3">
          Your E-Waste <span className="text-gradient">Journey</span>
        </h2>
        <p className="text-text/60 max-w-xl">
          From submission to certification — here is what happens after you schedule a pickup with us.
        </p>
      </div>

      {/* Steps */}
      <div className="relative">
        {/* Vertical connecting line (desktop: hidden, mobile: visible) */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent hidden max-md:block motion-preset-fade" />

        {/* Horizontal connecting line (desktop only) */}
        <div className="absolute left-[60px] right-[60px] top-16 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent hidden md:block motion-preset-fade" />

        <div className="grid md:grid-cols-4 gap-6 md:gap-4">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative flex md:flex-col items-start md:items-center gap-4 md:gap-0 motion-preset-slide-up"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Step number + icon circle */}
              <div className="relative z-10 flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-deep text-white flex items-center justify-center shadow-lg shadow-primary/25 md:mb-4 transition-all duration-500 group-hover:scale-105">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                  </svg>
                </div>
                {/* Step number badge */}
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center shadow-sm">
                  {step.number}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 md:text-center">
                <h3 className="font-title text-lg font-bold text-text mb-1.5">{step.title}</h3>
                <p className="text-text/50 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="mt-12 flex items-center gap-3 justify-center motion-preset-fade motion-delay-500">
        <span className="w-8 h-1 bg-primary/30 rounded-full" />
        <span className="w-16 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full" />
        <span className="w-8 h-1 bg-accent/30 rounded-full" />
      </div>
    </section>
  )
}
