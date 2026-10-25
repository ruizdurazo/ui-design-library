import type { CSSProperties } from 'react'
import { Icon } from '@/components/ui'
import { cn } from '@/lib/cn'
import styles from './SpendSpecimen.module.scss'

const series = [
  { name: 'Atlas Large', value: '640K', color: '#1C5FFB' },
  { name: 'Atlas Mini', value: '480K', color: '#B01CFB' },
  { name: 'Embeddings', value: '300K', color: '#EF8121' },
  { name: 'Vision', value: '240K', color: '#1EBB26' },
]

const days = [
  { label: 'Mon', parts: [32.46, 20.86, 14.13, 8.69] },
  { label: 'Tue', parts: [34.77, 27.82, 15.21, 11.3] },
  { label: 'Wed', parts: [37.09, 24.34, 19.56, 13.04] },
  { label: 'Thu', parts: [46.37, 33.04, 18.47, 19.13] },
  { label: 'Fri', parts: [34.77, 26.08, 17.39, 15.65] },
  { label: 'Sat', parts: [25.5, 22.6, 13.04, 10.43] },
  { label: 'Sun', parts: [20.86, 19.13, 10.87, 8.69] },
]

function Tag({
  kind,
  className,
  children,
}: {
  kind: 'spacing' | 'size'
  className?: string
  children: string
}) {
  return (
    <span
      className={cn(
        styles.tag,
        kind === 'spacing' ? styles.tagSpacing : styles.tagSize,
        className,
      )}
    >
      {children}
    </span>
  )
}

function Dimension({
  axis,
  value,
  className,
}: {
  axis: 'x' | 'y'
  value: string
  className: string
}) {
  return (
    <span className={cn(styles.dimension, styles[axis], className)}>
      <Tag kind="size">{value}</Tag>
    </span>
  )
}

function Annotations() {
  return (
    <div className={styles.annotations} aria-hidden="true">
      <span className={styles.padding} />
      <span className={styles.content} />
      <Tag kind="spacing" className={styles.padTop}>
        20
      </Tag>
      <Tag kind="spacing" className={styles.padLeft}>
        20
      </Tag>
      <span className={styles.radius}>
        <Tag kind="size">R 20</Tag>
      </span>
      <Dimension axis="x" value="308" className={styles.width} />
      <Dimension axis="y" value="528" className={styles.height} />
      <Dimension axis="y" value="32" className={styles.tabsHeight} />
      <Dimension axis="y" value="40" className={styles.buttonHeight} />
    </div>
  )
}

export function SpendSpecimen({ marked = false }: { marked?: boolean }) {
  return (
    <div
      className={cn(styles.root, marked && styles.marked)}
      role="img"
      aria-label={
        marked
          ? 'Skeleton of the token spend card, annotated with padding, gap, radius, and control sizes'
          : 'Token spend card'
      }
    >
      <article className={styles.card}>
        {marked ? <Annotations /> : null}
        <header className={cn(styles.block, styles.head)}>
          <h2 className={styles.title}>Token spend</h2>
          <p className={styles.meta}>Jul 1 – 7</p>
        </header>
        <div className={cn(styles.block, styles.tabs)}>
          <span className={cn(styles.tab, styles.tabOn)}>Week</span>
          <span className={styles.tab}>Month</span>
          <span className={styles.tab}>Year</span>
        </div>
        <div className={cn(styles.block, styles.rule)} role="separator" />
        <p className={cn(styles.block, styles.sum)}>
          <span className={styles.total}>1.7M</span>
          <span className={styles.unit}>Tokens</span>
        </p>
        <div className={cn(styles.block, styles.chart)}>
          {marked ? (
            <Tag kind="spacing" className={styles.gapTag}>
              16
            </Tag>
          ) : null}
          {days.map((day) => (
            <div key={day.label} className={styles.column}>
              <div className={styles.stack}>
                {day.parts.map((part, index) => (
                  <div
                    key={series[index].name}
                    className={styles.seg}
                    style={
                      {
                        '--c': series[index].color,
                        height: part,
                      } as CSSProperties
                    }
                  />
                ))}
              </div>
              <span className={styles.day}>{day.label}</span>
            </div>
          ))}
        </div>
        <ul className={cn(styles.block, styles.legend)}>
          {series.map((item) => (
            <li key={item.name}>
              <span
                className={styles.dot}
                style={{ '--c': item.color } as CSSProperties}
              />
              <span>{item.name}</span>
              <span className={styles.value}>{item.value}</span>
            </li>
          ))}
        </ul>
        <div className={cn(styles.block, styles.details)}>
          Details
          <Icon className={styles.chevron} icon="chevron-down" width={16} />
        </div>
      </article>
    </div>
  )
}
