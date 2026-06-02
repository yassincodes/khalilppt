/**
 * ═══════════════════════════════════════════════════════════════════════════
 * KHALIL SLIDE SHOW — standalone fullscreen presenter (copy-friendly)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Run: yarn dev → http://localhost:5173
 *
 * TO COPY INTO ANOTHER PROJECT you need either:
 *
 *   A) Full manuscript look (same as MYK Present mode)
 *      - This file
 *      - ../components/desktop/ManuscriptDeck.jsx (+ ManuscriptArt, Animations,
 *        Particles, Scene, ManuscriptDeck.css)
 *      - ../engine/khalilManuscriptBuild.js + ../data/khalil-full-deck.js
 *
 *   B) Minimal fork: replace buildSlides() below with your own array of pages:
 *      { id, kind: 'cover'|'author'|'spread'|'chapter'|'end',
 *        title, text, caption, eyebrow, chapter, pullquote,
 *        chips: [{ label, hint }], stat: [{ value, label }] }
 *      and set USE_MANUSCRIPT_RENDERER = false to use the simple SlideCard UI
 *      (all styles are in the <style> block at the bottom of this file).
 *
 * Keyboard: ← → Space · Home · End · Esc exits fullscreen
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import ManuscriptDeck, { getManuscriptPage } from './components/ManuscriptDeck.jsx'
import { loadPages, pagesToSlides } from './engine/deckStore.js'
import { KHALIL_SOURCE } from './data/source.js'
import './components/ManuscriptDeck.css'

/** Set false to use the lightweight SlideCard renderer (no ManuscriptDeck deps). */
const USE_MANUSCRIPT_RENDERER = true

// ─── Slides from localStorage (edited in /edit) or default thesis ───────────
export function buildSlides() {
  return pagesToSlides(loadPages())
}

// ─── Simple renderer (copy-only mode — no extra component files) ─────────────
function SlideCard({ page }) {
  const kind = page.kind || 'spread'
  const isCentered = kind === 'cover' || kind === 'author' || kind === 'end'

  return (
    <article className={`kss-page kss-page--${kind}`}>
      <div className="kss-frame" aria-hidden />
      <div className={`kss-body ${isCentered ? 'kss-body--center' : 'kss-body--split'}`}>
        <div className="kss-text">
          {page.eyebrow && <p className="kss-eyebrow">{page.eyebrow}</p>}
          {kind === 'chapter' && page.chapter && (
            <span className="kss-chapter">{page.chapter}</span>
          )}
          {page.title && <h1 className="kss-title">{page.title}</h1>}
          {page.pullquote && <p className="kss-quote">{page.pullquote}</p>}
          {page.text && <p className="kss-prose">{page.text}</p>}
          {page.chips?.length > 0 && (
            <ul className="kss-chips">
              {page.chips.map((c, i) => (
                <li key={i}>
                  <strong>{c.label}</strong>
                  {c.hint && <span>{c.hint}</span>}
                </li>
              ))}
            </ul>
          )}
          {page.stat?.length > 0 && (
            <div className="kss-stats">
              {page.stat.map((s, i) => (
                <div key={i} className="kss-stat">
                  <span className="kss-stat-v">{s.value}</span>
                  <span className="kss-stat-l">{s.label}</span>
                </div>
              ))}
            </div>
          )}
          {page.caption && <p className="kss-caption">{page.caption}</p>}
        </div>
        {!isCentered && <div className="kss-art" aria-hidden />}
      </div>
    </article>
  )
}

