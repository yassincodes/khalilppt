/** SVG ornaments — animated ink + gold · export-safe CSS/SVG */

export function CornerArabesque({ animated = false }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={animated ? 'ms-corner-svg' : ''}>
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path className="ms-corner-path" d="M62 2 C40 2 24 8 14 18 C6 26 4 40 4 62" />
        <path className="ms-corner-path ms-corner-path--2" d="M54 7 C37 9 25 17 19 29 C14 39 13 50 13 60" />
        <path className="ms-corner-path ms-corner-path--3" d="M42 11 C42 23 31 31 19 33 C27 35 33 43 33 53" />
        <circle className="ms-corner-dot" cx="20" cy="20" r="3" fill="currentColor" stroke="none" />
      </g>
    </svg>
  )
}

export function DividerOrnament({ animated = false }) {
  return (
    <svg
      viewBox="0 0 260 22"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      className={animated ? 'ms-divider-svg' : ''}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <line className="ms-div-line ms-div-line--l" x1="0" y1="11" x2="92" y2="11" />
        <line className="ms-div-line ms-div-line--r" x1="168" y1="11" x2="260" y2="11" />
        <path className="ms-div-arch" d="M92 11 C108 2 120 2 130 11 C140 20 152 20 168 11" />
        <path className="ms-div-arch ms-div-arch--2" d="M92 11 C108 20 120 20 130 11 C140 2 152 2 168 11" />
        <circle className="ms-div-gem" cx="130" cy="11" r="3.4" fill="currentColor" stroke="none" />
        <circle cx="92" cy="11" r="2" fill="currentColor" stroke="none" />
        <circle cx="168" cy="11" r="2" fill="currentColor" stroke="none" />
      </g>
    </svg>
  )
}

export function CoverSeal({ animated = false }) {
  return (
    <svg viewBox="0 0 120 120" className={`ms-seal ${animated ? 'ms-seal--live' : ''}`} aria-hidden>
      <g fill="none" stroke="#c0892a" strokeWidth="2">
        <circle className="ms-seal-ring ms-seal-ring--outer" cx="60" cy="60" r="56" />
        <circle className="ms-seal-ring ms-seal-ring--inner" cx="60" cy="60" r="48" stroke="#43271a" strokeWidth="1" />
        {[0, 45, 90, 135].map((r) => (
          <rect
            key={r}
            className="ms-seal-square"
            x="34"
            y="34"
            width="52"
            height="52"
            transform={`rotate(${r} 60 60)`}
            rx="3"
            style={{ '--seal-rot': r }}
          />
        ))}
        <circle className="ms-seal-core" cx="60" cy="60" r="12" fill="#c0892a" opacity="0.3" />
      </g>
    </svg>
  )
}

function ringAndPetals(animated) {
  const gold = '#c0892a'
  const ink = '#43271a'
  const petals = []
  for (let i = 0; i < 16; i += 1) {
    const a = (i * 22.5 * Math.PI) / 180
    const x = 210 + 170 * Math.cos(a)
    const y = 210 + 170 * Math.sin(a)
    petals.push(
      <circle
        key={i}
        className={animated ? 'ms-petal' : ''}
        cx={x}
        cy={y}
        r="3.2"
        fill={gold}
        style={animated ? { '--petal-i': i } : undefined}
      />,
    )
  }
  return (
    <>
      <circle className={animated ? 'ms-med-ring ms-med-ring--1' : ''} cx="210" cy="210" r="196" fill="none" stroke={ink} strokeWidth="2.5" />
      <circle className={animated ? 'ms-med-ring ms-med-ring--2' : ''} cx="210" cy="210" r="186" fill="none" stroke={gold} strokeWidth="1.4" />
      <circle className={animated ? 'ms-med-ring ms-med-ring--3' : ''} cx="210" cy="210" r="150" fill="none" stroke={ink} strokeWidth="1" strokeDasharray="2 7" />
      {petals}
    </>
  )
}

