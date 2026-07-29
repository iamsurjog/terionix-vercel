import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { readContent } from '#/lib/content'

export const Route = createFileRoute('/about')({
  loader: async () => readContent(),
  component: About,
})

function About() {
  const content = Route.useLoaderData()!
  const { heading, paragraphs, links } = content.about

  return (
    <div className="font-sans text-text">
      <Navbar active="/about" links={content.navbar.links} cta={content.navbar.cta} logo={content.site.logo} siteName={content.site.name} socialLinks={content.social?.links || []} />

      <main className="relative overflow-hidden">
        <div className="absolute top-40 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10 motion-preset-float motion-duration-4000" />
        <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl -z-10 motion-preset-float motion-duration-5000 motion-delay-1000" />

        <div className="pt-32 pb-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12 motion-preset-slide-up">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-10 h-1 bg-secondary rounded-full" />
                <span className="w-20 h-1 bg-primary/40 rounded-full" />
              </div>
              <h1 className="font-title text-5xl sm:text-6xl lg:text-7xl font-bold text-text">
                {heading.prefix}<span className="text-gradient">{heading.highlight}</span>
              </h1>
            </div>

            <div className="space-y-8 mb-16">
              {paragraphs.map((para, i) => (
                <div
                  key={i}
                  className={`group bg-white/40 backdrop-blur-sm rounded-2xl p-8 border border-primary/10 hover:border-primary/20 hover:bg-white/60 hover:shadow-xl transition-all duration-500 card-hover ${
                    i === 0 ? 'border-l-4 border-l-secondary' : ''
                  } motion-preset-slide-up`}
                >
                  <p className={`text-lg leading-relaxed text-text/70 ${para.className ?? ''}`}>
                    {para.segments.map((seg, j) =>
                      seg.className ? (
                        <span key={j} className={seg.className}>{seg.text}</span>
                      ) : (
                        <span key={j}>{seg.text}</span>
                      )
                    )}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 motion-preset-slide-up motion-delay-300">
              {links.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="group inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold px-6 py-3 rounded-xl hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/20"
                >
                  <span>{link.label}</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <Footer content={content} />
      </main>
    </div>
  )
}
