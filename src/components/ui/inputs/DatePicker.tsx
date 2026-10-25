import {
  Fragment,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from 'react'
import * as Popover from '@radix-ui/react-popover'
import { cn } from '@/lib/cn'
import { describedBy, useFormControl } from '../forms/useFormControl'
import { Icon } from '../icon/Icon'
import {
  addDays,
  buildMonthGrid,
  endOfWeek,
  formatDisplayDate,
  formatISODate,
  isoFromParts,
  isEmptyParts,
  normalizeSegment,
  padSegment,
  parseISODate,
  parsePastedDate,
  partsFromISO,
  resolveDateFormat,
  segmentLabel,
  segmentPlaceholder,
  shiftISOMonth,
  shiftMonth,
  startOfWeek,
  stepSegment,
  todayISO,
  type DateFormat,
  type DateParts,
  type Segment,
} from './date.ts'
import { FieldError } from './FieldError'
import { messages } from './messages'
import field from './fields.module.scss'
import styles from './DatePicker.module.scss'
import { useBlurredError } from './useBlurredError'

type DatePickerProps = {
  value?: string
  onValueChange?: (value: string) => void
  onValidation?: (valid: boolean) => void
  invalidValues?: string[]
  invalidValuesErrorMessage?: string
  edit?: boolean
  disabled?: boolean
  min?: string
  max?: string
  locale?: string
}

export function DatePicker({
  value = '',
  onValueChange,
  onValidation,
  invalidValues,
  invalidValuesErrorMessage,
  edit = false,
  disabled = false,
  min,
  max,
  locale = 'en-CH',
}: DatePickerProps) {
  const format = useMemo(() => resolveDateFormat(locale), [locale])
  const { id: controlId, labelId, descriptionId } = useFormControl()
  const errorId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const segmentRefs = useRef<Partial<Record<Segment, HTMLInputElement | null>>>(
    {},
  )
  const draftRef = useRef<DateParts | null>(null)
  const valueRef = useRef(value)
  const returnFocus = useRef(false)
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const [draft, setDraft] = useState<DateParts | null>(null)
  const shown = draft ?? partsFromISO(value)
  const draftIso = isoFromParts(shown)
  const minimum = boundedIso(min)
  const maximum = boundedIso(max)
  const partial = !isEmptyParts(shown) && !draftIso
  const issue = fieldError({
    edit,
    shown,
    draftIso,
    partial,
    minimum,
    maximum,
    locale: format.locale,
    invalidValues,
    invalidValuesErrorMessage,
  })
  const { error: revealedError, reveal } = useBlurredError(issue)
  const error = partial && focused ? null : revealedError

  valueRef.current = value

  useEffect(() => {
    if (edit) onValidation?.(!issue && !partial)
  }, [edit, issue, partial, onValidation])

  useEffect(() => {
    if (disabled) setOpen(false)
  }, [disabled])

  useEffect(() => {
    if (focused || !draft) return
    if (isoFromParts(draft) === value) {
      draftRef.current = null
      setDraft(null)
    }
  }, [focused, draft, value])

  const apply = (iso: string) => {
    const parts = partsFromISO(iso)
    draftRef.current = parts
    setDraft(parts)
    if (iso !== valueRef.current) onValueChange?.(iso)
  }

  const update = (next: DateParts) => {
    draftRef.current = next
    setDraft(next)
    if (isEmptyParts(next)) {
      if (valueRef.current) onValueChange?.('')
      return
    }
    const iso = isoFromParts(next)
    if (iso && iso !== valueRef.current) onValueChange?.(iso)
  }

  const settle = () => {
    const current = draftRef.current ?? partsFromISO(valueRef.current)
    if (isEmptyParts(current)) {
      draftRef.current = null
      setDraft(null)
      if (valueRef.current) onValueChange?.('')
      return
    }
    const padded: DateParts = {
      day: padSegment('day', current.day),
      month: padSegment('month', current.month),
      year: current.year,
    }
    draftRef.current = padded
    setDraft(padded)
    const iso = isoFromParts(padded)
    if (iso && iso !== valueRef.current) onValueChange?.(iso)
  }

  const focusSegment = (segment: Segment) => {
    const input = segmentRefs.current[segment]
    input?.focus()
    input?.select()
  }

  const commit = (iso: string) => {
    apply(iso)
    returnFocus.current = true
    setOpen(false)
  }

  const onFieldBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null
    if (
      next &&
      (rootRef.current?.contains(next) || popoverRef.current?.contains(next))
    )
      return
    setFocused(false)
    settle()
    reveal()
  }

  const keepFieldOpen = (event: {
    target: EventTarget | null
    preventDefault: () => void
  }) => {
    if (rootRef.current?.contains(event.target as Node)) event.preventDefault()
  }

  if (!edit) {
    const readOnly = formatDisplayDate(value, format.locale) || value || '—'
    return (
      <div className={field.field}>
        <div className={field.readOnly}>{readOnly}</div>
      </div>
    )
  }

  const selected = draftIso || (!draft ? (boundedIso(value) ?? '') : '')

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => !disabled && setOpen(next)}
    >
      <div
        ref={rootRef}
        className={cn(field.field, error && field.invalid)}
        onBlur={onFieldBlur}
        onFocus={() => setFocused(true)}
      >
        <Popover.Anchor asChild>
          <div
            className={cn(
              styles.control,
              error && styles.invalid,
              disabled && styles.disabled,
            )}
            data-open={open ? 'true' : undefined}
            role="group"
            aria-label={labelId ? undefined : 'Date'}
            aria-labelledby={labelId}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(
              descriptionId,
              error ? errorId : undefined,
            )}
            onMouseDown={(event) => {
              if (disabled) return
              const target = event.target as HTMLElement
              if (target.closest('input, button')) return
              event.preventDefault()
              focusSegment(
                format.order.find((segment) => !shown[segment]) ??
                  format.order[0],
              )
            }}
            onPaste={(event) => {
              const iso = parsePastedDate(
                event.clipboardData.getData('text'),
                format.order,
              )
              if (!iso) return
              event.preventDefault()
              apply(iso)
            }}
          >
            <div className={styles.segments}>
              {format.order.map((segment, index) => (
                <Fragment key={segment}>
                  {index > 0 ? (
                    <span className={styles.literal}>{format.separator}</span>
                  ) : null}
                  <input
                    ref={(node) => {
                      segmentRefs.current[segment] = node
                    }}
                    id={index === 0 ? controlId : undefined}
                    className={cn(
                      styles.segment,
                      segment === 'year' && styles.year,
                    )}
                    value={shown[segment]}
                    placeholder={segmentPlaceholder(segment)}
                    disabled={disabled}
                    inputMode="numeric"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    aria-label={segmentLabel(segment)}
                    maxLength={segment === 'year' ? 4 : 2}
                    onFocus={(event) => event.currentTarget.select()}
                    onChange={(event) => {
                      const normalized = normalizeSegment(
                        segment,
                        event.target.value,
                      )
                      update({ ...shown, [segment]: normalized.value })
                      if (!normalized.advance) return
                      const next =
                        format.order[format.order.indexOf(segment) + 1]
                      if (next) focusSegment(next)
                      else event.target.select()
                    }}
                    onKeyDown={(event) =>
                      onSegmentKey(event, segment, {
                        parts: shown,
                        order: format.order,
                        update,
                        focusSegment,
                        openCalendar: () => setOpen(true),
                        closeCalendar: () => setOpen(false),
                      })
                    }
                  />
                </Fragment>
              ))}
            </div>
            <Popover.Trigger asChild>
              <button
                type="button"
                className={styles.trigger}
                disabled={disabled}
                aria-label="Choose date"
              >
                <Icon icon="calendar" width={16} />
              </button>
            </Popover.Trigger>
          </div>
        </Popover.Anchor>
        <FieldError message={error} id={errorId} />
      </div>
      <Popover.Portal>
        <Popover.Content
          ref={popoverRef}
          className={styles.popover}
          side="bottom"
          align="start"
          sideOffset={6}
          collisionPadding={8}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => {
            if (
              returnFocus.current ||
              rootRef.current?.contains(document.activeElement)
            ) {
              event.preventDefault()
              if (returnFocus.current) {
                returnFocus.current = false
                focusSegment(format.order[0])
              }
            }
          }}
          onPointerDownOutside={keepFieldOpen}
          onFocusOutside={keepFieldOpen}
          onInteractOutside={keepFieldOpen}
          onMouseDown={(event) => event.preventDefault()}
        >
          <Calendar
            format={format}
            selected={selected}
            min={minimum}
            max={maximum}
            onSelect={commit}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

