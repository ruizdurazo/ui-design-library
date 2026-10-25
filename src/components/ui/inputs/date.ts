export type Segment = 'day' | 'month' | 'year'

export type DateParts = Record<Segment, string>

export type DateFormat = {
  locale: string
  order: Segment[]
  separator: string
  weekStartsOn: number
  weekdayLabels: string[]
  monthLabels: string[]
  monthLabelsShort: string[]
}

export function resolveDateFormat(locale: string): DateFormat {
  const sample = new Date(2000, 11, 31)
  const parts = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).formatToParts(sample)
  const order = parts
    .filter(
      (part) =>
        part.type === 'day' || part.type === 'month' || part.type === 'year',
    )
    .map((part) => part.type as Segment)
  const weekStartsOn = firstWeekday(locale)

  return {
    locale,
    order: order.length === 3 ? order : ['day', 'month', 'year'],
    separator: separatorBetween(parts),
    weekStartsOn,
    weekdayLabels: Array.from({ length: 7 }, (_, index) =>
      weekdayLabel(locale, new Date(2024, 0, 7 + weekStartsOn + index)),
    ),
    monthLabels: Array.from({ length: 12 }, (_, index) =>
      new Intl.DateTimeFormat(locale, { month: 'long' }).format(
        new Date(2024, index, 1),
      ),
    ),
    monthLabelsShort: Array.from({ length: 12 }, (_, index) =>
      new Intl.DateTimeFormat(locale, { month: 'short' }).format(
        new Date(2024, index, 1),
      ),
    ),
  }
}

export function parseISODate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  return calendarDate(Number(match[1]), Number(match[2]), Number(match[3]))
}

export function formatISODate(date: Date) {
  const year = String(date.getFullYear()).padStart(4, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayISO() {
  return formatISODate(new Date())
}

export function partsFromISO(value: string): DateParts {
  const date = parseISODate(value)
  if (!date) return { day: '', month: '', year: '' }
  return {
    year: String(date.getFullYear()).padStart(4, '0'),
    month: String(date.getMonth() + 1).padStart(2, '0'),
    day: String(date.getDate()).padStart(2, '0'),
  }
}

export function isoFromParts(parts: DateParts) {
  if (parts.year.length !== 4 || !parts.month || !parts.day) return null
  const date = calendarDate(
    Number(parts.year),
    Number(parts.month),
    Number(parts.day),
  )
  return date ? formatISODate(date) : null
}

export function isEmptyParts(parts: DateParts) {
  return !parts.day && !parts.month && !parts.year
}

export function formatDisplayDate(value: string, locale: string) {
  const date = parseISODate(value)
  if (!date) return ''
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function normalizeSegment(
  segment: Segment,
  digits: string,
): { value: string; advance: boolean } {
  const maxLen = segment === 'year' ? 4 : 2
  const text = digits.replace(/\D/g, '').slice(0, maxLen)
  if (!text) return { value: '', advance: false }
  if (segment === 'year') return { value: text, advance: text.length === 4 }

  const max = segment === 'month' ? 12 : 31
  const amount = Number(text)
  if (text.length === 1) {
    if (amount === 0) return { value: '0', advance: false }
    const maxFirst = segment === 'month' ? 1 : 3
    if (amount > maxFirst)
      return { value: String(amount).padStart(2, '0'), advance: true }
    return { value: text, advance: false }
  }
  if (amount >= 1 && amount <= max)
    return { value: String(amount).padStart(2, '0'), advance: true }
  return normalizeSegment(segment, text.slice(-1))
}

export function padSegment(segment: Segment, value: string) {
  if (!value || segment === 'year') return value
  const amount = Number(value)
  const max = segment === 'month' ? 12 : 31
  if (!Number.isInteger(amount) || amount < 1 || amount > max) return value
  return String(amount).padStart(2, '0')
}

export function stepSegment(
  segment: Segment,
  parts: DateParts,
  delta: number,
  today = new Date(),
): DateParts {
  if (segment === 'month') {
    const current = Number(parts.month)
    const month =
      current >= 1 && current <= 12
        ? ((current - 1 + delta + 120) % 12) + 1
        : delta > 0
          ? 1
          : 12
    return clampDay({ ...parts, month: String(month).padStart(2, '0') })
  }

  if (segment === 'year') {
    const current =
      parts.year.length === 4 ? Number(parts.year) : today.getFullYear()
    const year = Math.min(9999, Math.max(1, current + delta))
    return clampDay({ ...parts, year: String(year).padStart(4, '0') })
  }

  const year =
    parts.year.length === 4 ? Number(parts.year) : today.getFullYear()
  const month = Number(parts.month)
  const monthNumber = month >= 1 && month <= 12 ? month : today.getMonth() + 1
  const max = daysInMonth(year, monthNumber)
  const current = Number(parts.day)
  const day =
    current >= 1 && current <= max
      ? ((current - 1 + delta + max * 4) % max) + 1
      : delta > 0
        ? 1
        : max
  return { ...parts, day: String(day).padStart(2, '0') }
}

export function parsePastedDate(text: string, order: Segment[]) {
  const trimmed = text.trim()
  const iso = parseISODate(trimmed)
  if (iso) return formatISODate(iso)

  const yearFirst = /^(\d{4})[./-](\d{1,2})[./-](\d{1,2})$/.exec(trimmed)
  if (yearFirst)
    return isoFromParts({
      year: yearFirst[1],
      month: yearFirst[2],
      day: yearFirst[3],
    })

  const match = /^(\d{1,4})[./-](\d{1,2})[./-](\d{1,4})$/.exec(trimmed)
  if (!match) return null

  const numbers = [match[1], match[2], match[3]]
  const draft: DateParts = { day: '', month: '', year: '' }
  order.forEach((segment, index) => {
    const raw = numbers[index]
    if (!raw) return
    if (segment === 'year') {
      let year = Number(raw)
      if (raw.length <= 2) year += year >= 70 ? 1900 : 2000
      draft.year = String(year).padStart(4, '0')
      return
    }
    draft[segment] = String(Number(raw)).padStart(2, '0')
  })
  return isoFromParts(draft)
}

export function buildMonthGrid(
  year: number,
  monthIndex: number,
  weekStartsOn: number,
) {
  const first = new Date(year, monthIndex, 1)
  const offset = (first.getDay() - weekStartsOn + 7) % 7
  const start = new Date(year, monthIndex, 1 - offset)
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() + index,
    )
    return {
      iso: formatISODate(date),
      outside: date.getMonth() !== monthIndex,
    }
  })
}