export function Medallion({ motif = 'star', animated = false }) {
  const gold = '#c0892a'
  const ink = '#43271a'
  const turq = '#3f7d7d'
  const crim = '#8a2f28'
  const cls = animated ? 'ms-med-core' : ''

  const core = {
    star: (
      <g fill="none" stroke={ink} strokeWidth="2" className={cls}>
        {[0, 45].map((r) => (
          <rect key={r} className="ms-med-square" x="120" y="120" width="180" height="180" transform={`rotate(${r} 210 210)`} rx="6" />
        ))}
        <circle className="ms-med-pulse" cx="210" cy="210" r="44" fill={gold} opacity="0.18" stroke={gold} />
        <path
          className="ms-med-star"
          d="M210 150 L228 198 L278 198 L238 228 L254 276 L210 246 L166 276 L182 228 L142 198 L192 198 Z"
          fill={gold}
          opacity="0.85"
          stroke={ink}
          strokeWidth="1.5"
        />
      </g>
    ),
    lamp: (
      <g fill="none" stroke={ink} strokeWidth="2.2" strokeLinecap="round" className={cls}>
        <path className="ms-med-lamp-body" d="M150 150 Q210 120 270 150 L258 250 Q210 290 162 250 Z" fill={gold} opacity="0.2" />
        <path d="M150 150 Q210 120 270 150" />
        <path d="M162 250 Q210 290 258 250" />
        <line x1="210" y1="118" x2="210" y2="92" />
        <circle className="ms-med-flame" cx="210" cy="84" r="9" fill={gold} />
        <path className="ms-med-flame-glow" d="M186 196 q24 -26 48 0" stroke={crim} />
        <circle className="ms-med-pulse" cx="210" cy="210" r="10" fill={crim} opacity="0.7" />
      </g>
    ),
    compass: (
      <g fill="none" stroke={ink} strokeWidth="2" className={cls}>
        <circle className="ms-med-compass-ring" cx="210" cy="210" r="96" stroke={turq} />
        <path className="ms-med-needle ms-med-needle--n" d="M210 124 L232 210 L210 296 L188 210 Z" fill={crim} opacity="0.8" />
        <path className="ms-med-needle ms-med-needle--e" d="M124 210 L210 188 L296 210 L210 232 Z" fill={gold} opacity="0.8" />
        <circle cx="210" cy="210" r="8" fill={ink} />
      </g>
    ),
    question: (
      <g fill="none" stroke={ink} strokeWidth="2.4" strokeLinecap="round" className={cls}>
        <circle className="ms-med-q-ring" cx="210" cy="210" r="92" stroke={gold} opacity="0.6" />
        <path className="ms-med-q-mark" d="M178 178 q0 -42 40 -42 q40 0 40 38 q0 30 -38 40 l0 26" stroke={crim} strokeWidth="9" />
        <circle className="ms-med-q-dot" cx="220" cy="288" r="7" fill={crim} />
      </g>
    ),
    book: (
      <g fill="none" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" className={cls}>
        <path className="ms-med-book-l" d="M210 150 Q160 132 120 146 L120 268 Q160 256 210 272 Z" fill={gold} opacity="0.18" />
        <path className="ms-med-book-r" d="M210 150 Q260 132 300 146 L300 268 Q260 256 210 272 Z" fill={turq} opacity="0.14" />
        <path d="M210 150 L210 272" />
        <path className="ms-med-book-lines" d="M138 176 q40 -10 58 0 M138 200 q40 -10 58 0 M224 176 q40 -10 58 0 M224 200 q40 -10 58 0" strokeWidth="1.4" opacity="0.7" />
      </g>
    ),
    pen: (
      <g fill="none" stroke={ink} strokeWidth="2.2" strokeLinecap="round" className={cls}>
        <path className="ms-med-quill" d="M150 270 L262 158 L284 180 L172 292 L142 298 Z" fill={gold} opacity="0.2" />
        <path d="M150 270 L262 158 L284 180 L172 292 L142 298 Z" />
        <path d="M255 165 L277 187" />
        <path d="M150 270 L162 282" stroke={crim} />
        <path className="ms-med-ink-trail" d="M120 320 q40 -16 90 -4" stroke={turq} strokeWidth="1.6" />
      </g>
    ),
  }[motif]

  return (
    <svg
      className={`ms-medallion ${animated ? 'ms-medallion--live' : ''}`}
      viewBox="0 0 420 420"
      aria-hidden
    >
      {ringAndPetals(animated)}
      {core}
    </svg>
  )
}

export function PageFrame({ animated = false }) {
  return (
    <div className={`ms-frame ${animated ? 'ms-frame--live' : ''}`} aria-hidden>
      <div className="ms-frame-outer" />
      <div className="ms-frame-inner" />
      <span className="ms-corner ms-corner--tr"><CornerArabesque animated={animated} /></span>
      <span className="ms-corner ms-corner--tl"><CornerArabesque animated={animated} /></span>
      <span className="ms-corner ms-corner--br"><CornerArabesque animated={animated} /></span>
      <span className="ms-corner ms-corner--bl"><CornerArabesque animated={animated} /></span>
    </div>
  )
}
