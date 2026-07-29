import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from 'react'
import { Link, useLocation } from '@tanstack/react-router'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface ModuleItem {
  id: string
  contentKey: string
  title: string
  emoji: string
  desc: string
  time: string
}

interface CourseLayoutProps {
  moduleList: ModuleItem[]
  currentModuleId?: string
  children: React.ReactNode
}

interface LearnProgressValue {
  completed: Set<string>
  markComplete: (id: string) => void
  isComplete: (id: string) => boolean
}

// ─── localStorage helpers ───────────────────────────────────────────────────────

const STORAGE_KEY = 'terionix_learn_progress'

function loadProgress(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set<string>(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function persistProgress(set: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

// ─── Standalone hook (no context dependency) ────────────────────────────────────

function useStandaloneProgress(): LearnProgressValue {
  const [completed, setCompleted] = useState<Set<string>>(loadProgress)

  useEffect(() => {
    persistProgress(completed)
  }, [completed])

  const markComplete = useCallback((id: string) => {
    setCompleted((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const isComplete = useCallback(
    (id: string) => completed.has(id),
    [completed],
  )

  return { completed, markComplete, isComplete }
}

// ─── Context (so CourseLayout + children share the same progress state) ─────────

const LearnProgressCtx = createContext<LearnProgressValue | null>(null)

// ─── Exported hook ──────────────────────────────────────────────────────────────

/**
 * Returns the current learn progress state.
 * When called **inside** `<CourseLayout>`, this hook shares the same reactive
 * state as the sidebar. When called **outside**, it falls back to a standalone
 * localStorage-backed instance.
 */
export function useLearnProgress(): LearnProgressValue {
  const ctx = useContext(LearnProgressCtx)
  if (ctx) return ctx
  return useStandaloneProgress()
}

// ─── Layout component ───────────────────────────────────────────────────────────

export default function CourseLayout({
  moduleList,
  currentModuleId,
  children,
}: CourseLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const progress = useStandaloneProgress()
  const { isComplete } = progress

  // Scroll to top when navigating between modules
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentModuleId])

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // ── Derived values ──────────────────────────────────────────────────────────

  const totalCount = moduleList.length
  const completedCount = moduleList.filter((m) => isComplete(m.id)).length
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const currentIndex = currentModuleId
    ? moduleList.findIndex((m) => m.id === currentModuleId)
    : -1

  const prevModule = currentIndex > 0 ? moduleList[currentIndex - 1] : null
  const nextModule =
    currentIndex >= 0 && currentIndex < totalCount - 1
      ? moduleList[currentIndex + 1]
      : null
  const isLastModule = currentIndex === totalCount - 1

  const currentTitle = currentModuleId
    ? moduleList.find((m) => m.id === currentModuleId)?.title
    : null

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <LearnProgressCtx.Provider value={progress}>
      <div className="font-sans text-text min-h-screen flex">
        {/* ── Mobile backdrop ──────────────────────────────────────────────── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <aside
          className={[
            'w-64 shrink-0',
            'bg-white/90 backdrop-blur-xl border-r border-primary/10',
            'overflow-y-auto',
            /* Mobile: fixed overlay + slide transition */
            'fixed inset-y-0 left-0 z-50',
            'transition-transform duration-300 ease-in-out',
            /* Desktop: sticky part of the flex flow */
            'lg:sticky lg:top-0 lg:h-screen lg:z-auto lg:block lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          ].join(' ')}
        >
          {/* ── Sidebar header ─────────────────────────────────────────────── */}
          <div className="p-4 border-b border-primary/10">
            <a
              href="/learn"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary/20 shrink-0 group-hover:shadow-primary/40 transition-shadow duration-300">
                <span className="text-[15px]">♻</span>
              </div>
              <div>
                <span className="font-title font-bold text-sm text-text group-hover:text-primary transition-colors duration-300 block leading-tight">
                  E-Waste 101
                </span>
                <span className="text-[10px] text-text/30 font-medium">
                  Course
                </span>
              </div>
            </a>
          </div>

          {/* ── Sidebar progress ───────────────────────────────────────────── */}
          <div className="px-4 py-3.5 border-b border-primary/5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-text/40 font-medium">Progress</span>
              <span className="text-primary font-semibold tabular-nums">
                {completedCount}/{totalCount}
              </span>
            </div>
            <div className="h-1.5 bg-primary/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* ── Module list ────────────────────────────────────────────────── */}
          <nav className="p-2 space-y-0.5" aria-label="Course modules">
            {/* Course Overview */}
            <a
              href="/learn"
              onClick={() => setSidebarOpen(false)}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                !currentModuleId
                  ? 'bg-primary/10 border-l-2 border-primary font-semibold text-primary'
                  : 'text-text/50 hover:text-text hover:bg-primary/5 border-l-2 border-transparent',
              ].join(' ')}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px] bg-primary/5 text-text/30">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </span>
              <span>Course Overview</span>
            </a>

            {/* Divider */}
            <div className="my-1.5 border-t border-primary/5" />

              {/* Module items */}
            {moduleList.map((mod) => {
              const complete = isComplete(mod.id)
              const active = currentModuleId === mod.id

              return (
                <Link
                  key={mod.id}
                  to="/learn/$moduleId"
                  params={{ moduleId: mod.id }}
                  onClick={() => setSidebarOpen(false)}
                  className={[
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group',
                    active
                      ? 'bg-primary/10 border-l-2 border-primary font-semibold text-primary'
                      : 'text-text/50 hover:text-text hover:bg-primary/5 border-l-2 border-transparent',
                  ].join(' ')}
                >
                  {/* Status indicator */}
                  <span
                    className={[
                      'w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px] transition-all duration-300',
                      complete
                        ? 'bg-success text-white'
                        : active
                          ? 'bg-primary/20 text-primary'
                          : 'bg-primary/5 text-text/30',
                    ].join(' ')}
                  >
                    {complete ? (
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <span className="leading-none">{mod.emoji}</span>
                    )}
                  </span>

                  {/* Title */}
                  <span
                    className={[
                      'flex-1 min-w-0 truncate',
                      active ? 'text-primary' : 'group-hover:text-text',
                    ].join(' ')}
                  >
                    {mod.title}
                  </span>

                  {/* Time badge (only for incomplete modules) */}
                  {!complete && !active && (
                    <span className="text-[10px] text-text/25 font-medium whitespace-nowrap shrink-0">
                      {mod.time}
                    </span>
                  )}
                  {!complete && active && (
                    <span className="text-[10px] text-primary/50 font-medium whitespace-nowrap shrink-0">
                      {mod.time}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* ── Sidebar footer: completion celebration ─────────────────────── */}
          {completedCount === totalCount && totalCount > 0 && (
            <div className="p-4 border-t border-primary/10 mt-2">
              <div className="bg-gradient-to-r from-success/10 to-primary/10 rounded-xl p-3 text-center border border-success/20">
                <svg
                  className="w-5 h-5 text-success mx-auto mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xs font-semibold text-success">
                  Course Complete!
                </p>
                <p className="text-[10px] text-text/40 mt-0.5">
                  Great work finishing all modules
                </p>
              </div>
            </div>
          )}
        </aside>

        {/* ── Main content column ──────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* ── Sticky top bar (breadcrumb + hamburger) ────────────────────── */}
          <div className="sticky top-0 z-30 bg-background/70 backdrop-blur-xl border-b border-primary/5">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center h-14 gap-3">
                {/* Hamburger (mobile only) */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-text/40 hover:text-text hover:bg-primary/5 transition-colors"
                  aria-label="Open sidebar"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                </button>

                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-sm min-w-0">
                  <a
                    href="/learn"
                    className="text-text/50 hover:text-primary transition-colors whitespace-nowrap"
                  >
                    Learn
                  </a>
                  {currentTitle && (
                    <>
                      <svg
                        className="w-3.5 h-3.5 text-text/20 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                      <span className="text-text font-medium truncate">
                        {currentTitle}
                      </span>
                    </>
                  )}
                </nav>

                {/* Spacer + minified progress (desktop hint) */}
                <div className="ml-auto hidden sm:flex items-center gap-2">
                  <div className="h-1.5 w-16 bg-primary/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-text/30 font-medium tabular-nums whitespace-nowrap">
                    {completedCount}/{totalCount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Page content ───────────────────────────────────────────────── */}
          <div className="flex-1">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 motion-preset-slide-up motion-duration-500">
              {children}
            </div>
          </div>

          {/* ── Prev / Next footer ─────────────────────────────────────────── */}
          {currentModuleId && (prevModule || nextModule || isLastModule) && (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
              <div className="border-t border-primary/10 pt-6">
                <div className="flex items-center justify-between gap-4">
                  {/* Previous */}
                  <div className="min-w-0 flex-1">
                    {prevModule ? (
                      <Link
                        to="/learn/$moduleId"
                        params={{ moduleId: prevModule.id }}
                        className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-primary/10 bg-white/40 backdrop-blur-sm hover:bg-white/60 hover:border-primary/20 hover:shadow-md transition-all duration-300 text-sm max-w-full"
                      >
                        <svg
                          className="w-4 h-4 text-text/30 group-hover:text-primary transition-colors shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                          />
                        </svg>
                        <div className="text-left min-w-0">
                          <div className="text-[10px] text-text/40 font-medium uppercase tracking-wider">
                            Previous
                          </div>
                          <div className="font-medium text-text/70 group-hover:text-primary transition-colors truncate">
                            {prevModule.title}
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div />
                    )}
                  </div>

                  {/* Next / Finish */}
                  <div className="min-w-0 flex-1 flex justify-end">
                    {isLastModule ? (
                      <a
                        href="/learn"
                        className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:brightness-110 transition-all duration-300 text-sm"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Finish Course
                      </a>
                    ) : nextModule ? (
                      <Link
                        to="/learn/$moduleId"
                        params={{ moduleId: nextModule.id }}
                        className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-primary/10 bg-white/40 backdrop-blur-sm hover:bg-white/60 hover:border-primary/20 hover:shadow-md transition-all duration-300 text-sm max-w-full"
                      >
                        <div className="text-right min-w-0">
                          <div className="text-[10px] text-text/40 font-medium uppercase tracking-wider">
                            Next
                          </div>
                          <div className="font-medium text-text/70 group-hover:text-primary transition-colors truncate">
                            {nextModule.title}
                          </div>
                        </div>
                        <svg
                          className="w-4 h-4 text-text/30 group-hover:text-primary transition-colors shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </LearnProgressCtx.Provider>
  )
}
