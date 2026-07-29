import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ProcessVisualizer } from '../components/ProcessVisualizer'
import { readContent } from '#/lib/content'

export const Route = createFileRoute('/solutions')({
  loader: async () => readContent(),
  component: SolutionsPage,
})

function SolutionsPage() {
  const content = Route.useLoaderData()!
  const { heading, intro, sections, cta } = content.solutions

  return (
    <div className="font-sans text-text">
      <Navbar active="/solutions" links={content.navbar.links} cta={content.navbar.cta} logo={content.site.logo} siteName={content.site.name} socialLinks={content.social?.links || []} />

      <main className="relative overflow-hidden">
        <div className="absolute top-40 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10 motion-preset-float motion-duration-4000" />
        <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl -z-10 motion-preset-float motion-duration-5000 motion-delay-1000" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl -z-10 motion-preset-float motion-duration-6000 motion-delay-500" />

        <div className="pt-32 pb-24 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Heading */}
            <div className="mb-12 motion-preset-slide-up">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-10 h-1 bg-secondary rounded-full" />
                <span className="w-20 h-1 bg-primary/40 rounded-full" />
              </div>
              <h1 className="font-title text-5xl sm:text-6xl lg:text-7xl font-bold text-text mb-4">
                {heading.prefix}<span className="text-gradient">{heading.highlight}</span>
              </h1>
              <p className="text-lg text-text/60 max-w-2xl font-light">{intro}</p>
            </div>

            {/* Solution Sections */}
            <div className="space-y-8 mb-20">
              {sections.map((section, i) => (
                <div
                  key={section.id}
                  id={section.id}
                  className="group bg-white/40 backdrop-blur-sm rounded-2xl p-8 border border-primary/10 hover:border-primary/20 hover:bg-white/60 hover:shadow-xl transition-all duration-500 card-hover motion-preset-slide-up"
                >
                  <div className="flex items-start gap-5 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0 group-hover:from-primary group-hover:to-primary-deep group-hover:text-white transition-all duration-500 group-hover:shadow-lg group-hover:shadow-primary/25">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={section.icon} />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-title text-2xl font-bold text-text group-hover:text-primary transition-colors duration-300">{section.title}</h2>
                    </div>
                  </div>

                  <p className="text-text/70 leading-relaxed mb-6 pl-[72px]">{section.body}</p>

                  <div className="pl-[72px]">
                    <div className="w-12 h-0.5 bg-gradient-to-r from-primary/40 to-transparent rounded-full mb-4" />
                    <ul className="space-y-3">
                      {section.features.map((feature, fi) => (
                        <li key={fi} className="flex items-start gap-3 text-text/70">
                          <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                          </svg>
                          <span className="text-sm sm:text-base">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* ====== PROCESS VISUALIZER ====== */}
            <div className="mb-20 pt-8">
              <div className="w-16 h-0.5 bg-gradient-to-r from-primary/40 to-transparent rounded-full mb-12" />
              <ProcessVisualizer />
            </div>

            {/* ====== COMPLIANCE TRUST BADGES ====== */}
            <div className="mb-20 motion-preset-slide-up">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-primary/10 p-5 text-center card-hover hover:border-primary/20">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="font-title text-sm font-bold text-text">CPCB Compliant</p>
                  <p className="text-xs text-text/50 mt-0.5">Green Certificates</p>
                </div>

                <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-primary/10 p-5 text-center card-hover hover:border-primary/20">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="font-title text-sm font-bold text-text">Form 6</p>
                  <p className="text-xs text-text/50 mt-0.5">E-Waste Manifest</p>
                </div>

                <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-primary/10 p-5 text-center card-hover hover:border-primary/20">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <p className="font-title text-sm font-bold text-text">MoEFCC Compliant</p>
                  <p className="text-xs text-text/50 mt-0.5">E-Waste Rules 2022</p>
                </div>

                <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-primary/10 p-5 text-center card-hover hover:border-primary/20">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </div>
                  <p className="font-title text-sm font-bold text-text">ISO 14001:2015</p>
                  <p className="text-xs text-text/50 mt-0.5">EMS Certified</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="relative motion-preset-slide-up motion-delay-200">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-3xl blur-xl" />
              <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl border border-primary/10 p-10 md:p-14 text-center shadow-xl shadow-primary/5">
                <h2 className="font-title text-2xl md:text-3xl font-bold text-text mb-6">
                  {cta.text}
                </h2>
                <a
                  href={cta.buttonHref}
                  className="group inline-flex items-center gap-2 bg-gradient-to-r from-accent to-accent-deep text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:brightness-110 transition-all duration-300"
                >
                  <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{cta.buttonLabel}</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
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
