import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ManuscriptDeck from '../components/ManuscriptDeck.jsx'
import { KHALIL_SOURCE } from '../data/source.js'
import {
  downloadJson,
  formatChips,
  formatStats,
  importJsonFile,
  loadPages,
  newImagePage,
  newPageId,
  newTextPage,
  parseChips,
  parseStats,
  readImageFile,
  resetPages,
  savePages,
} from '../engine/deckStore.js'
import '../components/ManuscriptDeck.css'
import './DeckEditor.css'

const KINDS = [
  { id: 'spread', label: 'صفحة عادية' },
  { id: 'cover', label: 'غلاف' },
  { id: 'author', label: 'من إعداد' },
  { id: 'chapter', label: 'فصل' },
  { id: 'end', label: 'خاتمة' },
  { id: 'image', label: 'صورة' },
]

const MOTIFS = ['star', 'lamp', 'compass', 'question', 'book', 'pen']

function patchPage(pages, index, patch) {
  return pages.map((p, i) => (i === index ? { ...p, ...patch } : p))
}

export default function DeckEditor() {
  const [pages, setPages] = useState(() => loadPages())
  const [index, setIndex] = useState(0)
  const [savedAt, setSavedAt] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [toast, setToast] = useState('')
  const importRef = useRef(null)
  const saveTimer = useRef(null)

  const page = pages[index]
  const slides = useMemo(
    () =>
      pages.map((p) => ({
        id: p.id,
        layout: p.kind === 'image' ? 'image' : 'manuscript',
        page: p,
      })),
    [pages],
  )

  const persist = useCallback((next) => {
    setPages(next)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      savePages(next)
      setSavedAt(new Date())
    }, 400)
  }, [])

  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
  }, [])

  const updateField = (field, value) => {
    if (!page) return
    persist(patchPage(pages, index, { [field]: value }))
  }

  const updatePage = (patch) => {
    if (!page) return
    persist(patchPage(pages, index, patch))
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2400)
  }

  const addTextSlide = () => {
    const next = [...pages, newTextPage()]
    persist(next)
    setIndex(next.length - 1)
  }

  const addImageSlide = async (file) => {
    try {
      const url = await readImageFile(file)
      if (url.length > 4_500_000) {
        showToast('الصورة كبيرة جداً — جرّب صورة أصغر')
        return
      }
      const next = [...pages, newImagePage(url)]
      persist(next)
      setIndex(next.length - 1)
      showToast('تمت إضافة شريحة صورة')
    } catch {
      showToast('تعذّر تحميل الصورة')
    }
  }

  const onDrop = async (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) await addImageSlide(file)
  }

  const replaceImage = async (file) => {
    try {
      const url = await readImageFile(file)
      updatePage({ imageUrl: url, kind: 'image' })
      showToast('تم تحديث الصورة')
    } catch {
      showToast('تعذّر تحميل الصورة')
    }
  }

  const moveSlide = (delta) => {
    const j = index + delta
    if (j < 0 || j >= pages.length) return
    const next = [...pages]
    ;[next[index], next[j]] = [next[j], next[index]]
    persist(next)
    setIndex(j)
  }

  const duplicateSlide = () => {
    if (!page) return
    const copy = { ...page, id: newPageId() }
    const next = [...pages.slice(0, index + 1), copy, ...pages.slice(index + 1)]
    persist(next)
    setIndex(index + 1)
  }

  const deleteSlide = () => {
    if (pages.length <= 1) return
    if (!window.confirm('حذف هذه الشريحة؟')) return
    const next = pages.filter((_, i) => i !== index)
    persist(next)
    setIndex(Math.min(index, next.length - 1))
  }

  const handleReset = () => {
    if (!window.confirm('إعادة المحتوى الأصلي؟ سيتم فقدان التعديلات المحفوظة.')) return
    const fresh = resetPages()
    setPages(fresh)
    setIndex(0)
    showToast('تمت إعادة التعيين')
  }

  const handleExport = () => {
    downloadJson(pages)
    showToast('تم تنزيل JSON')
  }

  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const data = await importJsonFile(file)
      persist(data)
      setIndex(0)
      showToast('تم استيراد العرض')
    } catch {
      showToast('ملف غير صالح')
    }
    e.target.value = ''
  }

  if (!page) {
    return (
      <div className="ked-root">
        <p>لا توجد شرائح</p>
      </div>
    )
  }

  return (
    <div className="ked-root" dir="rtl" lang="ar">
      <header className="ked-top">
        <div className="ked-brand">
          <span className="ked-brand-mark">✦</span>
          <div>
            <strong>محرّر المخطوطة</strong>
            <span className="ked-brand-sub">خليل · {pages.length} شريحة</span>
          </div>
        </div>
        <div className="ked-top-actions">
          <span className="ked-save-pill">
            {savedAt ? `محفوظ ${savedAt.toLocaleTimeString('ar-TN', { hour: '2-digit', minute: '2-digit' })}` : 'يحفظ تلقائياً'}
          </span>
          <button type="button" className="ked-btn ked-btn--ghost" onClick={handleExport}>
            تصدير JSON
          </button>
          <button type="button" className="ked-btn ked-btn--ghost" onClick={() => importRef.current?.click()}>
            استيراد
          </button>
          <input ref={importRef} type="file" accept=".json,application/json" hidden onChange={handleImport} />
          <button type="button" className="ked-btn ked-btn--ghost" onClick={handleReset}>
            إعادة تعيين
          </button>
          <Link to="/" className="ked-btn ked-btn--gold">
            ▶ عرض
          </Link>
        </div>
      </header>

      {toast && <div className="ked-toast">{toast}</div>}

      <div className="ked-body">
        <aside className="ked-rail">
          <div className="ked-rail-head">
            <span>الشرائح</span>
            <button type="button" className="ked-btn-icon" onClick={addTextSlide} title="شريحة نص">
              +
            </button>
          </div>
          <div
            className={`ked-drop ${dragOver ? 'ked-drop--on' : ''}`}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
          >
            <span>أفلت صورة هنا</span>
            <small>شريحة صورة جديدة</small>
          </div>
          <ul className="ked-film">
            {pages.map((p, i) => (
              <li key={p.id}>
                <button
                  type="button"
                  className={`ked-film-item ${i === index ? 'ked-film-item--on' : ''}`}
                  onClick={() => setIndex(i)}
                >
                  <span className="ked-film-n">{i + 1}</span>
                  {p.kind === 'image' && p.imageUrl ? (
                    <span className="ked-film-thumb" style={{ backgroundImage: `url(${p.imageUrl})` }} />
                  ) : (
                    <span className="ked-film-kind">{p.kind}</span>
                  )}
                  <span className="ked-film-t">{(p.title || p.text || 'صورة').slice(0, 22)}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="ked-preview">
          <div className="ked-preview-frame">
            <ManuscriptDeck
              slide={slides[index]}
              slides={slides}
              index={index}
              total={pages.length}
              author={KHALIL_SOURCE.displayName}
              presenting={false}
              exportMode
              transitionKey={`edit-${page.id}`}
            />
          </div>
          <div className="ked-preview-nav">
            <button type="button" disabled={index <= 0} onClick={() => setIndex((i) => i - 1)}>
              ›
            </button>
            <span>
              {index + 1} / {pages.length}
            </span>
            <button type="button" disabled={index >= pages.length - 1} onClick={() => setIndex((i) => i + 1)}>
              ‹
            </button>
          </div>
        </section>

        <aside className="ked-form">
          <h2 className="ked-form-title">تحرير الشريحة {index + 1}</h2>

          <div className="ked-row ked-row--2">
            <label>
              النوع
              <select
                value={page.kind}
                onChange={(e) => updateField('kind', e.target.value)}
              >
                {KINDS.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              الزخرفة
              <select value={page.motif || 'star'} onChange={(e) => updateField('motif', e.target.value)}>
                {MOTIFS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {page.kind === 'image' ? (
            <div className="ked-image-block">
              <div
                className="ked-image-drop"
                onDragOver={(e) => e.preventDefault()}
                onDrop={async (e) => {
                  e.preventDefault()
                  const f = e.dataTransfer.files?.[0]
                  if (f) await replaceImage(f)
                }}
              >
                {page.imageUrl ? (
                  <img src={page.imageUrl} alt="" />
                ) : (
                  <span>اسحب صورة أو اختر ملفاً</span>
                )}
              </div>
              <label className="ked-file">
                تغيير الصورة
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const f = e.target.files?.[0]
                    if (f) await replaceImage(f)
                    e.target.value = ''
                  }}
                />
              </label>
            </div>
          ) : null}

          <label>
            العنوان الفرعي (eyebrow)
            <input value={page.eyebrow || ''} onChange={(e) => updateField('eyebrow', e.target.value)} />
          </label>

          {page.kind === 'chapter' && (
            <label>
              شارة الفصل
              <input value={page.chapter || ''} onChange={(e) => updateField('chapter', e.target.value)} />
            </label>
          )}

          <label>
            العنوان
            <input value={page.title || ''} onChange={(e) => updateField('title', e.target.value)} />
          </label>

          {page.kind !== 'image' && (
            <>
              <label>
                النص الرئيسي
                <textarea
                  rows={6}
                  value={page.text || ''}
                  onChange={(e) => updateField('text', e.target.value)}
                />
              </label>
              <label>
                اقتباس مميّز
                <input value={page.pullquote || ''} onChange={(e) => updateField('pullquote', e.target.value)} />
              </label>
              <label>
                نقاط / فهرس (سطر لكل نقطة — استخدم | للتفصيل)
                <textarea
                  rows={4}
                  value={formatChips(page.chips)}
                  onChange={(e) => updateField('chips', parseChips(e.target.value))}
                  placeholder={'الإطار المنهجي | المقدمة…'}
                />
              </label>
              <label>
                إحصائيات (قيمة | وصف)
                <textarea
                  rows={3}
                  value={formatStats(page.stat)}
                  onChange={(e) => updateField('stat', parseStats(e.target.value))}
                  placeholder={'80 | معلمون'}
                />
              </label>
            </>
          )}

          <label>
            تعليق أسفل الشريحة
            <input value={page.caption || ''} onChange={(e) => updateField('caption', e.target.value)} />
          </label>

          <div className="ked-form-actions">
            <button type="button" className="ked-btn ked-btn--ghost" onClick={() => moveSlide(-1)} disabled={index <= 0}>
              ↑ نقل
            </button>
            <button
              type="button"
              className="ked-btn ked-btn--ghost"
              onClick={() => moveSlide(1)}
              disabled={index >= pages.length - 1}
            >
              ↓ نقل
            </button>
            <button type="button" className="ked-btn ked-btn--ghost" onClick={duplicateSlide}>
              نسخ
            </button>
            <button type="button" className="ked-btn ked-btn--danger" onClick={deleteSlide} disabled={pages.length <= 1}>
              حذف
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
