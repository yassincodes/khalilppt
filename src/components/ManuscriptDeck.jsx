import { useEffect, useRef, useState } from 'react'
import { KHALIL_MANUSCRIPT_AUTHOR } from '../data/source.js'
import { CoverSeal, DividerOrnament, PageFrame } from './ManuscriptArt.jsx'
import { AnimatedPen, FadeReveal, ProseLines, ShimmerTitle, WritingReveal } from './ManuscriptAnimations.jsx'
import { StageAura } from './ManuscriptParticles.jsx'
import ManuscriptScene from './ManuscriptScene.jsx'
import './ManuscriptDeck.css'

import { formatPageNum, toWesternDigits } from '../utils/arabicDigits.js'

const WASH = {
  star: 'radial-gradient(ellipse 60% 50% at 28% 40%, rgba(192,137,42,0.16), transparent 70%), radial-gradient(ellipse 50% 60% at 78% 78%, rgba(63,125,125,0.14), transparent 72%)',
  lamp: 'radial-gradient(ellipse 55% 60% at 30% 38%, rgba(192,137,42,0.18), transparent 70%), radial-gradient(ellipse 60% 50% at 80% 70%, rgba(138,47,40,0.10), transparent 72%)',
  compass: 'radial-gradient(ellipse 60% 55% at 26% 46%, rgba(63,125,125,0.18), transparent 70%), radial-gradient(ellipse 50% 50% at 80% 30%, rgba(192,137,42,0.12), transparent 72%)',
  question: 'radial-gradient(ellipse 55% 60% at 30% 42%, rgba(138,47,40,0.14), transparent 70%), radial-gradient(ellipse 55% 55% at 78% 74%, rgba(192,137,42,0.13), transparent 72%)',
  book: 'radial-gradient(ellipse 58% 55% at 28% 44%, rgba(67,39,26,0.14), transparent 70%), radial-gradient(ellipse 55% 55% at 80% 72%, rgba(63,125,125,0.13), transparent 72%)',
  pen: 'radial-gradient(ellipse 55% 60% at 30% 40%, rgba(192,137,42,0.16), transparent 70%), radial-gradient(ellipse 55% 55% at 78% 76%, rgba(138,47,40,0.10), transparent 72%)',
}

export function getManuscriptPage(slide) {
  if (slide?.page && typeof slide.page === 'object') return slide.page
  return {
    kind: slide?.layout === 'cover' ? 'cover' : slide?.layout === 'end' ? 'end' : 'spread',
    motif: slide?.motif || 'star',
    eyebrow: slide?.kicker || '',
    chapter: slide?.chapter || '',
    title: slide?.title || '',
    text: slide?.narration || slide?.body || slide?.subtitle || '',
    pullquote: slide?.highlight || '',
    caption: slide?.caption || '',
    chips: slide?.chapters?.map((c) => ({ label: c.title, hint: c.subtitle })) || slide?.chips,
    stat: slide?.stats?.map((s) => ({ value: String(s.value), label: s.label })) || slide?.stat,
    imageUrl: slide?.page?.imageUrl || slide?.imageUrl || '',
  }
}

