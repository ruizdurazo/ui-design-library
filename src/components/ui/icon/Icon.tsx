import { cn } from '@/lib/cn'
import styles from './Icon.module.scss'

const rawIcons = import.meta.glob('./svg/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const icons: Record<string, string> = {}
for (const [path, svg] of Object.entries(rawIcons)) {
  const name = path
    .split('/')
    .pop()
    ?.replace(/\.svg$/, '')
  if (name) icons[name] = svg
}

export const iconNames = Object.keys(icons).sort()

type IconProps = {
  icon: string
  className?: string
  width?: number
  height?: number
  title?: string
}

export function Icon({
  icon,
  className,
  width = 18,
  height,
  title,
}: IconProps) {
  const size = height ?? width
  const svg = icons[icon]
  if (!svg) return null

  return (
    <span
      className={cn(styles.icon, className)}
      style={{ width: size, height: size }}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
