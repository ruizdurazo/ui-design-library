import { useEffect, useState } from 'react'
import {
  Button,
  CheckInput,
  ColorPicker,
  ContextMenu,
  DatePicker,
  DropdownMenu,
  FormItem,
  Pill,
  Slider,
  TextInput,
  ToggleButton,
  type MenuOption,
} from '@/components/ui'
import styles from './Home.module.scss'

const menuOptions: MenuOption[] = [
  { key: 'edit', label: 'Edit details', icon: 'edit', shortcut: '⌘E' },
  { key: 'duplicate', label: 'Duplicate', icon: 'copy' },
  { key: 'sep', separator: true },
  {
    key: 'export',
    label: 'Export',
    icon: 'download',
    options: [
      { key: 'csv', label: 'CSV', icon: 'file-csv' },
      { key: 'xlsx', label: 'Excel', icon: 'file-xlsx' },
    ],
  },
  { key: 'delete', label: 'Delete', icon: 'trash' },
]

export function HomePage() {
  const [name, setName] = useState('')
  const [range, setRange] = useState('week')
  const [accept, setAccept] = useState(true)
  const [color, setColor] = useState('#36B908')
  const [date, setDate] = useState('2026-10-24')
  const [volume, setVolume] = useState(40)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!loading) return
    const timer = window.setTimeout(() => setLoading(false), 2000)
    return () => window.clearTimeout(timer)
  }, [loading])

  return (
    <div className={styles.grid}>
      <section className={`${styles.tile} ${styles.workspace}`}>
        <div className={styles.field}>
          <FormItem
            layout="vertical"
            label="Company name"
            infoText="Shown in the sidebar and on shared links."
          >
            <TextInput
              edit
              value={name}
              placeholder=""
              onValueChange={setName}
            />
          </FormItem>
        </div>
      </section>

      <section className={`${styles.tile} ${styles.buttonTile}`}>
        <Button
          text="Save"
          loadingText="Saving..."
          variant="primary"
          loading={loading}
          onClick={() => setLoading(true)}
        />
      </section>

      <section className={`${styles.tile} ${styles.type}`}>
        <p className={styles.meta}>
          <span>Font family</span>
          <strong>Inter</strong>
        </p>
        <p>The quick brown fox jumps over the lazy dog</p>
      </section>

      <section className={`${styles.tile} ${styles.slider}`}>
        <div className={styles.control}>
          <Slider label="Volume" value={volume} onValueChange={setVolume} />
        </div>
      </section>

      <div className={styles.listSplit}>
        <section className={styles.tile}>
          <div className={styles.pills}>
            <Pill variant="brand" icon="check">
              Active
            </Pill>
            <Pill>Archived</Pill>
            <Pill icon="edit" variant="outline">
              Draft
            </Pill>
          </div>
        </section>
        <section className={styles.tile}>
          <DropdownMenu icon="more-horizontal" options={menuOptions} />
        </section>
      </div>

      <section className={`${styles.tile} ${styles.title}`}>
        <h1>
          UI Design
          <br />
          Library
        </h1>
      </section>

      <section className={styles.tile}>
        <CheckInput
          edit
          label="Accept"
          value={accept}
          onValueChange={setAccept}
        />
      </section>

      <section className={`${styles.tile} ${styles.context}`}>
        <ContextMenu options={menuOptions}>
          <div className={styles.contextTarget}>Right click</div>
        </ContextMenu>
      </section>

      <section className={`${styles.tile} ${styles.color}`}>
        <div className={styles.control}>
          <ColorPicker edit value={color} onValueChange={setColor} />
        </div>
      </section>

      <section className={`${styles.tile} ${styles.schedule}`}>
        <ToggleButton
          value={range}
          onValueChange={setRange}
          options={[
            { label: 'Daily', value: 'day' },
            { label: 'Weekly', value: 'week' },
            { label: 'Monthly', value: 'month' },
          ]}
        />
      </section>

      <section className={`${styles.tile} ${styles.date}`}>
        <div className={styles.control}>
          <DatePicker edit value={date} onValueChange={setDate} />
        </div>
      </section>
    </div>
  )
}
