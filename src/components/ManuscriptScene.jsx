/**
 * Cinematic illustration column — animated medallion + particles + glow
 * Pure CSS/SVG — survives static export as visual frames
 */
import { Medallion } from './ManuscriptArt.jsx'
import { ParticleField } from './ManuscriptParticles.jsx'

const SCENE_LABEL = {
  star: '✦',
  lamp: '☼',
  compass: '◎',
  question: '?',
  book: '۞',
  pen: '✒',
}

export default function ManuscriptScene({ motif = 'star', animKey = '0', kind = 'spread' }) {
  const glyph = SCENE_LABEL[motif] || '✦'
  const isChapter = kind === 'chapter'
  const isCover = kind === 'cover'

  return (
    <div
      className={[
        'ms-scene',
        `ms-scene--${motif}`,
        isChapter ? 'ms-scene--chapter' : '',
        isCover ? 'ms-scene--cover' : '',
      ].join(' ')}
      key={animKey}
    >
      <div className="ms-scene-aurora" aria-hidden />
      <div className="ms-scene-orbit ms-scene-orbit--static" aria-hidden>
        <span className="ms-orbit-ring ms-orbit-ring--1" />
        <span className="ms-orbit-ring ms-orbit-ring--2" />
      </div>
      <ParticleField motif={motif} className="ms-scene-particles" />
      <div className="ms-scene-glow" aria-hidden />
      <div className="ms-scene-medallion-wrap">
        <Medallion motif={motif} animated />
      </div>
      <span className="ms-scene-glyph" aria-hidden>{glyph}</span>
      {motif === 'compass' && (
        <svg className="ms-scene-chart" viewBox="0 0 120 80" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              className="ms-chart-bar"
              x={12 + i * 28}
              y={60 - (i + 1) * 12}
              width="16"
              height={(i + 1) * 12}
              rx="2"
              style={{ '--bar-i': i }}
            />
          ))}
        </svg>
      )}
      {motif === 'pen' && (
        <div className="ms-scene-digital" aria-hidden>
          <span /><span /><span />
        </div>
      )}
      {motif === 'lamp' && <div className="ms-scene-rays ms-scene-rays--soft" aria-hidden />}
    </div>
  )
}
