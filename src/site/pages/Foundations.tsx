import { useEffect, useState } from 'react'
import { Doc, Section } from '../Doc'
import styles from './Foundations.module.scss'

const colorGroups = [
  {
    title: 'Brand',
    items: [{ name: 'Primary', token: '--primary' }],
  },
  {
    title: 'Text',
    items: [
      { name: 'Primary', token: '--text' },
      { name: 'Secondary', token: '--text-secondary' },
      { name: 'Tertiary', token: '--text-tertiary' },
      { name: 'Inverse', token: '--text-inverse' },
    ],
  },
  {
    title: 'Surface',
    items: [
      { name: 'Shell', token: '--shell' },
      { name: 'Canvas', token: '--canvas' },
      { name: 'Tile', token: '--tile' },
      { name: 'Stage', token: '--stage' },
      { name: 'Surface', token: '--surface' },
      { name: 'Muted', token: '--surface-muted' },
    ],
  },
  {
    title: 'Border',
    items: [
      { name: 'Default', token: '--border' },
      { name: 'Strong', token: '--border-strong' },
      { name: 'Hairline', token: '--hairline' },
      { name: 'Separator', token: '--separator' },
    ],
  },
  {
    title: 'Status',
    items: [
      { name: 'Success', token: '--success' },
      { name: 'Warning', token: '--warning' },
      { name: 'Error', token: '--error' },
    ],
  },
  {
    title: 'Ranking',
    items: [
      { name: '1', token: '--ranking-1' },
      { name: '2', token: '--ranking-2' },
      { name: '3', token: '--ranking-3' },
      { name: '4', token: '--ranking-4' },
      { name: '5', token: '--ranking-5' },
    ],
  },
]

const colorTokens = colorGroups.flatMap((group) =>
  group.items.map((item) => item.token),
)

function toHex(value: string) {
  const hex = /^#([0-9a-f]{3,8})$/i.exec(value.trim())
  if (hex) {
    let body = hex[1].toLowerCase()
    if (body.length === 3 || body.length === 4) {
      body = [...body].map((char) => char + char).join('')
    }
    return `#${body}`
  }

  const rgb =
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i.exec(
      value.trim(),
    )
  if (!rgb) return value.trim()

  const channels = [rgb[1], rgb[2], rgb[3]].map((channel) =>
    Math.round(Number(channel)).toString(16).padStart(2, '0'),
  )
  const alpha = rgb[4] === undefined ? 1 : Number(rgb[4])
  const body = channels.join('')
  if (alpha >= 1) return `#${body}`
  return `#${body}${Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0')}`
}

function readTokenHex(token: string) {
  return toHex(
    getComputedStyle(document.documentElement).getPropertyValue(token),
  )
}

function useTokenHexes(tokens: string[]) {
  const key = tokens.join('|')
  const [hexes, setHexes] = useState<Record<string, string>>(() =>
    Object.fromEntries(tokens.map((token) => [token, readTokenHex(token)])),
  )

  useEffect(() => {
    const update = () => {
      setHexes(
        Object.fromEntries(tokens.map((token) => [token, readTokenHex(token)])),
      )
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => observer.disconnect()
  }, [key, tokens])

  return hexes
}

const radii = [2, 4, 6, 8, 10, 12, 16, 20, 24]

export function BrandPage() {
  return (
    <Doc title="Brand">
      <Section title="Logo">
        <div className={styles.blank}>
          <div className={styles.light} />
          <div className={styles.dark} />
        </div>
      </Section>
      <Section title="Icon">
        <div className={styles.blank}>
          <div className={styles.light} />
          <div className={styles.dark} />
        </div>
      </Section>
    </Doc>
  )
}

export function ColorsPage() {
  const hexes = useTokenHexes(colorTokens)

  return (
    <Doc title="Colors">
      {colorGroups.map((group) => (
        <section key={group.title} className={styles.colorGroup}>
          <h2>{group.title}</h2>
          <div className={styles.swatches}>
            {group.items.map((item) => (
              <div key={item.token} className={styles.swatch}>
                <div style={{ background: `var(${item.token})` }} />
                <span>{item.name}</span>
                <code>{item.token.replace('--', '')}</code>
                <code>{hexes[item.token]}</code>
              </div>
            ))}
          </div>
        </section>
      ))}
    </Doc>
  )
}

export function RadiusPage() {
  return (
    <Doc title="Radius">
      <div className={styles.radii}>
        {radii.map((radius) => (
          <div key={radius} className={styles.radiusItem}>
            <div style={{ borderRadius: radius }} />
            <span>{radius}px</span>
            <span>
              {radius === 10 ? 'Control' : radius === 12 ? 'Box' : ''}
            </span>
          </div>
        ))}
        <div className={styles.radiusItem}>
          <div style={{ borderRadius: 999 }} />
          <span>Full</span>
          <span>Pill</span>
        </div>
      </div>
    </Doc>
  )
}

export function ShadowsPage() {
  return (
    <Doc title="Shadows">
      <div className={styles.shadows}>
        <div className={styles.shadowTile}>
          <strong>Tile</strong>
          <span>Canvas cards and navigation</span>
        </div>
        <div className={styles.shadowPop}>
          <strong>Pop</strong>
          <span>Menus, selects, tooltips</span>
        </div>
        <div className={styles.shadowModal}>
          <strong>Modal</strong>
          <span>Dialogs and confirms</span>
        </div>
      </div>
    </Doc>
  )
}