// ─── Presenter shell ─────────────────────────────────────────────────────────
export default function KhalilSlideShow({
  slides: slidesProp,
  author = KHALIL_SOURCE.displayName || KHALIL_SOURCE.author,
  title: deckTitle,
}) {
  const slides = useMemo(() => slidesProp ?? buildSlides(), [slidesProp])
  const total = slides.length
  const resolvedTitle =
    deckTitle || slides[0]?.page?.title || slides[0]?.title || 'عرض'

  const [index, setIndex] = useState(0)
  const slide = slides[index]

  const go = useCallback(
    (delta) => {
      setIndex((i) => Math.max(0, Math.min(total - 1, i + delta)))
    },
    [total],
  )

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        go(1)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        go(-1)
      } else if (e.key === 'Home') {
        e.preventDefault()
        setIndex(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        setIndex(total - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, total])

  const page = slide?.page ?? (slide ? getManuscriptPage(slide) : null)
  const progress = total ? ((index + 1) / total) * 100 : 0

  return (
    <div className="kss-root" dir="rtl" lang="ar">
      <header className="kss-toolbar">
        <span className="kss-toolbar-title">{resolvedTitle}</span>
        <span className="kss-toolbar-author">{author}</span>
        <span className="kss-toolbar-page">
          {index + 1} / {total}
        </span>
      </header>

      <main className="kss-stage">
        {USE_MANUSCRIPT_RENDERER ? (
          <ManuscriptDeck
            slide={slide}
            slides={slides}
            index={index}
            total={total}
            author={author}
            presenting={false}
            onPrev={() => go(-1)}
            onNext={() => go(1)}
            transitionKey={`${slide?.id}-${index}`}
          />
        ) : (
          page && <SlideCard page={page} />
        )}
      </main>

      <div className="kss-progress" aria-hidden>
        <span style={{ width: `${progress}%` }} />
      </div>

      <nav className="kss-nav" aria-label="تصفح الشرائح">
        <button type="button" disabled={index <= 0} onClick={() => go(-1)} aria-label="السابق">
          ›
        </button>
        <div className="kss-dots">
          {Array.from({ length: Math.min(total, 24) }, (_, i) => {
            const dotIdx =
              total <= 24 ? i : Math.floor((i / 23) * (total - 1))
            return (
              <button
                key={i}
                type="button"
                className={`kss-dot ${dotIdx === index ? 'kss-dot--on' : ''}`}
                onClick={() => setIndex(dotIdx)}
                aria-label={`شريحة ${dotIdx + 1}`}
              />
            )
          })}
        </div>
        <button
          type="button"
          disabled={index >= total - 1}
          onClick={() => go(1)}
          aria-label="التالي"
        >
          ‹
        </button>
      </nav>

      <KhalilSlideShowStyles />
    </div>
  )
}

