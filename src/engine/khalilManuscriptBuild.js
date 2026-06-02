/**
 * Build manuscript pages from the full Khalil thesis deck (~38 pages).
 * Voice: Khalil presenting HIS work — first person.
 */
import { KHALIL_FULL_SLIDES } from '../data/khalil-full-deck.js'
import { KHALIL_SOURCE } from '../data/source.js'
import { toWesternDigits } from '../utils/arabicDigits.js'

const SCENE_MOTIF = {
  hero: 'star',
  gold: 'star',
  welcome: 'lamp',
  thanks: 'star',
  violet: 'compass',
  teal: 'compass',
  chart: 'compass',
  digital: 'pen',
  story: 'pen',
  ink: 'pen',
  books: 'book',
  paper: 'book',
  classroom: 'lamp',
  rose: 'question',
}

function motifFor(slide) {
  return SCENE_MOTIF[slide.scene] || 'star'
}

function kindFor(slide) {
  if (slide.layout === 'thanks') return 'end'
  if (slide.layout === 'author') return 'author'
  if (slide.layout === 'section') return 'chapter'
  if (slide.layout === 'cinematic' && slide.scene === 'hero') return 'cover'
  return 'spread'
}

/** Primary body — one voice, no duplicate subtitle+body mashups */
function textFor(slide, kind) {
  if (kind === 'author') return slide.body || slide.subtitle || ''
  if (kind === 'cover') return slide.subtitle || ''
  if (slide.layout === 'quote') return ''
  if (slide.layout === 'story') return slide.narration || slide.body || ''
  if (slide.layout === 'plan') return slide.subtitle || slide.narration || ''
  if (slide.layout === 'welcome') return slide.narration || slide.subtitle || ''
  if (slide.layout === 'glass') return slide.body || slide.highlight || ''
  if (slide.layout === 'data') return slide.subtitle || slide.body || ''
  if (slide.layout === 'elements') return slide.subtitle || ''
  return slide.body || slide.narration || slide.subtitle || ''
}

function chipsFor(slide) {
  if (slide.chips?.length) {
    return slide.chips.map((c) => ({
      label: c.label,
      hint: c.hint,
    }))
  }
  if (slide.chapters?.length) {
    return slide.chapters.map((c) => ({
      label: c.title,
      hint: c.subtitle,
    }))
  }
  if (slide.storyElements?.length) {
    return slide.storyElements.map((e) => ({
      label: e.label,
      hint: e.icon,
    }))
  }
  if (slide.bullets?.length) {
    return slide.bullets.map((b) => ({ label: b }))
  }
  return undefined
}

function statsFor(slide) {
  if (!slide.stats?.length) return undefined
  return slide.stats.map((s) => ({
    value: `${s.value}${s.suffix ?? ''}`,
    label: s.note ? `${s.label} — ${s.note}` : s.label,
  }))
}

function eyebrowFor(slide) {
  const k = (slide.kicker || '').trim()
  const t = (slide.title || '').trim()
  if (!k) return ''
  if (!t) return k
  // avoid duplicate header when kicker ≈ title
  const norm = (s) => s.replace(/\s+/g, ' ').replace(/[·•]/g, ' ')
  const kn = norm(k)
  const tn = norm(t)
  if (tn === kn || tn.startsWith(kn) || kn.startsWith(tn)) return ''
  if (kn.split(' ').every((w) => w.length < 3 || tn.includes(w))) return ''
  return k
}

function westernizePage(page) {
  const w = (s) => (s ? toWesternDigits(s) : s)
  page.eyebrow = w(page.eyebrow)
  page.chapter = w(page.chapter)
  page.title = w(page.title)
  page.text = w(page.text)
  page.pullquote = w(page.pullquote)
  page.caption = w(page.caption)
  if (page.chips) {
    page.chips = page.chips.map((c) => ({
      label: w(c.label),
      hint: c.hint ? w(c.hint) : c.hint,
    }))
  }
  if (page.stat) {
    page.stat = page.stat.map((s) => ({
      value: w(s.value),
      label: w(s.label),
    }))
  }
  return page
}

export function buildManuscriptPagesFromFullDeck() {
  return KHALIL_FULL_SLIDES.map((slide) => {
    const kind = kindFor(slide)
    const page = {
      id: `ms-${slide.id}`,
      kind,
      motif: motifFor(slide),
      eyebrow: eyebrowFor(slide),
      chapter: kind === 'chapter' ? (slide.kicker || slide.title) : '',
      title: slide.title || '',
      text: textFor(slide, kind),
      pullquote: slide.highlight || '',
      caption: '',
      chips: chipsFor(slide),
      stat: statsFor(slide),
    }

    if (kind === 'cover') {
      page.caption = `${KHALIL_SOURCE.author} — ${KHALIL_SOURCE.school} · ${KHALIL_SOURCE.delegation}`
    }

    if (kind === 'end') {
      page.text = [slide.narration, slide.subtitle, ...(slide.bullets ?? [])]
        .filter(Boolean)
        .join(' · ')
      page.caption = KHALIL_SOURCE.author
    }

    if (slide.layout === 'quote') {
      page.pullquote = slide.highlight || slide.title
      page.title = slide.title
    }

    if (slide.layout === 'glass') {
      if (!page.chips?.length && slide.bullets?.length) {
        page.chips = slide.bullets.map((b) => ({ label: b }))
      }
      if (slide.highlight && !page.text) page.text = slide.highlight
    }

    if (slide.layout === 'data' && slide.subtitle) {
      page.caption = slide.subtitle
    }

    if (slide.layout === 'story' && slide.highlight) {
      page.caption = slide.highlight
    }

    if (slide.caption) {
      page.caption = slide.caption
    }

    return westernizePage(page)
  })
}

export const KHALIL_MANUSCRIPT_PAGE_COUNT = KHALIL_FULL_SLIDES.length
