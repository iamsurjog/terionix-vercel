import { useState, useEffect, useCallback, useRef } from 'react'

function getCsrfToken(): string {
  const match = document.cookie.match(/csrftoken=([^;]+)/)
  return match ? match[1] : ''
}

interface Item {
  name: string
  recyclable: boolean
}

interface GameProps {
  items: Item[]
}

export function RecyclingGame({ items }: GameProps) {
  const [round, setRound] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [current, setCurrent] = useState<Item | null>(null)
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [animKey, setAnimKey] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const pickItem = useCallback((): Item | null => {
    if (items.length === 0) return null
    return items[Math.floor(Math.random() * items.length)]
  }, [items])

  const startGame = useCallback(() => {
    setCurrent(pickItem())
    setRound(1)
    setCorrect(0)
    const now = Date.now()
    setStartTime(now)
    setElapsed(0)
    setSubmitted(false)
    setName('')
    setAnimKey(k => k + 1)
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => setElapsed((Date.now() - now) / 1000), 100)
  }, [items, pickItem])

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const handleAnswer = (recyclable: boolean) => {
    const newCorrect = current && current.recyclable === recyclable ? correct + 1 : correct

    if (newCorrect === 10) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setCurrent(null)
      setCorrect(newCorrect)
      return
    }

    setCurrent(pickItem())
    setRound(r => r + 1)
    setCorrect(newCorrect)
    setAnimKey(k => k + 1)
  }

  const handleSubmit = async () => {
    if (!name.trim()) return
    try {
      await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),
        },
        credentials: 'include',
        body: JSON.stringify({ name: name.trim(), time: elapsed }),
      })
    } catch {
      void null
    }
    setSubmitted(true)
  }

  if (round === 0) {
    return (
      <div className="text-center motion-preset-pop">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="font-title text-2xl font-bold mb-2">Recycling Game</h2>
        <p className="text-text/60 mb-6 text-sm">Sort 10 items as Recyclable or Not. Beat the clock!</p>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-primary to-primary/80 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:brightness-110 transition-all duration-300 motion-preset-pulse motion-duration-2000 motion-loop-infinite"
        >
          Start Game
        </button>
      </div>
    )
  }

  if (correct === 10) {
    const timeStr = elapsed.toFixed(2)
    return (
      <div className="text-center motion-preset-pop">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-success/20 to-primary/20 flex items-center justify-center mx-auto mb-4 motion-preset-wobble motion-duration-1000">
          <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="font-title text-2xl font-bold mb-1">All Done!</h2>
        <p className="text-lg font-bold text-primary mb-1">{correct} / 10 correct</p>
        <p className="text-4xl font-title font-bold text-text mb-6 motion-preset-pulse motion-duration-2000">{timeStr}<span className="text-lg text-text/40">s</span></p>
        {!submitted && (
          <div className="space-y-3 max-w-xs mx-auto">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-white/60 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 text-center"
              maxLength={20}
            />
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="w-full bg-gradient-to-r from-primary to-primary/80 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Score
            </button>
          </div>
        )}
        {submitted && (
          <div className="flex items-center justify-center gap-2 text-success font-medium py-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Score submitted!
          </div>
        )}
        <button onClick={startGame} className="mt-6 text-primary font-medium hover:text-primary/80 transition-colors underline underline-offset-4 decoration-primary/30 hover:decoration-primary">
          Play Again
        </button>
      </div>
    )
  }

  return (
    <div className="text-center">
      {/* Progress bar */}
      <div className="w-full h-2 bg-primary/10 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(correct / 10) * 100}%` }}
        />
      </div>

      <div className="flex justify-between items-center mb-6 max-w-sm mx-auto">
        <span className="flex items-center gap-1.5 text-sm font-medium text-text/60">
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {round}/10
        </span>
        <span className="text-2xl font-mono font-bold tabular-nums motion-preset-pulse motion-duration-2000 motion-loop-infinite">{elapsed.toFixed(2)}<span className="text-sm text-text/40">s</span></span>
        <span className="flex items-center gap-1.5 text-sm font-medium text-success">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {correct}
        </span>
      </div>

      <div key={animKey} className="mb-8 motion-preset-pop motion-duration-300">
        <p className="text-sm text-text/50 mb-3">Is this recyclable?</p>
        <div className="inline-block bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl px-8 py-6 border border-primary/10">
          <p className="font-title text-3xl font-bold">{current?.name}</p>
        </div>
      </div>

      <div className="flex gap-4 justify-center" key={animKey + 1}>
        <button
          onClick={() => handleAnswer(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Recyclable
        </button>
        <button
          onClick={() => handleAnswer(false)}
          className="flex items-center gap-2 bg-gradient-to-r from-error to-error/80 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-error/25 hover:shadow-error/40 hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Not Recyclable
        </button>
      </div>
    </div>
  )
}

interface Score {
  name: string
  time: number
}

async function fetchLeaderboard(): Promise<Score[]> {
  try {
    const res = await fetch('/api/leaderboard')
    if (!res.ok) return []
    const data = await res.json()
    return data.map((e: { name: string; time: number }) => ({ name: e.name, time: e.time }))
  } catch {
    return []
  }
}

export function Leaderboard() {
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetchLeaderboard().then(s => { setScores(s); setLoading(false) })
  }, [])
  const sorted = [...scores].sort((a, b) => a.time - b.time).slice(0, 10)
  const medals = ['text-warning', 'text-text/40', 'text-accent']

  return (
    <div className="mt-8 pt-6 border-t border-primary/10">
      <h3 className="font-title text-xl font-bold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-2.77.896m0 0a6.023 6.023 0 01-2.77-.896" />
        </svg>
        Leaderboard
      </h3>
      <table className="w-full text-left">
        <thead>
          <tr className="text-xs text-text/50 uppercase tracking-wider border-b border-primary/10">
            <th className="pb-2 pr-4 w-10">#</th>
            <th className="pb-2">Name</th>
            <th className="pb-2 text-right">Time</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((s, i) => (
            <tr key={i} className="border-b border-primary/5 last:border-0 group hover:bg-primary/5 transition-colors">
              <td className="py-2.5 pr-4">
                {i < 3 ? (
                  <svg className={`w-5 h-5 ${medals[i]}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ) : (
                  <span className="text-text/40 text-sm font-mono">{i + 1}</span>
                )}
              </td>
              <td className="py-2.5 font-medium text-sm">{s.name}</td>
              <td className="py-2.5 text-right font-mono text-sm text-text/70">{s.time.toFixed(2)}s</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
