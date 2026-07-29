import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { readContent } from '#/lib/content'

export const Route = createFileRoute('/innovation')({
  loader: async () => readContent(),
  component: InnovationPage,
})

function InnovationPage() {
  const content = Route.useLoaderData()!
  const { heading, intro, sections, cta } = content.innovation

  return (
    <div className="font-sans text-text">
      <Navbar active="/innovation" links={content.navbar.links} cta={content.navbar.cta} logo={content.site.logo} siteName={content.site.name} socialLinks={content.social?.links || []} />

      <main className="relative overflow-hidden">
        <div className="absolute top-40 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10 motion-preset-float motion-duration-4000" />
        <div className="absolute bottom-60 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl -z-10 motion-preset-float motion-duration-5000 motion-delay-1000" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10 motion-preset-float motion-duration-6000 motion-delay-2000" />

        <div className="pt-32 pb-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-14 motion-preset-slide-up">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-10 h-1 bg-secondary rounded-full" />
                <span className="w-20 h-1 bg-primary/40 rounded-full" />
              </div>
              <h1 className="font-title text-5xl sm:text-6xl lg:text-7xl font-bold text-text mb-4">
                {heading.prefix}<span className="text-gradient">{heading.highlight}</span>
              </h1>
              <p className="text-lg text-text/60 max-w-2xl font-light">{intro}</p>
            </div>

            <div className="space-y-8">
              {sections.map((section, i) => (
                <div
                  key={section.id}
                  id={section.id}
                  className="group bg-white/40 backdrop-blur-sm rounded-2xl border border-primary/10 hover:border-primary/20 hover:bg-white/60 hover:shadow-xl transition-all duration-500 card-hover p-8 motion-preset-slide-up"
                >
                  <div className="flex items-start gap-5 sm:gap-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={section.icon} />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="font-title text-2xl font-bold text-text mb-3 group-hover:text-primary transition-colors">
                        {section.title}
                      </h2>
                      <p className="text-text/70 leading-relaxed mb-5">{section.body}</p>

                      <div className="flex flex-wrap gap-2">
                        {section.highlights.map((highlight, j) => (
                          <span
                            key={j}
                            className="px-3 py-1.5 text-xs font-medium rounded-full bg-primary/5 text-primary border border-primary/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 motion-preset-slide-up">
              <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-3xl p-10 md:p-14 text-center border border-primary/10">
                <p className="font-title text-2xl md:text-3xl font-bold text-text mb-6">
                  {cta.text}
                </p>
                <a
                  href={cta.buttonHref}
                  className="inline-flex items-center gap-2 font-sans font-semibold text-sm px-8 py-3.5 rounded-full bg-accent text-white hover:brightness-110 shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all duration-300"
                >
                  {cta.buttonLabel}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
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
