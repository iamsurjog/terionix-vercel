import { createFileRoute, Link } from '@tanstack/react-router'
import { Navbar } from '#/components/Navbar'
import { readContent } from '#/lib/content'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/learn/')({
  loader: async () => readContent(),
  component: LearnDashboard,
})

function LearnDashboard() {
  const content = Route.useLoaderData()!
  const { dashboard, moduleList, courseTitle, courseSubtitle } = content.learn
  const [completedModules, setCompletedModules] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('terionix_learn_progress')
      if (stored) {
        setCompletedModules(JSON.parse(stored))
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  const totalModules = moduleList?.length ?? 0
  const completedCount = completedModules.length
  const progress = totalModules > 0 ? (completedCount / totalModules) * 100 : 0

  return (
    <div className="font-sans text-text">
      <Navbar
        active="/learn"
        links={content.navbar.links}
        cta={content.navbar.cta}
        logo={content.site.logo}
        siteName={content.site.name}
      />

      <main className="relative overflow-hidden">
        {/* ====== DECORATIVE BACKGROUND BLOBS ====== */}
        <div className="absolute top-40 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10 motion-preset-float motion-duration-4000" />
        <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl -z-10 motion-preset-float motion-duration-5000 motion-delay-1000" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10 motion-preset-float motion-duration-6000 motion-delay-500" />

        {/* ====== 1. HERO SECTION ====== */}
        <div className="pt-32 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10 motion-preset-slide-up">
              {/* Decorative gradient accent bars */}
              <div className="flex items-center gap-2 mb-4">
                <span className="w-10 h-1 bg-secondary rounded-full" />
                <span className="w-20 h-1 bg-primary/40 rounded-full" />
              </div>

              {/* Course badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-primary motion-preset-pulse" />
                {courseTitle}
              </div>

              <h1 className="font-title text-5xl sm:text-6xl lg:text-7xl font-bold text-text leading-[1.1]">
                {dashboard.heading}
              </h1>

              <p className="text-lg sm:text-xl text-text/60 max-w-2xl mt-6 font-light leading-relaxed">
                {dashboard.body}
              </p>

              <p className="text-sm text-text/40 mt-4 font-medium">
                {courseSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* ====== DIVIDER ====== */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        {/* ====== 2. STATS ROW ====== */}
        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {dashboard.stats?.map((stat: any, i: number) => (
                <div
                  key={i}
                  className="bg-white/40 backdrop-blur-sm rounded-2xl border border-primary/10 p-6 text-center hover:border-primary/20 hover:bg-white/60 hover:shadow-xl transition-all duration-300 card-hover motion-preset-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="font-title text-3xl sm:text-4xl font-bold text-gradient-green mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-text/40 font-medium uppercase tracking-wider">
                    {stat.unit}
                  </div>
                  <div className="text-sm text-text/60 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ====== DIVIDER ====== */}
        <div className="h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />

        {/* ====== 3. PROGRESS OVERVIEW ====== */}
        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto motion-preset-slide-up">
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-primary/10 p-6 md:p-8 hover:border-primary/20 hover:bg-white/60 transition-all duration-300 card-hover">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="font-title text-xl font-bold text-text flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                  Your Progress
                </h2>
                <span className="text-sm text-text/60 font-medium bg-primary/5 px-3 py-1 rounded-full">
                  {completedCount} of {totalModules} modules completed
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-primary/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Milestone markers */}
              <div className="flex justify-between mt-2 text-xs text-text/30">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ====== DIVIDER ====== */}
        <div className="h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

        {/* ====== 4. MODULE GRID ====== */}
        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10 motion-preset-slide-up">
              <h2 className="font-title text-3xl sm:text-4xl font-bold text-text mb-2">
                Course <span className="text-gradient">Modules</span>
              </h2>
              <p className="text-text/60">
                {totalModules} modules &middot; {dashboard.stats?.[1]?.value || '~40'} minutes total &middot; work at your own pace
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {moduleList?.map((module: any, i: number) => {
                const isCompleted = completedModules.includes(module.id)

                return (
                  <Link
                    key={module.id}
                    to="/learn/$moduleId" params={{ moduleId: module.id }}
                    className={`group bg-white/40 backdrop-blur-sm rounded-2xl border p-6 hover:bg-white/60 transition-all duration-500 card-hover motion-preset-slide-up ${
                      isCompleted
                        ? 'border-primary/25 hover:border-primary/40'
                        : 'border-primary/10 hover:border-primary/20'
                    }`}
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    {/* Emoji + completion badge */}
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-4xl leading-none block" role="img" aria-label={module.title}>
                        {module.emoji}
                      </span>
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-success bg-success-soft px-2.5 py-1 rounded-full">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          Completed
                        </span>
                      )}
                    </div>

                    <h3 className="font-title text-lg font-bold text-text mb-2 group-hover:text-primary transition-colors duration-300">
                      {module.title}
                    </h3>

                    <p className="text-text/60 text-sm leading-relaxed mb-4 line-clamp-2">
                      {module.desc}
                    </p>

                    {/* Time badge */}
                    <div className="flex items-center gap-1.5 text-xs text-text/40 font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {module.time}
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Completion celebration if all done */}
            {completedCount === totalModules && totalModules > 0 && (
              <div className="mt-12 text-center motion-preset-pop">
                <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-success-soft border border-success/20">
                  <span className="text-2xl">🎉</span>
                  <div className="text-left">
                    <p className="font-title font-bold text-success text-lg">All modules completed!</p>
                    <p className="text-text/60 text-sm">Great work — you&apos;ve finished E-Waste Recycling 101</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ====== GRADIENT DIVIDER (BOTTOM) ====== */}
        <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 blur-sm" />
        </div>
      </main>
    </div>
  )
}