function ManuscriptPage({ page, pageNum, animKey, direction, presenting = false }) {
  const wash = WASH[page.motif] || WASH.star
  const isCover = page.kind === 'cover'
  const isEnd = page.kind === 'end'
  const isAuthor = page.kind === 'author'
  const isImage = page.kind === 'image'
  const isChapter = page.kind === 'chapter'
  const writeDur = Math.min(3.2, 1.6 + (page.text?.length ?? 0) * 0.004)

  return (
    <article
      key={animKey}
      className={[
        'ms-page',
        `ms-page--${page.kind}`,
        direction > 0 ? 'ms-page--enter-next' : 'ms-page--enter-prev',
      ].join(' ')}
      style={{ '--ms-wash': wash, '--write-dur': `${writeDur}s` }}
    >
      <PageFrame animated />
      <div className="ms-page-vignette" aria-hidden />

      {isCover && (
        <>
          <div className="ms-col ms-col--text ms-col--center">
            <WritingReveal delay={0.1} duration={1.2} className="ms-seal-wrap">
              <CoverSeal animated />
            </WritingReveal>
            <ShimmerTitle as="h1" delay={0.35} className="ms-title ms-title--cover">
              {page.title}
            </ShimmerTitle>
            <span className="ms-divider ms-divider--in"><DividerOrnament animated /></span>
            <WritingReveal as="p" delay={0.7} duration={writeDur} className="ms-prose">
              {page.text}
            </WritingReveal>
            {page.caption && (
              <WritingReveal as="p" delay={1.1} duration={1.6} className="ms-caption">
                {page.caption}
              </WritingReveal>
            )}
          </div>
          <div className="ms-col ms-col--illus ms-col--bg">
            <ManuscriptScene motif={page.motif} animKey={animKey} kind="cover" />
          </div>
        </>
      )}

      {isEnd && (
        <>
          <div className="ms-col ms-col--illus ms-col--bg">
            <ManuscriptScene motif={page.motif} animKey={animKey} kind="end" />
          </div>
          <div className="ms-col ms-col--text ms-col--center ms-col--writing">
            <AnimatedPen active duration={writeDur + 1} />
            <span className="ms-divider ms-divider--in"><DividerOrnament animated /></span>
            <ShimmerTitle as="h1" delay={0.2} className="ms-title">
              {page.title}
            </ShimmerTitle>
            <WritingReveal as="p" delay={0.5} duration={writeDur} className="ms-prose">
              {page.text}
            </WritingReveal>
            {page.caption && (
              <WritingReveal as="p" delay={0.9} duration={1.4} className="ms-caption">
                {page.caption}
              </WritingReveal>
            )}
            <span className="ms-divider ms-divider--in"><DividerOrnament animated /></span>
          </div>
        </>
      )}

      {isAuthor && (
        <>
          <div className="ms-col ms-col--text ms-col--center">
            <ShimmerTitle as="p" delay={0.1} className="ms-eyebrow ms-eyebrow--author">
              {page.title}
            </ShimmerTitle>
            <span className="ms-divider ms-divider--in"><DividerOrnament animated /></span>
            <ShimmerTitle as="h1" delay={0.35} className="ms-title ms-title--author">
              {page.text}
            </ShimmerTitle>
            {page.caption && (
              <FadeReveal as="p" delay={0.65} duration={0.55} className="ms-caption ms-caption--author">
                {page.caption}
              </FadeReveal>
            )}
          </div>
          <div className="ms-col ms-col--illus ms-col--bg">
            <ManuscriptScene motif={page.motif} animKey={animKey} kind="author" />
          </div>
        </>
      )}

      {isImage && (
        <div className="ms-col ms-col--image">
          {page.imageUrl ? (
            <img className="ms-slide-image" src={page.imageUrl} alt="" />
          ) : (
            <p className="ms-image-placeholder">اسحب صورة في المحرّر</p>
          )}
          {page.caption && <p className="ms-caption ms-caption--image">{page.caption}</p>}
          {pageNum > 0 && (
            <footer className="ms-pagenum ms-pagenum--in">{formatPageNum(pageNum)}</footer>
          )}
        </div>
      )}

      {!isCover && !isEnd && !isAuthor && !isImage && (
        <>
          <div className="ms-col ms-col--text">
            <div className="ms-text-stack">
              {page.eyebrow && (
                <FadeReveal delay={0.05} duration={0.45} className="ms-eyebrow">
                  {page.eyebrow}
                </FadeReveal>
              )}
              {isChapter && page.chapter && (
                <span className="ms-chapter-badge ms-chapter-badge--in ms-chapter-portal">{page.chapter}</span>
              )}
              {page.title && (
                <ShimmerTitle as="h1" delay={0.12} className={`ms-title ${isChapter ? 'ms-title--chapter' : ''}`}>
                  {page.title}
                </ShimmerTitle>
              )}
              {isChapter && <span className="ms-divider ms-divider--in"><DividerOrnament animated /></span>}
              {page.pullquote && (
                <WritingReveal as="p" delay={0.28} duration={1.4} className="ms-pullquote">
                  {page.pullquote}
                </WritingReveal>
              )}
              {page.text && !page.chips?.length && !page.stat?.length && (
                <ProseLines text={page.text} baseDelay={0.38} />
              )}
              {page.text && (page.chips?.length > 0 || page.stat?.length > 0) && (
                <WritingReveal as="p" delay={0.38} duration={writeDur} className="ms-prose">
                  {page.text}
                </WritingReveal>
              )}
              {page.chips?.length > 0 && (
                <ul className="ms-chips">
                  {page.chips.map((c, i) => (
                    <li
                      key={i}
                      className="ms-stagger ms-chip-pop"
                      style={{ '--stagger-i': i, '--stagger-base': '0.55s' }}
                    >
                      <strong>{c.label}</strong>
                      {c.hint && <span>{c.hint}</span>}
                    </li>
                  ))}
                </ul>
              )}
              {page.stat?.length > 0 && (
                <div className="ms-stats">
                  {page.stat.map((s, i) => (
                    <div
                      key={i}
                      className="ms-stat ms-stagger ms-stat-pop"
                      style={{ '--stagger-i': i, '--stagger-base': '0.6s' }}
                    >
                      <span className="ms-stat-v">{s.value}</span>
                      <span className="ms-stat-l">{s.label}</span>
                    </div>
                  ))}
                </div>
              )}
              {page.caption && (
                <FadeReveal as="p" delay={0.75} duration={0.5} className="ms-caption">
                  {page.caption}
                </FadeReveal>
              )}
            </div>
            {pageNum > 0 && (
              <footer className="ms-pagenum ms-pagenum--in">{formatPageNum(pageNum)}</footer>
            )}
          </div>
          <div className="ms-col ms-col--illus">
            <ManuscriptScene motif={page.motif || 'star'} animKey={animKey} kind={page.kind} />
          </div>
        </>
      )}
    </article>
  )
}

