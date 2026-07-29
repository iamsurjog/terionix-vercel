import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { readContent } from '#/lib/content'

export const Route = createFileRoute('/history')({
  loader: async () => readContent(),
  component: History,
})

function History() {
  const content = Route.useLoaderData()!
  const { heading, paragraphs } = content.history

  return (
    <div className="font-sans text-text">
      <Navbar active="/history" links={content.navbar.links} cta={content.navbar.cta} logo={content.site.logo} siteName={content.site.name} socialLinks={content.social?.links || []} />

      <main className="relative overflow-hidden">
        <div className="absolute top-40 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10 motion-preset-float motion-duration-4000" />
        <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl -z-10 motion-preset-float motion-duration-5000 motion-delay-1000" />

        <div className="pt-32 pb-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-16 motion-preset-slide-up">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-10 h-1 bg-secondary rounded-full" />
                <span className="w-20 h-1 bg-primary/40 rounded-full" />
              </div>
              <h1 className="font-title text-5xl sm:text-6xl lg:text-7xl font-bold text-text">
                {heading.prefix}<span className="text-gradient">{heading.highlight}</span>
              </h1>
            </div>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-secondary/30 to-accent/30 hidden sm:block" />

              <div className="space-y-12">
                {paragraphs.map((para, i) => (
                  <div
                    key={i}
                    className="relative pl-0 sm:pl-20 motion-preset-slide-up"
                  >
                    <div className="hidden sm:flex absolute left-0 top-1 w-16 h-16 rounded-full bg-white/60 backdrop-blur-sm border-2 border-primary/20 items-center justify-center shadow-lg shadow-primary/5 transition-all duration-300 hover:border-primary hover:shadow-primary/20">
                      <span className="font-title font-bold text-gradient">{String(i + 1).padStart(2, '0')}</span>
                    </div>

                    <div className="group bg-white/40 backdrop-blur-sm rounded-2xl p-8 border border-primary/10 hover:border-primary/20 hover:bg-white/60 hover:shadow-xl transition-all duration-500 card-hover">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="sm:hidden w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="font-title font-bold text-primary text-sm">{i + 1}</span>
                        </div>
                        <div className="h-0.5 flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
                      </div>
                      <p className={`text-lg leading-relaxed ${para.className ?? 'text-text/70'}`}>
                        {para.segments.map((seg, j) =>
                          seg.className ? (
                            <span key={j} className={seg.className}>{seg.text}</span>
                          ) : (
                            <span key={j}>{seg.text}</span>
                          )
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Footer content={content} />
      </main>
    </div>
  )
}