export function shiftMonth(year: number, monthIndex: number, delta: number) {
  const date = new Date(year, monthIndex + delta, 1)
  if (date.getFullYear() < 1) return { year: 1, monthIndex: 0 }
  if (date.getFullYear() > 9999) return { year: 9999, monthIndex: 11 }
  return { year: date.getFullYear(), monthIndex: date.getMonth() }
}

export function addDays(iso: string, amount: number) {
  const date = parseISODate(iso)
  if (!date) return iso
  const next = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + amount,
  )
  if (next.getFullYear() < 1 || next.getFullYear() > 9999) return iso
  return formatISODate(next)
}

export function startOfWeek(iso: string, weekStartsOn: number) {
  const date = parseISODate(iso)
  if (!date) return iso
  const offset = (date.getDay() - weekStartsOn + 7) % 7
  return addDays(iso, -offset)
}

export function endOfWeek(iso: string, weekStartsOn: number) {
  return addDays(startOfWeek(iso, weekStartsOn), 6)
}

export function shiftISOMonth(iso: string, delta: number) {
  const date = parseISODate(iso)
  if (!date) return iso
  const moved = new Date(date.getFullYear(), date.getMonth() + delta, 1)
  if (moved.getFullYear() < 1 || moved.getFullYear() > 9999) return iso
  const max = daysInMonth(moved.getFullYear(), moved.getMonth() + 1)
  return formatISODate(
    new Date(
      moved.getFullYear(),
      moved.getMonth(),
      Math.min(date.getDate(), max),
    ),
  )
}

export function segmentPlaceholder(segment: Segment) {
  if (segment === 'year') return 'yyyy'
  if (segment === 'month') return 'mm'
  return 'dd'
}

export function segmentLabel(segment: Segment) {
  if (segment === 'year') return 'Year'
  if (segment === 'month') return 'Month'
  return 'Day'
}

function calendarDate(year: number, month: number, day: number) {
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  )
    return null
  if (year < 1 || year > 9999 || month < 1 || month > 12 || day < 1) return null
  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  )
    return null
  return date
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

function clampDay(parts: DateParts): DateParts {
  if (parts.year.length !== 4 || !parts.month || !parts.day) return parts
  const year = Number(parts.year)
  const month = Number(parts.month)
  const day = Number(parts.day)
  if (month < 1 || month > 12 || day < 1) return parts
  const max = daysInMonth(year, month)
  if (day <= max) return parts
  return { ...parts, day: String(max).padStart(2, '0') }
}

function separatorBetween(parts: Intl.DateTimeFormatPart[]) {
  const indexes = parts
    .map((part, index) => ({ part, index }))
    .filter(
      ({ part }) =>
        part.type === 'day' || part.type === 'month' || part.type === 'year',
    )
  if (indexes.length < 2) return '.'
  return (
    parts
      .slice(indexes[0].index + 1, indexes[1].index)
      .map((part) => part.value)
      .join('') || '.'
  )
}

function weekdayLabel(locale: string, date: Date) {
  const label = new Intl.DateTimeFormat(locale, { weekday: 'short' })
    .format(date)
    .replace(/\.$/, '')
  if ([...label].length > 1) return label
  return new Intl.DateTimeFormat('en-GB', { weekday: 'short' }).format(date)
}

function firstWeekday(locale: string) {
  try {
    const info = new Intl.Locale(locale) as Intl.Locale & {
      weekInfo?: { firstDay: number }
      getWeekInfo?: () => { firstDay: number }
    }
    const first = info.getWeekInfo?.().firstDay ?? info.weekInfo?.firstDay
    if (first === 7) return 0
    if (first && first >= 1 && first <= 6) return first
  } catch {
    // Invalid tags fall through to Monday, which matches the Swiss default.
  }
  return /^en-(US|CA|JP)/i.test(locale) ? 0 : 1
}
