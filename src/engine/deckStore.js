/**
 * Deck persistence — localStorage + JSON export/import
 */
import { buildManuscriptPagesFromFullDeck } from './khalilManuscriptBuild.js'

const STORAGE_KEY = 'khalilppt-deck-v2'

export function seedPages() {
  return buildManuscriptPagesFromFullDeck()
}

export function loadPages() {
  if (typeof window === 'undefined') return seedPages()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedPages()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || !parsed.length) return seedPages()
    return parsed
  } catch {
    return seedPages()
  }
}

export function savePages(pages) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pages))
}

export function resetPages() {
  const fresh = seedPages()
  savePages(fresh)
  return fresh
}

export function pagesToSlides(pages) {
  return pages.map((page) => ({
    id: page.id,
    layout: page.kind === 'image' ? 'image' : 'manuscript',
    title: page.title ?? '',
    body: page.text ?? '',
    caption: page.caption ?? '',
    page,
  }))
}

export function newPageId() {
  return `ms-${Date.now().toString(36)}`
}

export function newTextPage() {
  return {
    id: newPageId(),
    kind: 'spread',
    motif: 'star',
    eyebrow: '',
    chapter: '',
    title: 'عنوان جديد',
    text: 'نص الشريحة…',
    pullquote: '',
    caption: '',
    chips: undefined,
    stat: undefined,
    imageUrl: '',
  }
}

export function newImagePage(imageUrl = '') {
  return {
    id: newPageId(),
    kind: 'image',
    motif: 'star',
    eyebrow: '',
    chapter: '',
    title: '',
    text: '',
    pullquote: '',
    caption: '',
    imageUrl,
  }
}

export function formatChips(chips) {
  if (!chips?.length) return ''
  return chips.map((c) => (c.hint ? `${c.label} | ${c.hint}` : c.label)).join('\n')
}

export function parseChips(text) {
  const lines = String(text)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  if (!lines.length) return undefined
  return lines.map((line) => {
    const [label, ...rest] = line.split('|')
    const hint = rest.join('|').trim()
    return { label: label.trim(), hint: hint || undefined }
  })
}

export function formatStats(stat) {
  if (!stat?.length) return ''
  return stat.map((s) => `${s.value} | ${s.label}`).join('\n')
}

export function parseStats(text) {
  const lines = String(text)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  if (!lines.length) return undefined
  return lines.map((line) => {
    const [value, ...rest] = line.split('|')
    return { value: value.trim(), label: rest.join('|').trim() }
  })
}

export function readImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file?.type?.startsWith('image/')) {
      reject(new Error('Not an image'))
      return
    }
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function downloadJson(pages, filename = 'khalil-deck.json') {
  const blob = new Blob([JSON.stringify(pages, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function importJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        if (!Array.isArray(data)) throw new Error('Invalid deck file')
        resolve(data)
      } catch (e) {
        reject(e)
      }
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}
