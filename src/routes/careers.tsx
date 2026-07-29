import { createFileRoute, Link } from '@tanstack/react-router'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { readContent } from '#/lib/content'

export const Route = createFileRoute('/careers')({
  loader: async () => readContent(),
  component: Careers,
})

function Careers() {
  const content = Route.useLoaderData()!
  const { heading, subtitle, whyTerionix, categories, cta } = content.careers

  return (
    <div className="font-sans text-text">
      <Navbar active="/careers" links={content.navbar.links} cta={content.navbar.cta} logo={content.site.logo} siteName={content.site.name} socialLinks={content.social?.links || []} />

      <main className="relative overflow-hidden">
        <div className="absolute top-40 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10 motion-preset-float motion-duration-4000" />
        <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl -z-10 motion-preset-float motion-duration-5000 motion-delay-1000" />

        <div className="pt-32 pb-24 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12 motion-preset-slide-up">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-10 h-1 bg-secondary rounded-full" />
                <span className="w-20 h-1 bg-primary/40 rounded-full" />
              </div>
              <h1 className="font-title text-5xl sm:text-6xl lg:text-7xl font-bold text-text mb-4">
                {heading.prefix}<span className="text-gradient">{heading.highlight}</span>
              </h1>
              <p className="text-lg text-text/60 max-w-2xl font-light">{subtitle}</p>
            </div>

            <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-primary/10 p-8 mb-16 hover:shadow-xl hover:border-primary/20 transition-all duration-500 motion-preset-slide-up card-hover">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </div>
                <h2 className="font-title text-2xl font-bold text-text">Why Terionix?</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {whyTerionix.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-primary/5 transition-colors group">
                    <div className="w-6 h-6 rounded-full bg-success-soft flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-success/20 transition-colors">
                      <svg className="w-3.5 h-3.5 text-success" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-text/70 group-hover:text-text transition-colors">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-16">
              {categories.map((cat, i) => (
                <div
                  key={cat.title}
                  className="group bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 hover:border-primary/30 hover:bg-white/60 hover:shadow-xl transition-all duration-500 motion-preset-slide-up card-hover"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <svg className="w-5 h-5 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                        </svg>
                      </div>
                      <h2 className="font-title text-lg font-bold text-text group-hover:text-primary transition-colors">{cat.title}</h2>
                    </div>
                    <Link
                      to="/contact"
                      search={{ tab: 'career', position: cat.slug }}
                      className="shrink-0 text-xs font-semibold text-white bg-accent px-4 py-2 rounded-xl hover:brightness-110 hover:shadow-lg hover:shadow-accent/25 transition-all duration-300"
                    >
                      Apply
                    </Link>
                  </div>
                  <ul className="space-y-2">
                    {cat.roles.map((role) => (
                      <li key={role} className="flex items-center gap-2 text-sm text-text/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                        {role}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="text-center bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-12 border border-primary/10 motion-preset-pop">
              <p className="text-xl text-text/70 mb-6 font-medium">{cta.text}</p>
              <Link
                to="/contact"
                search={{ tab: 'career', position: undefined }}
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-accent to-accent/80 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:brightness-110 transition-all duration-300"
              >
                <span>{cta.buttonLabel}</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <Footer content={content} />
      </main>
    </div>
  )
}
