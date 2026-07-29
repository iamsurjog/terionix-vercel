const colorVars = ['--color-primary-rgb', '--color-secondary-rgb', '--color-accent-rgb']

const particles = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  size: 2 + (i % 3) * 2,
  left: 5 + (i * 7) % 90,
  top: 10 + (i * 13) % 80,
  delay: (i * 1.7) % 6,
  duration: 6 + (i % 5) * 2,
  colorVar: colorVars[i % 3],
  blur: i % 2 === 0 ? 'blur(0px)' : 'blur(1px)',
}))

export function ParticleField() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute rounded-full${p.id > 2 ? ' safari-hide-particle' : ''}`}
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            background: `rgba(var(${p.colorVar}), 0.8)`,
            boxShadow: `0 0 ${p.size * 2}px rgba(var(${p.colorVar}), 0.5)`,
            animation: `firefly-${(p.id % 5) + 1} ${p.duration}s ease-in-out ${p.delay}s infinite`,
            filter: p.blur,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  )
}
