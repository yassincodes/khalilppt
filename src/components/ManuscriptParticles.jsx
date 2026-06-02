/** Lightweight CSS particle fields — export-safe (no canvas) */

const PRESETS = {
  star: { count: 14, color: '#e4b24e', size: [2, 4], drift: 18 },
  lamp: { count: 10, color: '#ffb347', size: [3, 6], drift: 22 },
  compass: { count: 12, color: '#36cfc9', size: [2, 5], drift: 16 },
  question: { count: 8, color: '#c0892a', size: [2, 4], drift: 20 },
  book: { count: 11, color: '#8a2f28', size: [2, 3], drift: 14 },
  pen: { count: 16, color: '#3f7d7d', size: [2, 5], drift: 24 },
}

function seed(n, i) {
  const x = Math.sin(n * 12.9898 + i * 78.233) * 43758.5453
  return x - Math.floor(x)
}

export function ParticleField({ motif = 'star', className = '' }) {
  const preset = PRESETS[motif] || PRESETS.star
  const dots = Array.from({ length: preset.count }, (_, i) => {
    const r1 = seed(1, i)
    const r2 = seed(2, i)
    const r3 = seed(3, i)
    const size = preset.size[0] + r1 * (preset.size[1] - preset.size[0])
    return {
      id: i,
      left: `${8 + r2 * 84}%`,
      top: `${6 + r3 * 88}%`,
      size,
      delay: r1 * 4,
      dur: 3 + r2 * 4,
      drift: preset.drift + r3 * 12,
    }
  })

  return (
    <div className={`ms-particles ${className}`.trim()} aria-hidden>
      {dots.map((d) => (
        <span
          key={d.id}
          className="ms-particle"
          style={{
            '--p-left': d.left,
            '--p-top': d.top,
            '--p-size': `${d.size}px`,
            '--p-color': preset.color,
            '--p-delay': `${d.delay}s`,
            '--p-dur': `${d.dur}s`,
            '--p-drift': `${d.drift}px`,
          }}
        />
      ))}
    </div>
  )
}

export function StageAura({ presenting = false }) {
  if (!presenting) return null
  return (
    <div className="ms-stage-aura" aria-hidden>
      <span className="ms-aura ms-aura--gold" />
      <span className="ms-aura ms-aura--teal" />
      <span className="ms-aura ms-aura--crimson" />
    </div>
  )
}

export function InkBurst({ active, direction = 1 }) {
  if (!active) return null
  return (
    <div
      className={`ms-ink-burst ${direction > 0 ? 'ms-ink-burst--next' : 'ms-ink-burst--prev'}`}
      aria-hidden
    />
  )
}