/** Ottoman manuscript reader — full thesis · pen animations · page turns */
export default function ManuscriptDeck({
  slide,
  slides = [],
  index = 0,
  total = 1,
  author = KHALIL_MANUSCRIPT_AUTHOR,
  presenting = false,
  exportMode = false,
  onPrev,
  onNext,
  transitionKey,
}) {
  const page = getManuscriptPage(slide)
  const pageNum = index + 1
  const prevIndex = useRef(index)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    setDirection(index >= prevIndex.current ? 1 : -1)
    prevIndex.current = index
  }, [transitionKey ?? slide?.id, index])

  const deckTitle = slides[0]?.page?.title || slides[0]?.title || 'مخطوطة'

  return (
    <div
      className={[
        'ms-deck',
        'ms-deck--cinema',
        exportMode ? 'ms-deck--export' : '',
        presenting ? 'ms-deck--present' : '',
        direction > 0 ? 'ms-deck--dir-next' : 'ms-deck--dir-prev',
      ].join(' ')}
      dir="rtl"
      lang="ar"
    >
      {presenting && !exportMode && (
        <header className="ms-toolbar">
          <span className="ms-toolbar-title">{deckTitle}</span>
          <span className="ms-toolbar-author">{author}</span>
          <span className="ms-toolbar-page">
            {formatPageNum(pageNum)} / {formatPageNum(total)}
          </span>
        </header>
      )}

      {!exportMode && <StageAura presenting={presenting} />}
      <div className="ms-stage">
        <div className="ms-book-shadow" aria-hidden />
        <div className="ms-book">
          <ManuscriptPage
            page={page}
            pageNum={pageNum}
            animKey={`${slide?.id}-${index}`}
            direction={direction}
            presenting={presenting}
          />
        </div>
      </div>

      {presenting && !exportMode && (
        <div className="ms-progress" aria-hidden>
          <span className="ms-progress-fill" style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
      )}

      {presenting && !exportMode && (
        <nav className="ms-nav" aria-label="تصفح المخطوطة">
          <button
            type="button"
            className="ms-nav-btn"
            disabled={index <= 0}
            onClick={onPrev}
            aria-label="الصفحة السابقة"
          >
            ›
          </button>
          <div className="ms-dots">
            {Array.from({ length: Math.min(total, 20) }, (_, i) => {
              const dotIdx =
                total <= 20
                  ? i
                  : Math.floor((i / 19) * (total - 1))
              return (
                <span
                  key={i}
                  className={`ms-dot ${dotIdx === index ? 'ms-dot--on' : ''}`}
                />
              )
            })}
          </div>
          <button
            type="button"
            className="ms-nav-btn"
            disabled={index >= total - 1}
            onClick={onNext}
            aria-label="الصفحة التالية"
          >
            ‹
          </button>
        </nav>
      )}
    </div>
  )
}

export function useManuscriptDeck(deck) {
  return Boolean(deck?.presentation === 'manuscript' || deck?.manuscript)
}

export function manuscriptAuthor(deck) {
  return deck?.source?.displayName || deck?.source?.author || KHALIL_MANUSCRIPT_AUTHOR
}
