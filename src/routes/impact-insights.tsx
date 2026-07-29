import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { readContent } from '#/lib/content'

export const Route = createFileRoute('/impact-insights')({
  loader: async () => readContent(),
  component: ImpactInsightsPage,
})

function ImpactInsightsPage() {
  const content = Route.useLoaderData()!
  const { heading, intro, sections, cta } = content.impactInsights

  return (
    <div className="font-sans text-text">
      <Navbar active="/impact-insights" links={content.navbar.links} cta={content.navbar.cta} logo={content.site.logo} siteName={content.site.name} socialLinks={content.social?.links || []} />

      <main className="relative overflow-hidden">
        <div className="absolute top-40 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10 motion-preset-float motion-duration-4000" />
        <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl -z-10 motion-preset-float motion-duration-5000 motion-delay-1000" />

        <div className="pt-32 pb-24 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Heading */}
            <div className="mb-16 motion-preset-slide-up">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-10 h-1 bg-secondary rounded-full" />
                <span className="w-20 h-1 bg-primary/40 rounded-full" />
              </div>
              <h1 className="font-title text-5xl sm:text-6xl lg:text-7xl font-bold text-text mb-6">
                {heading.prefix}<span className="text-gradient">{heading.highlight}</span>
              </h1>
              <p className="text-lg text-text/60 max-w-3xl font-light leading-relaxed">{intro}</p>
            </div>

            {/* Section 1: Sustainability Impact */}
            <div id="sustainability" className="mb-20 scroll-mt-24 motion-preset-slide-up motion-delay-100">
              <SectionHeader icon={sections[0].icon} title={sections[0].title} body={sections[0].body} />
              <div className="grid gap-6 md:grid-cols-3 mt-8">
                {sections[0].metrics.map((metric: { label: string; value: string; unit: string }, i: number) => (
                  <MetricCard key={i} metric={metric} index={i} />
                ))}
              </div>
            </div>

            {/* Section 2: E-Waste Facts */}
            <div id="facts" className="mb-20 scroll-mt-24 motion-preset-slide-up motion-delay-200">
              <SectionHeader icon={sections[1].icon} title={sections[1].title} body={sections[1].body} />
              <div className="grid gap-6 md:grid-cols-2 mt-8">
                {sections[1].facts.map((fact: { stat: string; unit: string; description: string }, i: number) => (
                  <FactCard key={i} fact={fact} index={i} />
                ))}
              </div>
            </div>

            {/* Section 3: Resources & Reports */}
            <div id="resources" className="mb-20 scroll-mt-24 motion-preset-slide-up motion-delay-300">
              <SectionHeader icon={sections[2].icon} title={sections[2].title} body={sections[2].body} />
              <div className="mt-8 space-y-3">
                {sections[2].resources.map((resource: { title: string; type: string }, i: number) => (
                  <ResourceItem key={i} resource={resource} index={i} />
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="motion-preset-slide-up motion-delay-400">
              <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 rounded-3xl p-10 sm:p-12 border border-primary/10 text-center card-hover">
                <h2 className="font-title text-2xl sm:text-3xl font-bold text-text mb-6 leading-snug">{cta.text}</h2>
                <a
                  href={cta.buttonHref}
                  className="inline-flex items-center gap-2 bg-accent text-white font-semibold px-8 py-3.5 rounded-full shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:brightness-110 transition-all duration-300 text-sm sm:text-base"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {cta.buttonLabel}
                </a>
              </div>
            </div>
          </div>
        </div>

        <Footer content={content} />
      </main>
    </div>
  )
}

function SectionHeader({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-1">
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <div>
        <h2 className="font-title text-2xl sm:text-3xl font-bold text-text mb-2">{title}</h2>
        <p className="text-text/60 leading-relaxed">{body}</p>
      </div>
    </div>
  )
}

function MetricCard({ metric, index }: { metric: { label: string; value: string; unit: string }; index: number }) {
  return (
    <div
      className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 hover:border-primary/20 hover:bg-white/60 hover:shadow-xl transition-all duration-500 card-hover text-center"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="font-title text-4xl sm:text-5xl font-bold text-gradient mb-1 leading-none">{metric.value}</div>
      <div className="text-sm text-primary/80 font-semibold mb-3">{metric.unit}</div>
      <div className="text-sm text-text/60 leading-snug">{metric.label}</div>
    </div>
  )
}

function FactCard({ fact, index }: { fact: { stat: string; unit: string; description: string }; index: number }) {
  return (
    <div
      className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 hover:border-primary/20 hover:bg-white/60 hover:shadow-xl transition-all duration-500 card-hover"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-baseline gap-3 mb-3 flex-wrap">
        <span className="font-title text-3xl sm:text-4xl font-bold text-gradient leading-none">{fact.stat}</span>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{fact.unit}</span>
      </div>
      <p className="text-sm text-text/70 leading-relaxed">{fact.description}</p>
    </div>
  )
}

function ResourceItem({ resource, index }: { resource: { title: string; type: string }; index: number }) {
  const typeColors: Record<string, string> = {
    Whitepaper: 'bg-primary/10 text-primary border-primary/20',
    Report: 'bg-secondary/10 text-secondary border-secondary/20',
    Guide: 'bg-accent/10 text-accent border-accent/20',
    Handbook: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  }

  const colorClass = typeColors[resource.type] || 'bg-primary/10 text-primary border-primary/20'

  return (
    <div
      className="bg-white/40 backdrop-blur-sm rounded-2xl p-5 border border-primary/10 hover:border-primary/20 hover:bg-white/60 hover:shadow-xl transition-all duration-500 card-hover flex items-center gap-4 group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-text font-medium block truncate group-hover:text-primary transition-colors">{resource.title}</span>
      </div>
      <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border shrink-0 transition-all duration-300 ${colorClass}`}>
        {resource.type}
      </span>
    </div>
  )
}