function onSegmentKey(
  event: KeyboardEvent<HTMLInputElement>,
  segment: Segment,
  helpers: {
    parts: DateParts
    order: Segment[]
    update: (parts: DateParts) => void
    focusSegment: (segment: Segment) => void
    openCalendar: () => void
    closeCalendar: () => void
  },
) {
  const input = event.currentTarget
  const index = helpers.order.indexOf(segment)
  const previous = helpers.order[index - 1]
  const next = helpers.order[index + 1]
  const atStart = input.selectionStart === 0 && input.selectionEnd === 0
  const atEnd =
    input.selectionStart === input.value.length &&
    input.selectionEnd === input.value.length

  if (event.key === 'ArrowDown' && event.altKey) {
    event.preventDefault()
    helpers.openCalendar()
    return
  }
  if (event.key === 'Escape') {
    helpers.closeCalendar()
    return
  }
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault()
    helpers.update(
      stepSegment(segment, helpers.parts, event.key === 'ArrowUp' ? 1 : -1),
    )
    requestAnimationFrame(() => input.select())
    return
  }
  if (
    (event.key === 'ArrowLeft' && atStart) ||
    (event.key === 'Backspace' && atStart && !helpers.parts[segment])
  ) {
    if (!previous) return
    event.preventDefault()
    helpers.focusSegment(previous)
    return
  }
  if (event.key === 'ArrowRight' && atEnd) {
    if (!next) return
    event.preventDefault()
    helpers.focusSegment(next)
    return
  }
  if (event.key === '/' || event.key === '.' || event.key === '-') {
    event.preventDefault()
    const padded = padSegment(segment, helpers.parts[segment])
    if (padded !== helpers.parts[segment])
      helpers.update({ ...helpers.parts, [segment]: padded })
    if (next) helpers.focusSegment(next)
  }
}

