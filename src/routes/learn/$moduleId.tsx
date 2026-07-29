import { useState, useCallback } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Navbar } from '../../components/Navbar'
import CourseLayout from '../../components/CourseLayout'
import { readContent } from '#/lib/content'

export const Route = createFileRoute('/learn/$moduleId')({
  loader: async () => readContent(),
  component: ModulePage,
})

// ── Progress Helpers ──────────────────────────────────────────────
const PROGRESS_KEY = 'terionix_learn_progress'

function getProgress(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function markComplete(moduleId: string) {
  const current = getProgress()
  if (!current.includes(moduleId)) {
    current.push(moduleId)
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(current))
  }
}

function isComplete(moduleId: string): boolean {
  return getProgress().includes(moduleId)
}

// ── Types ─────────────────────────────────────────────────────────
interface TextSection {
  type: 'text'
  id: string
  title: string
  body: string
}

interface GridItem {
  emoji: string
  label: string
  desc: string
}

interface GridSection {
  type: 'grid'
  id: string
  title: string
  items: GridItem[]
}

interface StatItem {
  value: string
  unit: string
  label: string
}

interface StatsSection {
  type: 'stats'
  id: string
  title: string
  stats: StatItem[]
}

interface ListItem {
  emoji: string
  label: string
  desc: string
}

interface ListSection {
  type: 'list'
  id: string
  title: string
  items: ListItem[]
}

interface CalloutSection {
  type: 'callout'
  id: string
  emoji: string
  title: string
  body: string
}

interface TimelineStep {
  number: number
  emoji: string
  title: string
  body: string
}

interface TimelineSection {
  type: 'timeline'
  id: string
  title: string
  steps: TimelineStep[]
}

type Section = TextSection | GridSection | StatsSection | ListSection | CalloutSection | TimelineSection

// ── Section Renderers ─────────────────────────────────────────────

function SectionText({ section }: { section: TextSection }) {
  return (
    <div id={section.id} className="max-w-3xl motion-preset-slide-up">
      <h2 className="font-title text-2xl sm:text-3xl font-bold text-text mb-4">{section.title}</h2>
      <p className="text-text/70 leading-relaxed text-lg">{section.body}</p>
    </div>
  )
}

