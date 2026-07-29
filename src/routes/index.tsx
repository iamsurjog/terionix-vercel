import { createFileRoute, Link } from '@tanstack/react-router'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { readContent } from '#/lib/content'
import { RecyclingGame, Leaderboard } from '#/components/RecyclingGame'
import { ImpactCalculator } from '#/components/ImpactCalculator'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { shouldReduceMotion } from '#/lib/browser'

export const Route = createFileRoute('/')({
  loader: async () => readContent(),
  component: Home,
})

function AnimatedHeading({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (shouldReduceMotion()) return
    const el = ref.current
    if (!el) return
    const words = el.querySelectorAll('.word')
    gsap.fromTo(words,
      { opacity: 0, y: 30, rotateX: -40 },
      {
        opacity: 1, y: 0, rotateX: 0,
        duration: 0.7,
        stagger: 0.04,
        ease: 'back.out(1.4)',
      }
    )
  }, [])

  return (
    <h1 ref={ref} className="font-title text-5xl sm:text-7xl lg:text-8xl font-bold text-text mb-6 leading-[1.1]">
      {text.split(' ').map((word, i) => (
        <span key={i} className="word inline-block mr-[0.3rem]">{word}</span>
      ))}
    </h1>
  )
}

function Home() {
  const content = Route.useLoaderData()!
  const { tagline, heroTitle, heroSubtitle, matrixCards, trustStats, authorization, audience, impactCalculator, corporateDashboard, whyTerionix } = content.home
  const gameRef = useRef<HTMLDivElement>(null)

  return (
    <div className="font-sans text-text">
      <Navbar active="/" links={content.navbar.links} cta={content.navbar.cta} logo={content.site.logo} siteName={content.site.name} socialLinks={content.social?.links || []} />

      <main className="relative overflow-hidden">
        {/* ====== STICKY SIDE NAV — Explore CTAs (collapsed, expands on hover) ====== */}
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-1">
          {audience.segments.map((segment: any, i: number) => {
            const sideStyles = [
              'bg-primary/90 hover:bg-primary text-white border-l-2 border-primary/50',
              'bg-secondary/90 hover:bg-secondary text-white border-l-2 border-secondary/50',
              'bg-accent/90 hover:bg-accent text-white border-l-2 border-accent/50'
            ]
            const sideIcons = [
              <svg key="b2b" className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>,
              <svg key="acad" className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" /></svg>,
              <svg key="indiv" className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
            ]
            return (
              <Link
                key={segment.id}
                to={segment.cta.href}
                className={`group relative flex items-center gap-2.5 pl-3 pr-4 py-3 rounded-l-xl transition-all duration-300 text-sm font-semibold w-12 hover:w-60 overflow-hidden ${sideStyles[i]}`}
                title={segment.title}
              >
                <span className="flex items-center gap-2.5 whitespace-nowrap">
                  {sideIcons[i]}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">{segment.cta.label}</span>
                </span>
              </Link>
            )
          })}
        </div>
        {/* ====== 1. HERO SECTION ====== */}
        <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
          <div className="absolute inset-0 -z-10">
            <div className="aurora-bg">
              <div className="aurora-wave bg-primary/10" style={{ top: '-50%', left: '-30%', animationDelay: '0s' }} />
              <div className="aurora-wave bg-secondary/8" style={{ top: '-30%', right: '-20%', animationDelay: '-4s' }} />
              <div className="aurora-wave bg-accent/6" style={{ bottom: '-40%', left: '10%', animationDelay: '-8s' }} />
            </div>
            <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl motion-preset-float motion-duration-4000" />
            <div className="absolute bottom-40 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl motion-preset-float motion-duration-5000 motion-delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl motion-preset-pulse motion-duration-6000" />
          </div>

          <div className="max-w-5xl mx-auto text-center relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-8 motion-preset-slide-up motion-duration-700">
              <span className="w-2 h-2 rounded-full bg-primary motion-preset-pulse" />
              {tagline}
            </div>

            <AnimatedHeading text={heroTitle} />

            <p className="text-lg sm:text-xl text-text/60 max-w-2xl mx-auto mb-10 motion-preset-slide-up motion-duration-700 motion-delay-200 font-light">
              {heroSubtitle}
            </p>

            {/* ====== WHO WE CATER TO — Cards replacing old buttons ====== */}
            <div className="mt-10 motion-preset-slide-up motion-duration-700 motion-delay-300">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                {audience.heading}
              </div>
              <div className="grid md:grid-cols-3 gap-4 lg:gap-6 max-w-4xl mx-auto text-left">
                {audience.segments.map((segment: any, i: number) => (
                  <div
                    key={segment.id}
                    className="group bg-white/50 backdrop-blur-sm rounded-2xl border border-primary/10 p-5 hover:border-primary/30 hover:bg-white/70 hover:shadow-xl transition-all duration-500 card-hover flex flex-col"
                  >
                    {/* Icon */}
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-3.5 transition-all duration-500
                      ${i === 0 ? 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white' : ''}
                      ${i === 1 ? 'bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white' : ''}
                      ${i === 2 ? 'bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white' : ''}
                    `}>
                      {segment.icon === 'building' && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                        </svg>
                      )}
                      {segment.icon === 'academic' && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                        </svg>
                      )}
                      {segment.icon === 'user' && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                      )}
                    </div>

                    <h3 className={`font-title text-base font-bold text-text mb-2 transition-colors
                      ${i === 0 ? 'group-hover:text-primary' : ''}
                      ${i === 1 ? 'group-hover:text-secondary' : ''}
                      ${i === 2 ? 'group-hover:text-accent' : ''}
                    `}>{segment.title}</h3>
                    <p className="text-text/60 text-sm leading-relaxed mb-4 flex-grow">{segment.description}</p>

                    {/* CTA */}
                    <Link
                      to={segment.cta.href}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-500 w-fit
                        ${i === 0 ? 'bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20 hover:border-primary' : ''}
                        ${i === 1 ? 'bg-secondary/10 text-secondary hover:bg-secondary hover:text-white border border-secondary/20 hover:border-secondary' : ''}
                        ${i === 2 ? 'bg-accent/10 text-accent hover:bg-accent hover:text-white border border-accent/20 hover:border-accent' : ''}
                      `}
                    >
                      {segment.cta.label}
                      <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 motion-preset-bounce motion-duration-2000 motion-loop-infinite">
            <svg className="w-6 h-6 text-text/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* ====== 2. AUTHORIZATION & TRUST ANCHOR ====== */}
        <section className="px-4 py-20 relative">
          <div className="absolute top-0 left-0 right-0 section-divider" />

          <div className="max-w-5xl mx-auto">
            {/* TNPCB Authorization */}
            <div className="text-center mb-16 motion-preset-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-semibold mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verified & Certified
              </div>
              <h2 className="font-title text-2xl sm:text-3xl font-bold text-text mb-4">{authorization.title}</h2>
              <p className="text-text/60 max-w-3xl mx-auto leading-relaxed">{authorization.description}</p>
            </div>

            {/* Trust Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 motion-preset-slide-up motion-delay-200">
              {trustStats.map((stat: any, i: number) => (
                <div
                  key={i}
                  className="bg-white/40 backdrop-blur-sm rounded-2xl border border-primary/10 p-6 text-center hover:border-primary/20 hover:bg-white/60 transition-all duration-300 card-hover"
                >
                  <div className="font-title text-3xl sm:text-4xl font-bold text-gradient-green mb-1">{stat.value}</div>
                  <div className="text-xs text-text/40 font-medium uppercase tracking-wider">{stat.unit}</div>
                  <div className="text-sm text-text/60 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== 3. CORPORATE DASHBOARD — FEATURES SHOWCASE ====== */}
        <section className="px-4 py-24 relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <div className="max-w-6xl mx-auto motion-preset-slide-up">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
                Corporate Portal
              </div>
              <h2 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold text-text mb-4">
                {corporateDashboard.title}
              </h2>
              <p className="text-text/60 max-w-2xl mx-auto text-lg">{corporateDashboard.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {corporateDashboard.features.map((feature: any, i: number) => {
                const iconColors = [
                  'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white border-primary/20',
                  'bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white border-secondary/20',
                  'bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white border-accent/20',
                  'bg-primary/10 text-primary group-hover:bg-primary-deep group-hover:text-white border-primary/20'
                ]
                return (
                  <div
                    key={i}
                    className="group bg-white/40 backdrop-blur-sm rounded-2xl border border-primary/10 p-6 hover:border-primary/30 hover:bg-white/60 hover:shadow-xl transition-all duration-500 card-hover text-center"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-500 ${iconColors[i]}`}>
                      {feature.icon === 'calendar' && (
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                      )}
                      {feature.icon === 'tracking' && (
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                      )}
                      {feature.icon === 'certificate' && (
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                        </svg>
                      )}
                      {feature.icon === 'impact' && (
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                        </svg>
                      )}
                    </div>
                    <h3 className="font-title text-lg font-bold text-text mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-text/60 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ====== 4. WHY TERIONIX — ENTERPRISE PILLARS (Data Security, Legal Compliance, Green PR/ESG) ====== */}
        <section className="px-4 py-24 relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 motion-preset-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-semibold mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                Why Terionix
              </div>
              <h2 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold text-text mb-4">
                {whyTerionix.heading}
              </h2>
              <p className="text-text/60 max-w-2xl mx-auto">{whyTerionix.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {whyTerionix.pillars.map((pillar: any, i: number) => {
                const pillarStyles = [
                  'border-primary/20 hover:border-primary/40',
                  'border-secondary/20 hover:border-secondary/40',
                  'border-accent/20 hover:border-accent/40'
                ]
                const iconBg = [
                  'bg-primary/10 text-primary group-hover:bg-primary',
                  'bg-secondary/10 text-secondary group-hover:bg-secondary',
                  'bg-accent/10 text-accent group-hover:bg-accent'
                ]
                return (
                  <div
                    key={i}
                    className={`group bg-white/40 backdrop-blur-sm rounded-2xl border p-8 hover:bg-white/60 hover:shadow-xl transition-all duration-500 card-hover motion-preset-slide-up ${pillarStyles[i]}`}
                    style={{ animationDelay: `${i * 150}ms` }}
                  >
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:text-white ${iconBg[i]}`}>
                      {pillar.icon === 'lock' && (
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                      )}
                      {pillar.icon === 'shield' && (
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                      )}
                      {pillar.icon === 'trending' && (
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                        </svg>
                      )}
                    </div>

                    <h3 className={`font-title text-xl font-bold text-text mb-4 transition-colors
                      ${i === 0 ? 'group-hover:text-primary' : ''}
                      ${i === 1 ? 'group-hover:text-secondary' : ''}
                      ${i === 2 ? 'group-hover:text-accent' : ''}
                    `}>{pillar.title}</h3>
                    <p className="text-text/60 leading-relaxed text-sm">{pillar.body}</p>

                    {/* Bottom accent */}
                    <div className={`mt-6 w-12 h-1 rounded-full transition-all duration-500 group-hover:w-full
                      ${i === 0 ? 'bg-primary/30 group-hover:bg-primary' : ''}
                      ${i === 1 ? 'bg-secondary/30 group-hover:bg-secondary' : ''}
                      ${i === 2 ? 'bg-accent/30 group-hover:bg-accent' : ''}
                    `} />
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ====== 5. MATRIX GRID — 3 VALUE PILLARS ====== */}
        <section className="px-4 py-24 relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 motion-preset-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4">
                Our Core Pillars
              </div>
              <h2 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold text-text mb-4">
                Built on <span className="text-gradient">Trust & Innovation</span>
              </h2>
              <p className="text-text/60 max-w-2xl mx-auto">Three pillars that define every aspect of our e-waste management services.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {matrixCards.map((card: any, i: number) => (
                <div
                  key={i}
                  className="group bg-white/40 backdrop-blur-sm rounded-2xl border border-primary/10 p-8 hover:border-primary/30 hover:bg-white/60 hover:shadow-xl transition-all duration-500 card-hover motion-preset-slide-up"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 
                    ${i === 0 ? 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white' : ''}
                    ${i === 1 ? 'bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white' : ''}
                    ${i === 2 ? 'bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white' : ''}
                  `}>
                    {card.icon === 'shield' && (
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    )}
                    {card.icon === 'lock' && (
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    )}
                    {card.icon === 'cpu' && (
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                      </svg>
                    )}
                  </div>

                  <h3 className="font-title text-xl font-bold text-text mb-3 group-hover:text-primary transition-colors">{card.title}</h3>
                  <p className="text-text/60 leading-relaxed mb-6 text-sm">{card.description}</p>

                  {/* Stat badge */}
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                    ${i === 0 ? 'bg-primary/10 text-primary' : ''}
                    ${i === 1 ? 'bg-secondary/10 text-secondary' : ''}
                    ${i === 2 ? 'bg-accent/10 text-accent' : ''}
                  `}>
                    {card.statIcon === 'check' && (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                    {card.statIcon === 'shield' && (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    )}
                    {card.statIcon === 'trending' && (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                      </svg>
                    )}
                    {card.stat}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>





        {/* ====== 6. E-WASTE IMPACT CALCULATOR ====== */}
        <section className="px-4 py-24 relative">
          <div className="absolute top-0 left-0 right-0 section-divider" />
          <div className="absolute bottom-40 left-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl -z-10" />
          <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />

          <div className="max-w-5xl mx-auto motion-preset-slide-up">
            <ImpactCalculator
              title={impactCalculator.title}
              description={impactCalculator.description}
              items={impactCalculator.items}
            />
          </div>
        </section>

        {/* ====== 7. GAMIFIED CHALLENGE — RECYCLING GAME ====== */}
        <section ref={gameRef} className="px-4 py-24 relative scroll-mt-24" id="game-section">
          <div className="absolute top-0 left-0 right-0 section-divider" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 motion-preset-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-semibold mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Take the E-Waste Challenge
              </div>
              <h2 className="font-title text-3xl sm:text-4xl font-bold text-text mb-4">
                Test Your <span className="text-gradient">Recycling IQ</span>
              </h2>
              <p className="text-text/60 max-w-xl mx-auto">Learn what's recyclable while racing against the clock. Complete the challenge and schedule a cleanup drive.</p>
            </div>

            <div className="bg-white/50 backdrop-blur-xl rounded-3xl border border-primary/10 p-8 max-w-md mx-auto shadow-2xl shadow-primary/5 motion-preset-pop motion-duration-700 card-hover">
              <RecyclingGame items={content.game.items} />
              <Leaderboard />
            </div>

            {/* Post-game CTA hint */}
            <div className="text-center mt-8 text-sm text-text/40 motion-preset-fade">
              <span className="inline-flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Complete the challenge and schedule a free household e-waste pickup
              </span>
            </div>
          </div>
        </section>

        <Footer content={content} />
      </main>
    </div>
  )
}