function KhalilSlideShowStyles() {
  return (
    <style>{`
      .kss-root {
        position: fixed;
        inset: 0;
        z-index: 1;
        display: flex;
        flex-direction: column;
        background: radial-gradient(ellipse at 50% 15%, #2a2018 0%, #0d0907 100%);
        color: #f1e4c7;
        font-family: 'Amiri', 'Segoe UI', serif;
        overflow: hidden;
      }
      .kss-toolbar {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 16px;
        background: rgba(20, 12, 7, 0.85);
        border-bottom: 1px solid rgba(228, 178, 78, 0.25);
      }
      .kss-toolbar-title {
        flex: 1;
        font-family: 'Reem Kufi', sans-serif;
        font-size: 14px;
        font-weight: 700;
        color: #fbf3df;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .kss-toolbar-author { font-size: 12px; color: rgba(228, 178, 78, 0.7); }
      .kss-toolbar-page {
        font-family: 'Reem Kufi', sans-serif;
        font-size: 13px;
        color: #e4b24e;
      }
      .kss-stage {
        flex: 1;
        min-height: 0;
        position: relative;
      }
      .kss-stage .ms-deck {
        width: 100%;
        height: 100%;
      }
      .kss-progress {
        flex-shrink: 0;
        height: 3px;
        background: rgba(228, 178, 78, 0.15);
      }
      .kss-progress span {
        display: block;
        height: 100%;
        background: linear-gradient(90deg, #c0892a, #e4b24e);
        transition: width 0.25s ease;
      }
      .kss-nav {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        padding: 10px 16px 14px;
      }
      .kss-nav > button {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 1px solid rgba(228, 178, 78, 0.45);
        background: rgba(228, 178, 78, 0.12);
        color: #e4b24e;
        font-size: 20px;
        cursor: pointer;
      }
      .kss-nav > button:disabled { opacity: 0.35; cursor: default; }
      .kss-dots { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; max-width: 50vw; }
      .kss-dot {
        width: 8px;
        height: 8px;
        padding: 0;
        border: none;
        border-radius: 50%;
        background: rgba(228, 178, 78, 0.3);
        cursor: pointer;
      }
      .kss-dot--on { background: #e4b24e; transform: scale(1.25); }

      /* Simple SlideCard (USE_MANUSCRIPT_RENDERER = false) */
      .kss-page {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        box-sizing: border-box;
      }
      .kss-frame {
        position: absolute;
        inset: 20px;
        border: 2px solid #43271a;
        border-radius: 4px;
        pointer-events: none;
      }
      .kss-body {
        position: relative;
        width: min(100%, 1100px);
        height: min(100%, 620px);
        background: linear-gradient(135deg, #fbf3df 0%, #f1e4c7 50%, #e8d7b3 100%);
        border-radius: 6px;
        box-shadow: 0 24px 60px rgba(0,0,0,0.45);
        overflow: hidden;
      }
      .kss-body--center { display: flex; align-items: center; justify-content: center; }
      .kss-body--split { display: grid; grid-template-columns: 1.1fr 0.9fr; }
      .kss-text {
        padding: 8%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 10px;
        color: #43271a;
        overflow-y: auto;
      }
      .kss-art {
        background: radial-gradient(ellipse at 40% 40%, rgba(192,137,42,0.2), transparent 70%),
          radial-gradient(ellipse at 70% 70%, rgba(63,125,125,0.15), transparent 70%);
        border-right: 1px dashed rgba(67,39,26,0.25);
      }
      .kss-eyebrow {
        font-family: 'Reem Kufi', sans-serif;
        font-size: 12px;
        font-weight: 600;
        color: #3f7d7d;
        margin: 0;
      }
      .kss-chapter {
        font-family: 'Reem Kufi', sans-serif;
        font-size: 13px;
        font-weight: 700;
        background: #43271a;
        color: #fbf3df;
        padding: 4px 14px;
        border-radius: 2px;
      }
      .kss-title {
        font-family: 'Reem Kufi', sans-serif;
        font-size: clamp(20px, 3.5vw, 36px);
        font-weight: 700;
        margin: 0;
        line-height: 1.3;
      }
      .kss-page--author .kss-title { font-size: clamp(14px, 2vw, 18px); color: #3f7d7d; }
      .kss-page--author .kss-prose {
        font-size: clamp(28px, 5vw, 48px);
        font-weight: 700;
      }
      .kss-quote {
        font-size: 16px;
        font-weight: 700;
        color: #c0892a;
        margin: 0;
      }
      .kss-prose {
        font-size: clamp(13px, 2vw, 16px);
        line-height: 1.75;
        margin: 0;
        max-width: 42em;
      }
      .kss-caption { font-size: 12px; color: #5c4a3a; margin: 0; }
      .kss-chips {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
        max-width: 28em;
      }
      .kss-chips li {
        padding: 8px 12px;
        background: rgba(67,39,26,0.06);
        border-radius: 4px;
        text-align: right;
      }
      .kss-chips strong { display: block; font-family: 'Reem Kufi', sans-serif; }
      .kss-chips span { font-size: 12px; color: #5c4a3a; }
      .kss-stats { display: flex; flex-wrap: wrap; gap: 16px; justify-content: center; }
      .kss-stat { text-align: center; }
      .kss-stat-v {
        display: block;
        font-family: 'Reem Kufi', sans-serif;
        font-size: 28px;
        font-weight: 700;
        color: #c0892a;
      }
      .kss-stat-l { font-size: 11px; color: #5c4a3a; }
    `}</style>
  )
}
