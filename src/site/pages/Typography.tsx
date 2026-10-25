import { Doc } from '../Doc'
import styles from './Typography.module.scss'

const weights = [
  {
    weight: 400,
    name: 'Regular',
    sentence: 'Regular is the default for body copy, fields, and controls.',
  },
  {
    weight: 500,
    name: 'Medium',
    sentence: 'Medium marks labels, selected states, and quiet emphasis.',
  },
  {
    weight: 600,
    name: 'Semibold',
    sentence:
      'Semibold carries headings and the words that should stand forward.',
  },
  {
    weight: 700,
    name: 'Bold',
    sentence: 'Bold is reserved for the strongest emphasis in a view.',
  },
]

const glyphGroups = [
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  'abcdefghijklmnopqrstuvwxyz',
  '0123456789',
  `.,:;!?'"–—()/[]{}@&%*+=<>$`,
]

export function FontsPage() {
  return (
    <Doc title="Font families">
      <p className={styles.huge}>Inter</p>
      <section className={styles.block}>
        <h2>Weights</h2>
        <div className={styles.weights}>
          {weights.map(({ weight, name, sentence }) => (
            <div key={weight} className={styles.weight}>
              <div className={styles.weightLabel}>
                <span>{name}</span>
                <span>{weight}</span>
              </div>
              <p style={{ fontWeight: weight }}>{sentence}</p>
            </div>
          ))}
        </div>
      </section>
      <section className={styles.block}>
        <h2>Glyphs</h2>
        <div
          className={styles.glyphs}
          aria-label="Uppercase, lowercase, numbers, and common symbols"
        >
          {glyphGroups.map((group) => (
            <div key={group} className={styles.glyphRow}>
              {[...group].map((glyph) => (
                <span key={glyph} className={styles.glyph}>
                  {glyph}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>
    </Doc>
  )
}

export function HeadingsPage() {
  return (
    <Doc title="Headings">
      <div className={styles.stackList}>
        <div>
          <span>32 / Extra large</span>
          <p
            style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.03em' }}
          >
            Portfolio overview
          </p>
        </div>
        <div>
          <span>20 / Large</span>
          <p style={{ fontSize: 20, fontWeight: 600 }}>Rooms and finishes</p>
        </div>
        <div>
          <span>15 / Medium</span>
          <p style={{ fontSize: 15, fontWeight: 600 }}>Price</p>
        </div>
      </div>
    </Doc>
  )
}

export function TextPage() {
  return (
    <Doc title="Text">
      <div className={styles.stackList}>
        <div>
          <span>15 / Dialog</span>
          <p style={{ fontSize: 15, lineHeight: 1.5, maxWidth: '52ch' }}>
            Removing this building also removes its photos, notes, and
            documents. This cannot be undone.
          </p>
        </div>
        <div>
          <span>14 / Body</span>
          <p style={{ fontSize: 14, lineHeight: '20px', maxWidth: '58ch' }}>
            Asking price is estimated from recent sales, the floor area, and the
            condition. Values marked with a warning are estimates.
          </p>
        </div>
      </div>
    </Doc>
  )
}

export function CaptionPage() {
  return (
    <Doc title="Caption">
      <div className={styles.stackList}>
        <div>
          <span>12 / Secondary</span>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            Updated 4 minutes ago · CHF/m²
          </p>
        </div>
        <div>
          <span>12 / Error</span>
          <p style={{ fontSize: 12, color: 'var(--error)' }}>
            This field is required
          </p>
        </div>
      </div>
    </Doc>
  )
}