function fieldError({
  edit,
  shown,
  draftIso,
  partial,
  minimum,
  maximum,
  locale,
  invalidValues,
  invalidValuesErrorMessage,
}: {
  edit: boolean
  shown: DateParts
  draftIso: string | null
  partial: boolean
  minimum?: string
  maximum?: string
  locale: string
  invalidValues?: string[]
  invalidValuesErrorMessage?: string
}) {
  if (!edit) return null
  if (isEmptyParts(shown)) return messages.empty
  if (partial) return messages.invalidDate
  if (draftIso && invalidValues?.includes(draftIso))
    return invalidValuesErrorMessage || messages.invalidValue
  if (draftIso && minimum && draftIso < minimum)
    return messages.dateTooEarly(formatDisplayDate(minimum, locale))
  if (draftIso && maximum && draftIso > maximum)
    return messages.dateTooLate(formatDisplayDate(maximum, locale))
  return null
}

function boundedIso(value?: string) {
  if (!value) return undefined
  const date = parseISODate(value)
  return date ? formatISODate(date) : undefined
}

type CalendarProps = {
  format: DateFormat
  selected: string
  min?: string
  max?: string
  onSelect: (iso: string) => void
}

function Calendar({ format, selected, min, max, onSelect }: CalendarProps) {
  const initial = parseISODate(selected) ?? new Date()
  const [view, setView] = useState<'days' | 'months' | 'years'>('days')
  const [visible, setVisible] = useState({
    year: initial.getFullYear(),
    monthIndex: initial.getMonth(),
  })
  const [cursor, setCursor] = useState(selected || todayISO())
  const cellRefs = useRef(new Map<string, HTMLButtonElement>())
  const pendingFocus = useRef<string | null>(cursor)
  const viewRef = useRef(view)
  const today = todayISO()
  const yearStart = Math.floor(visible.year / 12) * 12
  const cells = buildMonthGrid(
    visible.year,
    visible.monthIndex,
    format.weekStartsOn,
  )
  const activeIso = cells.some((cell) => cell.iso === cursor)
    ? cursor
    : cells[0]?.iso
  const outOfRange = (iso: string) =>
    Boolean((min && iso < min) || (max && iso > max))

  viewRef.current = view

  useEffect(() => {
    const date = parseISODate(selected)
    if (!date || viewRef.current !== 'days') return
    setVisible({ year: date.getFullYear(), monthIndex: date.getMonth() })
    setCursor(selected)
  }, [selected])

  useEffect(() => {
    const iso = pendingFocus.current
    if (!iso || view !== 'days') return
    pendingFocus.current = null
    cellRefs.current.get(iso)?.focus()
  }, [cursor, visible, view])

  const moveTo = (iso: string) => {
    const date = parseISODate(iso)
    if (!date) return
    pendingFocus.current = iso
    setCursor(iso)
    setVisible({ year: date.getFullYear(), monthIndex: date.getMonth() })
  }

  const onDayKey = (event: KeyboardEvent<HTMLButtonElement>, iso: string) => {
    let next: string
    if (event.key === 'ArrowLeft') next = addDays(iso, -1)
    else if (event.key === 'ArrowRight') next = addDays(iso, 1)
    else if (event.key === 'ArrowUp') next = addDays(iso, -7)
    else if (event.key === 'ArrowDown') next = addDays(iso, 7)
    else if (event.key === 'Home') next = startOfWeek(iso, format.weekStartsOn)
    else if (event.key === 'End') next = endOfWeek(iso, format.weekStartsOn)
    else if (event.key === 'PageUp')
      next = shiftISOMonth(iso, event.shiftKey ? -12 : -1)
    else if (event.key === 'PageDown')
      next = shiftISOMonth(iso, event.shiftKey ? 12 : 1)
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (!outOfRange(iso)) onSelect(iso)
      return
    } else return
    event.preventDefault()
    moveTo(next)
  }

  const shift = (delta: number) => {
    if (view === 'days')
      setVisible((current) =>
        shiftMonth(current.year, current.monthIndex, delta),
      )
    else if (view === 'months')
      setVisible((current) => ({
        ...current,
        year: clampYear(current.year + delta),
      }))
    else
      setVisible((current) => ({
        ...current,
        year: clampYear(Math.floor(current.year / 12) * 12 + delta * 12),
      }))
  }

  const previousDisabled =
    view === 'days'
      ? visible.year === 1 && visible.monthIndex === 0
      : view === 'months'
        ? visible.year <= 1
        : yearStart <= 1
  const nextDisabled =
    view === 'days'
      ? visible.year === 9999 && visible.monthIndex === 11
      : view === 'months'
        ? visible.year >= 9999
        : yearStart + 12 > 9999

  return (
    <div>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.nav}
          aria-label={previousLabel(view)}
          disabled={previousDisabled}
          onClick={() => shift(-1)}
        >
          <Icon icon="chevron-left" width={16} />
        </button>
        <div className={styles.heading}>
          {view === 'years' ? (
            <span className={styles.range}>
              {yearStart}–{yearStart + 11}
            </span>
          ) : (
            <>
              {view === 'days' ? (
                <button
                  type="button"
                  className={styles.switch}
                  onClick={() => setView('months')}
                >
                  {format.monthLabels[visible.monthIndex]}
                </button>
              ) : null}
              <button
                type="button"
                className={styles.switch}
                onClick={() => setView('years')}
              >
                {visible.year}
              </button>
            </>
          )}
        </div>
        <button
          type="button"
          className={styles.nav}
          aria-label={nextLabel(view)}
          disabled={nextDisabled}
          onClick={() => shift(1)}
        >
          <Icon icon="chevron-right" width={16} />
        </button>
      </div>

      {view === 'days' ? (
        <div
          className={styles.days}
          role="grid"
          aria-label={`${format.monthLabels[visible.monthIndex]} ${visible.year}`}
        >
          <div className={styles.row} role="row">
            {format.weekdayLabels.map((label, index) => (
              <div
                key={`${label}-${index}`}
                className={styles.weekday}
                role="columnheader"
              >
                {label}
              </div>
            ))}
          </div>
          {Array.from({ length: 6 }, (_, week) =>
            cells.slice(week * 7, week * 7 + 7),
          ).map((weekDays) => (
            <div className={styles.row} role="row" key={weekDays[0].iso}>
              {weekDays.map((cell) => {
                const disabled = outOfRange(cell.iso)
                const date = parseISODate(cell.iso)
                return (
                  <button
                    key={cell.iso}
                    ref={(node) => {
                      if (node) cellRefs.current.set(cell.iso, node)
                      else cellRefs.current.delete(cell.iso)
                    }}
                    type="button"
                    role="gridcell"
                    className={styles.day}
                    tabIndex={cell.iso === activeIso ? 0 : -1}
                    disabled={disabled}
                    data-outside={cell.outside ? 'true' : undefined}
                    data-today={cell.iso === today ? 'true' : undefined}
                    data-selected={cell.iso === selected ? 'true' : undefined}
                    aria-label={
                      date
                        ? formatDisplayDate(cell.iso, format.locale)
                        : undefined
                    }
                    aria-selected={cell.iso === selected}
                    onClick={() => onSelect(cell.iso)}
                    onKeyDown={(event) => onDayKey(event, cell.iso)}
                  >
                    {date?.getDate()}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      ) : null}

      {view === 'months' ? (
        <div className={styles.options}>
          {format.monthLabelsShort.map((label, index) => {
            const monthKey = `${String(visible.year).padStart(4, '0')}-${String(index + 1).padStart(2, '0')}`
            const selectedMonth = selected.startsWith(monthKey)
            return (
              <button
                key={monthKey}
                type="button"
                className={styles.option}
                data-selected={selectedMonth ? 'true' : undefined}
                data-today={today.startsWith(monthKey) ? 'true' : undefined}
                onClick={() => {
                  setVisible((current) => ({ ...current, monthIndex: index }))
                  setView('days')
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      ) : null}

      {view === 'years' ? (
        <div className={styles.options}>
          {Array.from({ length: 12 }, (_, index) => yearStart + index).map(
            (year) => {
              const disabled = year < 1 || year > 9999
              const yearKey = String(year).padStart(4, '0')
              return (
                <button
                  key={year}
                  type="button"
                  className={styles.option}
                  disabled={disabled}
                  data-selected={
                    selected.startsWith(yearKey) ? 'true' : undefined
                  }
                  data-today={
                    today.slice(0, 4) === yearKey ? 'true' : undefined
                  }
                  onClick={() => {
                    setVisible((current) => ({ ...current, year }))
                    setView('months')
                  }}
                >
                  {year}
                </button>
              )
            },
          )}
        </div>
      ) : null}

      <button
        type="button"
        className={styles.today}
        disabled={outOfRange(today)}
        onClick={() => onSelect(today)}
      >
        Today
      </button>
    </div>
  )
}

function previousLabel(view: 'days' | 'months' | 'years') {
  if (view === 'days') return 'Previous month'
  if (view === 'months') return 'Previous year'
  return 'Previous years'
}

function nextLabel(view: 'days' | 'months' | 'years') {
  if (view === 'days') return 'Next month'
  if (view === 'months') return 'Next year'
  return 'Next years'
}

function clampYear(year: number) {
  return Math.min(9999, Math.max(1, year))
}
