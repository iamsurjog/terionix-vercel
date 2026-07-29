import { useState } from 'react'
import { contentAction } from '#/lib/content'

interface SectionProps {
  title: string
  onSave: (data: unknown) => Promise<void>
  defaultValues: unknown
  validate?: (data: unknown) => string | null
  children: (values: unknown, onChange: (path: string, value: unknown) => void) => React.ReactNode
}

export function AdminSection({ title, onSave, defaultValues, validate, children }: SectionProps) {
  const [values, setValues] = useState(defaultValues)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [saving, setSaving] = useState(false)

  const handleChange = (path: string, value: unknown) => {
    setValues(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      const parts = path.split('.')
      let curr = next
      for (let i = 0; i < parts.length - 1; i++) {
        if (!(parts[i] in curr)) curr[parts[i]] = {}
        curr = curr[parts[i]]
      }
      curr[parts[parts.length - 1]] = value
      return next
    })
  }

  const handleSave = async () => {
    setMsg(null)
    if (validate) {
      const err = validate(values)
      if (err) { setMsg({ type: 'error', text: err }); return }
    }
    setSaving(true)
    try {
      await onSave(values)
      setMsg({ type: 'success', text: 'Saved successfully!' })
    } catch (e: unknown) {
      setMsg({ type: 'error', text: 'Error: ' + (e instanceof Error ? e.message : String(e)) })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="font-sans text-text">
      <main className="pt-32 pb-24 px-4">
        <div className="max-w-2xl mx-auto motion-preset-slide-up">
          <h1 className="font-title text-3xl font-bold mb-6">{title}</h1>
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-primary/20 p-8 space-y-5 shadow-lg">
            {children(values, handleChange)}
            <div className="pt-6 border-t border-primary/10 flex items-center justify-between">
              <div>
                {msg && (
                  <p className={`text-sm flex items-center gap-1.5 ${msg.type === 'success' ? 'text-success' : 'text-error'}`}>
                    {msg.type === 'success' ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {msg.text}
                  </p>
                )}
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-r from-primary to-primary/80 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:brightness-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 motion-preset-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Saving...
                  </span>
                ) : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

interface FieldProps {
  label: string
  children: React.ReactNode
}

export function Field({ label, children }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5 text-text/80">{label}</label>
      {children}
    </div>
  )
}

interface InputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function Input({ value, onChange, placeholder, className = '' }: InputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-xl border border-primary/20 bg-white/60 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 ${className}`}
    />
  )
}

interface TextareaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

export function Textarea({ value, onChange, placeholder, rows = 4 }: TextareaProps) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-white/60 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 resize-y"
    />
  )
}

export function writeSection(section: string, content: unknown) {
  return contentAction({ action: 'write', section, content })
}