function SectionGrid({ section }: { section: GridSection }) {
  return (
    <div id={section.id} className="motion-preset-slide-up">
      <h2 className="font-title text-2xl sm:text-3xl font-bold text-text mb-6">{section.title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {section.items.map((item, i) => (
          <div
            key={i}
            className="group bg-white/40 backdrop-blur-sm rounded-2xl border border-primary/10 p-5 hover:border-primary/20 hover:bg-white/60 hover:shadow-xl transition-all duration-500 card-hover"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform duration-300">{item.emoji}</span>
            <h4 className="font-title font-bold text-text text-sm mb-1.5">{item.label}</h4>
            <p className="text-text/50 text-xs leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SectionStats({ section }: { section: StatsSection }) {
  return (
    <div id={section.id} className="motion-preset-slide-up">
      <h2 className="font-title text-2xl sm:text-3xl font-bold text-text mb-6">{section.title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {section.stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white/40 backdrop-blur-sm rounded-2xl border border-primary/10 p-5 text-center hover:border-primary/20 hover:bg-white/60 transition-all duration-300 card-hover"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="font-title text-3xl sm:text-4xl font-bold text-gradient-green mb-1">{stat.value}</div>
            <div className="text-xs text-text/40 font-medium uppercase tracking-wider">{stat.unit}</div>
            <div className="text-sm text-text/50 mt-2 leading-relaxed">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SectionList({ section }: { section: ListSection }) {
  return (
    <div id={section.id} className="motion-preset-slide-up">
      <h2 className="font-title text-2xl sm:text-3xl font-bold text-text mb-6">{section.title}</h2>
      <div className="space-y-4">
        {section.items.map((item, i) => (
          <div
            key={i}
            className="group flex items-start gap-4 bg-white/30 backdrop-blur-sm rounded-2xl border border-primary/10 p-5 hover:border-primary/20 hover:bg-white/50 transition-all duration-300 card-hover"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span className="text-2xl shrink-0 mt-0.5">{item.emoji}</span>
            <div>
              <h4 className="font-title font-bold text-text text-sm mb-1">{item.label}</h4>
              <p className="text-text/50 text-sm leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SectionCallout({ section }: { section: CalloutSection }) {
  return (
    <div id={section.id} className="motion-preset-slide-up">
      <div className="relative bg-primary/5 border border-primary/20 rounded-2xl p-6 sm:p-8 overflow-hidden">
        {/* Decorative top-right gradient blob */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex items-start gap-4">
          <span className="text-3xl sm:text-4xl shrink-0">{section.emoji}</span>
          <div>
            <h3 className="font-title text-xl font-bold text-text mb-2">{section.title}</h3>
            <p className="text-text/70 leading-relaxed">{section.body}</p>
          </div>
        </div>

        {/* Left accent bar */}
        <span className="absolute left-0 top-4 bottom-4 w-1 rounded-full bg-gradient-to-b from-primary via-secondary to-accent" />
      </div>
    </div>
  )
}

function SectionTimeline({ section }: { section: TimelineSection }) {
  return (
    <div id={section.id} className="motion-preset-slide-up">
      <h2 className="font-title text-2xl sm:text-3xl font-bold text-text mb-8">{section.title}</h2>
      <div className="relative">
        {/* Vertical center line (desktop) */}
        <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-secondary/20 to-accent/30 -translate-x-1/2 hidden sm:block" />
        {/* Mobile left line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-secondary/20 to-accent/30 block sm:hidden" />

        <div className="space-y-8 sm:space-y-12">
          {section.steps.map((step, i) => {
            const isLeft = i % 2 === 0
            return (
              <div
                key={step.number}
                className={`relative flex items-start gap-6 sm:gap-0 ${isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Content */}
                <div className={`flex-1 bg-white/40 backdrop-blur-sm rounded-2xl border border-primary/10 p-5 sm:p-6 hover:border-primary/20 hover:bg-white/60 transition-all duration-300 card-hover sm:w-[calc(50%-2rem)] ${
                  isLeft ? 'sm:pr-8 sm:text-right sm:mr-8' : 'sm:pl-8 sm:ml-8'
                }`}>
                  <div className={`flex items-center gap-2 mb-2 sm:mb-3 ${isLeft ? 'sm:flex-row-reverse' : ''}`}>
                    <span className="text-2xl">{step.emoji}</span>
                    <h3 className="font-title text-lg font-bold text-text">{step.title}</h3>
                  </div>
                  <p className="text-text/60 text-sm leading-relaxed">{step.body}</p>
                </div>

                {/* Center node */}
                <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-title font-bold text-sm shadow-lg shadow-primary/30 border-2 border-white z-10">
                    {step.number}
                  </div>
                </div>

                {/* Empty spacer for the other side */}
                <div className="hidden sm:block flex-1" />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Section Router ────────────────────────────────────────────────

function renderSection(section: Section, i: number) {
  switch (section.type) {
    case 'text':
      return <SectionText key={section.id || i} section={section} />
    case 'grid':
      return <SectionGrid key={section.id || i} section={section} />
    case 'stats':
      return <SectionStats key={section.id || i} section={section} />
    case 'list':
      return <SectionList key={section.id || i} section={section} />
    case 'callout':
      return <SectionCallout key={section.id || i} section={section} />
    case 'timeline':
      return <SectionTimeline key={section.id || i} section={section} />
    default:
      return null
  }
}

// ── Quiz Module ───────────────────────────────────────────────────

function QuizModule({ quizData }: { quizData: { questions: Array<{ question: string; options: string[]; correct: number; explanation: string }> } }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [questions, setQuestions] = useState(quizData.questions)

  const handleAnswer = useCallback((optionIndex: number) => {
    if (selected !== null) return
    setSelected(optionIndex)
    if (optionIndex === questions[currentQ].correct) {
      setScore((s) => s + 1)
    }
  }, [selected, currentQ, questions])

  const handleNext = useCallback(() => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1)
      setSelected(null)
    } else {
      // Quiz complete
      markComplete('quiz')
      setShowResult(true)
    }
  }, [currentQ, questions.length])

  const handleRestart = useCallback(() => {
    setCurrentQ(0)
    setScore(0)
    setSelected(null)
    setShowResult(false)
    // Shuffle questions for replay
    setQuestions((prev) => [...prev].sort(() => Math.random() - 0.5))
  }, [])

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100)
    const celebration = percentage === 100
      ? '🏆' : percentage >= 80
        ? '🌟' : percentage >= 60
          ? '👏' : '💪'

    return (
      <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-primary/10 p-8 sm:p-10 text-center motion-preset-pop max-w-xl mx-auto">
        <span className="text-6xl block mb-6">{celebration}</span>
        <h2 className="font-title text-3xl sm:text-4xl font-bold text-text mb-2">
          You got <span className="text-gradient">{score}</span>/{questions.length} correct!
        </h2>
        <p className="text-text/60 mb-2">
          {percentage === 100
            ? 'Perfect score! You\'re an e-waste expert!'
            : percentage >= 80
              ? 'Excellent work! You really know your stuff.'
              : percentage >= 60
                ? 'Good job! A little review and you\'ll nail it.'
                : 'Keep learning — every bit of knowledge helps the planet!'}
        </p>

        {/* Score breakdown */}
        <div className="mt-6 mb-8">
          <div className="max-w-xs mx-auto bg-white/50 rounded-full h-3 overflow-hidden border border-primary/10">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-sm text-text/40 mt-2 block">{percentage}%</span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:brightness-110 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
            Try Again
          </button>
          <a
            href="/learn"
            className="inline-flex items-center gap-2 bg-white/60 border border-primary/20 text-text font-semibold px-6 py-3 rounded-xl hover:bg-white hover:border-primary/30 transition-all duration-300"
          >
            Back to Course
          </a>
        </div>
      </div>
    )
  }

  const question = questions[currentQ]
  const isCorrect = selected === question.correct

  return (
    <div className="max-w-2xl mx-auto motion-preset-slide-up">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-text/50">
          Question <span className="text-primary font-bold">{currentQ + 1}</span> of {questions.length}
        </span>
        <span className="text-sm font-medium text-text/40">
          Score: <span className="text-gradient font-bold">{score}</span>
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-8">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i < currentQ
                ? 'bg-primary'
                : i === currentQ
                  ? 'bg-primary/40'
                  : 'bg-primary/10'
            }`}
          />
        ))}
      </div>

      {/* Question card */}
      <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-primary/10 p-6 sm:p-8 shadow-lg mb-6">
        <h3 className="font-title text-xl sm:text-2xl font-bold text-text mb-6 leading-snug">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((option, oi) => {
            let btnStyle = 'border-primary/10 hover:border-primary/30 hover:bg-white/60 bg-white/30'
            let icon = null

            if (selected !== null) {
              if (oi === question.correct) {
                btnStyle = 'border-success bg-success/10 text-success'
                icon = (
                  <svg className="w-5 h-5 text-success shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              } else if (oi === selected) {
                btnStyle = 'border-error bg-error/10 text-error'
                icon = (
                  <svg className="w-5 h-5 text-error shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              }
            }

            return (
              <button
                key={oi}
                onClick={() => handleAnswer(oi)}
                disabled={selected !== null}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl border-2 text-left transition-all duration-300 card-hover ${
                  selected !== null ? 'cursor-default' : 'cursor-pointer'
                } ${btnStyle}`}
              >
                <span className={`
                  w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-300
                  ${selected !== null && oi === question.correct
                    ? 'bg-success text-white'
                    : selected !== null && oi === selected
                      ? 'bg-error text-white'
                      : 'bg-primary/10 text-text/60'
                  }
                `}>
                  {String.fromCharCode(65 + oi)}
                </span>
                <span className="flex-1 text-sm sm:text-base font-medium">{option}</span>
                {icon}
              </button>
            )
          })}
        </div>
      </div>

      {/* Explanation + Next */}
      {selected !== null && (
        <div className="motion-preset-slide-up motion-duration-300">
          <div className={`rounded-2xl border p-5 mb-5 ${
            isCorrect
              ? 'bg-success/5 border-success/20'
              : 'bg-error/5 border-error/20'
          }`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">{isCorrect ? '✅' : '❌'}</span>
              <div>
                <p className={`font-title font-bold text-sm mb-1 ${isCorrect ? 'text-success' : 'text-error'}`}>
                  {isCorrect ? 'Correct!' : 'Not quite'}
                </p>
                <p className="text-text/60 text-sm leading-relaxed">{question.explanation}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:brightness-110 transition-all duration-300"
          >
            {currentQ < questions.length - 1 ? (
              <>
                Next Question
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </>
            ) : (
              <>
                See Results
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

// ── Pledge Module ─────────────────────────────────────────────────

function PledgeSection({ pledge }: { pledge: { title: string; subtitle: string; commitments: string[]; cta: string } }) {
  const [checked, setChecked] = useState<boolean[]>(new Array(pledge.commitments.length).fill(false))
  const [pledged, setPledged] = useState(false)
  const allChecked = checked.every(Boolean)

  const toggleCommitment = (i: number) => {
    if (pledged) return
    setChecked((prev) => {
      const next = [...prev]
      next[i] = !next[i]
      return next
    })
  }

  const handlePledge = () => {
    if (!allChecked) return
    markComplete('take-action')
    setPledged(true)
  }

  if (pledged) {
    return (
      <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-primary/10 p-8 sm:p-10 text-center motion-preset-pop max-w-xl mx-auto">
        <span className="text-6xl block mb-6">🌱</span>
        <h2 className="font-title text-3xl font-bold text-text mb-2">You Took the Pledge!</h2>
        <p className="text-text/60 mb-6">
          Thank you for committing to responsible e-waste management. Every action you take brings us closer to a cleaner, greener planet.
        </p>
        <div className="flex items-center justify-center gap-3">
          <a
            href="/learn"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:brightness-110 transition-all duration-300"
          >
            Back to Course
          </a>
          <Link
            to="/contact"
            search={{ tab: undefined, position: undefined, materials: undefined }}
            className="inline-flex items-center gap-2 bg-white/60 border border-primary/20 text-text font-semibold px-6 py-3 rounded-xl hover:bg-white hover:border-primary/30 transition-all duration-300"
          >
            Schedule a Pickup
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div id="pledge" className="max-w-2xl mx-auto motion-preset-slide-up">
      <div className="relative bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-2xl border border-primary/20 p-6 sm:p-8 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <span className="text-4xl block mb-4">🤝</span>
          <h2 className="font-title text-2xl sm:text-3xl font-bold text-text mb-2">{pledge.title}</h2>
          <p className="text-text/60 mb-8">{pledge.subtitle}</p>

          {/* Commitments */}
          <div className="space-y-3 mb-8">
            {pledge.commitments.map((commitment, i) => (
              <button
                key={i}
                onClick={() => toggleCommitment(i)}
                className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                  checked[i]
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-primary/10 bg-white/30 hover:border-primary/20 hover:bg-white/50'
                } ${pledged ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className={`
                  w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300
                  ${checked[i]
                    ? 'bg-primary border-primary text-white'
                    : 'border-primary/30 bg-white/50'
                  }
                `}>
                  {checked[i] && (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm leading-relaxed transition-colors ${
                  checked[i] ? 'text-text font-medium' : 'text-text/60'
                }`}>
                  {commitment}
                </span>
              </button>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={handlePledge}
            disabled={!allChecked}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-accent-deep text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:brightness-110 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:brightness-100"
          >
            {allChecked ? (
              <>
                {pledge.cta}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </>
            ) : (
              <>
                <span className="w-5 h-5 rounded-full border-2 border-white/40 flex items-center justify-center text-xs font-bold">?</span>
                Check all commitments to pledge
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Mark as Complete Button ──────────────────────────────────────

function MarkCompleteButton({ moduleId, moduleTitle }: { moduleId: string; moduleTitle: string }) {
  const [done, setDone] = useState(isComplete(moduleId))
  const [animating, setAnimating] = useState(false)

  const handleMarkComplete = () => {
    markComplete(moduleId)
    setDone(true)
    setAnimating(true)
    setTimeout(() => setAnimating(false), 2000)
  }

  return (
    <div className="border-t border-primary/10 pt-8 mt-12 text-center motion-preset-slide-up">
      {done ? (
        <div className={`inline-flex items-center gap-2 bg-success/10 text-success border border-success/20 px-6 py-3 rounded-xl transition-all duration-500 ${animating ? 'scale-105' : ''}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-semibold">{moduleTitle} completed!</span>
        </div>
      ) : (
        <button
          onClick={handleMarkComplete}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:brightness-110 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Mark as Complete
        </button>
      )}
    </div>
  )
}

// ── Main Page Component ──────────────────────────────────────────

function ModulePage() {
  const content = Route.useLoaderData()!
  const { moduleId } = Route.useParams()

  // Find module metadata
  const moduleMeta = content.learn.moduleList.find((m: { id: string }) => m.id === moduleId)

  // If not found, render 404
  if (!moduleMeta) {
    return (
      <div className="font-sans text-text">
        <Navbar active="/learn" links={content.navbar.links} cta={content.navbar.cta} logo={content.site.logo} siteName={content.site.name} socialLinks={content.social?.links || []} />
        <main className="relative overflow-hidden pt-32 pb-24 px-4 min-h-[80vh] flex items-center justify-center">
          <div className="text-center motion-preset-slide-up">
            <div className="text-6xl mb-6">🔍</div>
            <h1 className="font-title text-4xl font-bold text-text mb-3">Module Not Found</h1>
            <p className="text-text/60 mb-8 max-w-md mx-auto">
              We couldn't find a learn module matching "<span className="font-semibold text-text/80">{moduleId}</span>". It may have been moved or removed.
            </p>
            <a
              href="/learn"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:brightness-110 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Course Dashboard
            </a>
          </div>
        </main>
        <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
      </div>
    )
  }

  // Get module data from the content key
  const moduleData: any = content.learn[moduleMeta.contentKey]
  if (!moduleData) {
    return (
      <div className="font-sans text-text">
        <Navbar active="/learn" links={content.navbar.links} cta={content.navbar.cta} logo={content.site.logo} siteName={content.site.name} socialLinks={content.social?.links || []} />
        <main className="relative overflow-hidden pt-32 pb-24 px-4 min-h-[80vh] flex items-center justify-center">
          <div className="text-center motion-preset-slide-up">
            <h1 className="font-title text-4xl font-bold text-text mb-3">Content Error</h1>
            <p className="text-text/60 mb-8">Module data is unavailable. Please try again later.</p>
            <a href="/learn" className="text-primary hover:underline font-semibold">Back to Course</a>
          </div>
        </main>
        <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
      </div>
    )
  }

  // ── Content sections ──────────────────────────────────────────
  const sections: Section[] | undefined = moduleData.sections
  const isQuiz = moduleId === 'quiz'
  const isTakeAction = moduleId === 'take-action'
  const hasSections = sections && sections.length > 0

  return (
    <div className="font-sans text-text">
      <Navbar active="/learn" links={content.navbar.links} cta={content.navbar.cta} logo={content.site.logo} siteName={content.site.name} socialLinks={content.social?.links || []} />

      <div className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-40 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10 motion-preset-float motion-duration-4000" />
        <div className="absolute bottom-40 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl -z-10 motion-preset-float motion-duration-5000 motion-delay-1000" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl -z-10 motion-preset-float motion-duration-6000 motion-delay-500" />

        {/* Hero area (before CourseLayout for the decorative header) */}
        <div className="pt-24 pb-4 px-4 sm:px-6 lg:px-10">
          <div className="max-w-4xl">
            <div className="mb-8 motion-preset-slide-up">
              {/* Module badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="w-10 h-1 bg-secondary rounded-full" />
                <span className="w-20 h-1 bg-primary/40 rounded-full" />
              </div>

              {/* Hero title */}
              <h1 className="font-title text-4xl sm:text-5xl lg:text-6xl font-bold text-text mb-4 leading-tight">
                {moduleData.heroTitle}
              </h1>

              {/* Hero subtitle */}
              {moduleData.heroSubtitle && (
                <p className="text-base sm:text-lg text-text/60 max-w-2xl font-light leading-relaxed">
                  {moduleData.heroSubtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* CourseLayout wraps the sidebar + content */}
        <CourseLayout moduleList={content.learn.moduleList} currentModuleId={moduleId}>
          {/* Section content */}
          <div className="space-y-16 pb-16">
            {/* Render sections (if any) */}
            {hasSections && sections.map((section, i) => renderSection(section, i))}

            {/* Quiz module special handling */}
            {isQuiz && moduleData.questions && (
              <QuizModule quizData={moduleData} />
            )}

            {/* Take Action: sections + pledge */}
            {isTakeAction && moduleData.pledge && (
              <PledgeSection pledge={moduleData.pledge} />
            )}

            {/* Mark as complete for content modules (not quiz or take-action) */}
            {!isQuiz && !isTakeAction && (
              <MarkCompleteButton moduleId={moduleId} moduleTitle={moduleMeta.title} />
            )}
          </div>
        </CourseLayout>

        {/* Gradient divider */}
        <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
      </div>
    </div>
  )
}
