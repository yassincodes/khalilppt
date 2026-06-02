import { useEffect, useState } from 'react'

/** Animated quill — tracks the active writing block */
export function AnimatedPen({ active, duration = 2.6, className = '' }) {
  if (!active) return null
  return (
    <svg
      className={`ms-pen ${className}`.trim()}
      viewBox="0 0 48 48"
      aria-hidden
      style={{ '--pen-dur': `${duration}s` }}
    >
      <g fill="none" stroke="#43271a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 40 L38 10 L42 14 L12 44 L4 46 Z" fill="#c0892a" fillOpacity="0.35" />
        <path d="M8 40 L38 10 L42 14 L12 44 L4 46 Z" />
        <path d="M36 12 L40 16" />
        <path d="M8 40 L12 44" stroke="#8a2f28" />
      </g>
    </svg>
  )
}

/** Fade / slide — headings & labels (no clip-path clipping) */
export function FadeReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.55,
  as: Tag = 'div',
}) {
  const [key, setKey] = useState(0)
  useEffect(() => {
    setKey((k) => k + 1)
  }, [children])

  return (
    <Tag
      key={key}
      className={`ms-fade ${className}`}
      style={{
        '--fade-delay': `${delay}s`,
        '--fade-dur': `${duration}s`,
      }}
    >
      {children}
    </Tag>
  )
}

/** RTL ink reveal — body text only */
export function WritingReveal({
  children,
  className = '',
  delay = 0,
  duration = 2.4,
  as: Tag = 'div',
}) {
  const [key, setKey] = useState(0)
  useEffect(() => {
    setKey((k) => k + 1)
  }, [children])

  return (
    <Tag
      key={key}
      className={`ms-write ${className}`}
      style={{
        '--write-delay': `${delay}s`,
        '--write-dur': `${duration}s`,
      }}
    >
      <span className="ms-write-inner">{children}</span>
      <span className="ms-write-ink" aria-hidden />
    </Tag>
  )
}

/** Title entrance — one-time fade, no sweeping overlay on text */
export function ShimmerTitle({
  children,
  className = '',
  delay = 0,
  as: Tag = 'h1',
}) {
  const [key, setKey] = useState(0)
  useEffect(() => {
    setKey((k) => k + 1)
  }, [children])

  return (
    <Tag
      key={key}
      className={`ms-shimmer-title ${className}`}
      style={{ '--shimmer-delay': `${delay}s` }}
    >
      {children}
    </Tag>
  )
}

/** Staggered lines from prose split on · or newline */
export function ProseLines({ text, baseDelay = 0.5, lineDelay = 0.18 }) {
  if (!text) return null
  const lines = String(text)
    .split(/\s*·\s*|\n+/)
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length <= 1) {
    return (
      <div className="ms-prose-block">
        <AnimatedPen active className="ms-pen--prose" duration={2.4} />
        <WritingReveal as="p" delay={baseDelay} duration={2.2} className="ms-prose">
          {text}
        </WritingReveal>
      </div>
    )
  }

  return (
    <div className="ms-prose-block ms-prose-block--lines">
      <AnimatedPen active className="ms-pen--lines" duration={lines.length * lineDelay + 1.2} />
      <ul className="ms-prose-lines">
        {lines.map((line, i) => (
          <li
            key={i}
            className="ms-prose-line ms-stagger"
            style={{ '--stagger-i': i, '--stagger-base': `${baseDelay}s`, '--line-step': lineDelay }}
          >
            {line}
          </li>
        ))}
      </ul>
    </div>
  )
}
