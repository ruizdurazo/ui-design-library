import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  ButtonWrapper,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Compare,
  CheckInput,
  ColorPicker,
  ColorPickerPanel,
  ContextMenu,
  DatePicker,
  Drawer,
  DropdownMenu,
  EditContainer,
  Empty,
  FlexBoxRow,
  FormItem,
  Icon,
  Info,
  List,
  LoadingSpinner,
  Modal,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuSub,
  NavigationMenuTrigger,
  NumberFlow,
  NumberInput,
  Pagination,
  Pill,
  RadioCard,
  RadioCards,
  SelectInput,
  Slider,
  Switch,
  Tab,
  Tabs,
  TextAreaInput,
  TextInput,
  ToggleButton,
  Tooltip,
  iconNames,
  useConfirm,
  type DrawerSide,
  type FormState,
  type MenuOption,
} from '@/components/ui'
import { Doc, Section } from '../Doc'
import styles from './Primitives.module.scss'

const menuOptions: MenuOption[] = [
  { key: 'label', type: 'label', label: 'Building' },
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
  { key: 'delete', label: 'Delete', icon: 'trash', disabled: false },
]

export function ButtonPage() {
  return (
    <Doc title="Button">
      <Section
        title="Variants"
        code={`<Button text="Default" />
<Button text="Primary" variant="primary" />
<Button text="Ghost" variant="ghost" />
<Button text="Delete" variant="delete" />`}
      >
        <Button text="Default" />
        <Button text="Primary" variant="primary" />
        <Button text="Ghost" variant="ghost" />
        <Button text="Delete" variant="delete" />
      </Section>
      <Section
        title="Corners"
        code={`<Button text="Round" radius="round" />
<Button text="Soft" radius="soft" />
<Button text="Sharp" radius="sharp" />
<Button text="Round" radius="round" variant="primary" small />
<Button text="Soft" radius="soft" variant="ghost" small />
<Button text="Sharp" radius="sharp" variant="primary" small />`}
      >
        <Button text="Round" radius="round" />
        <Button text="Soft" radius="soft" />
        <Button text="Sharp" radius="sharp" />
        <Button text="Round" radius="round" variant="primary" small />
        <Button text="Soft" radius="soft" variant="ghost" small />
        <Button text="Sharp" radius="sharp" variant="primary" small />
      </Section>
      <Section
        title="Sizes"
        code={`<Button text="Default" />
<Button text="Small" small />`}
      >
        <Button text="Default" />
        <Button text="Small" small />
      </Section>
      <Section
        title="With icon"
        code={`<Button text="Add building" icon="plus" variant="primary" />
<Button text="Download" icon="download" />`}
      >
        <Button text="Add building" icon="plus" variant="primary" />
        <Button text="Download" icon="download" />
      </Section>
      <Section
        title="Icon only"
        code={`<Button shape="square" icon="settings" />
<Button shape="circle" icon="plus" />`}
      >
        <Button shape="square" icon="settings" />
        <Button shape="circle" icon="plus" />
      </Section>
      <Section
        title="Pending"
        code={`<Button text="Save" loadingText="Saving" loading variant="primary" />
<Button text="Disabled" disabled />`}
      >
        <Button text="Save" loadingText="Saving" loading variant="primary" />
        <Button text="Disabled" disabled />
      </Section>
    </Doc>
  )
}

export function IconPage() {
  const [query, setQuery] = useState('')
  const [picked, setPicked] = useState('home')
  const visible = iconNames.filter((name) => name.includes(query.toLowerCase()))
  return (
    <Doc title="Icon">
      <Section
        title="Picker"
        align="start"
        code={`<Icon icon="home" width={18} />`}
      >
        <div className={styles.iconSearch}>
          <TextInput
            edit
            allowEmpty
            value={query}
            placeholder="Filter icons"
            onValueChange={setQuery}
          />
          <p>Selected · {picked}</p>
        </div>
      </Section>
      <div className={styles.iconGrid}>
        {visible.map((name) => (
          <button
            key={name}
            type="button"
            className={picked === name ? styles.iconOn : undefined}
            onClick={() => setPicked(name)}
          >
            <Icon icon={name} width={18} />
            <span>{name}</span>
          </button>
        ))}
      </div>
    </Doc>
  )
}

export function SpinnerPage() {
  return (
    <Doc title="Spinner">
      <Section
        title="Inline"
        code={`<LoadingSpinner />
<Button text="Loading" loading />
<Button text="Saving changes" loading variant="primary" />`}
      >
        <LoadingSpinner />
        <Button text="Loading" loading />
        <Button text="Saving changes" loading variant="primary" />
      </Section>
    </Doc>
  )
}

export function TogglePage() {
  const [value, setValue] = useState('relative')
  return (
    <Doc title="Toggle">
      <Section
        title="Default"
        code={`<ToggleButton
  value={value}
  onValueChange={setValue}
  options={[
    { label: 'Absolute', value: 'absolute' },
    { label: 'Relative', value: 'relative' },
  ]}
/>`}
      >
        <ToggleButton
          value={value}
          onValueChange={setValue}
          options={[
            { label: 'Absolute', value: 'absolute' },
            { label: 'Relative', value: 'relative' },
          ]}
        />
      </Section>
      <Section
        title="Small"
        code={`<ToggleButton
  size="small"
  value={value}
  onValueChange={setValue}
  options={[
    { label: 'Day', value: 'absolute', icon: 'clock' },
    { label: 'Week', value: 'relative', icon: 'calendar' },
  ]}
/>`}
      >
        <ToggleButton
          size="small"
          value={value}
          onValueChange={setValue}
          options={[
            { label: 'Day', value: 'absolute', icon: 'clock' },
            { label: 'Week', value: 'relative', icon: 'calendar' },
          ]}
        />
      </Section>
    </Doc>
  )
}

export function SwitchPage() {
  const [alerts, setAlerts] = useState(true)
  const [compact, setCompact] = useState(false)
  return (
    <Doc title="Switch">
      <Section
        title="Default"
        code={`<Switch label="Email alerts" value={alerts} onValueChange={setAlerts} />`}
      >
        <Switch label="Email alerts" value={alerts} onValueChange={setAlerts} />
      </Section>
      <Section
        title="Small"
        code={`<Switch size="small" label="Compact rows" value={compact} onValueChange={setCompact} />`}
      >
        <Switch
          size="small"
          label="Compact rows"
          value={compact}
          onValueChange={setCompact}
        />
      </Section>
      <Section
        title="Disabled"
        code={`<Switch disabled label="Off" />
<Switch disabled defaultValue label="On" />`}
      >
        <Switch disabled label="Off" />
        <Switch disabled defaultValue label="On" />
      </Section>
    </Doc>
  )
}

export function TabsPage() {
  return (
    <Doc title="Tabs">
      <Section
        title="With actions"
        align="start"
        code={`<Tabs
  group="docs-building"
  defaultValue="overview"
  actions={<Button small text="Export" icon="download" />}
>
  <Tab value="overview" title="Overview">
    Rooms, photos, and the work planned for this year.
  </Tab>
  <Tab value="units" title="Units">
    Twelve apartments sit in this building.
  </Tab>
  <Tab value="documents" title="Documents">
    No documents uploaded.
  </Tab>
</Tabs>`}
      >
        <div className={styles.stretch}>
          <Tabs
            group="docs-building"
            defaultValue="overview"
            actions={<Button small text="Export" icon="download" />}
          >
            <Tab value="overview" title="Overview">
              Rooms, photos, and the work planned for this year.
            </Tab>
            <Tab value="units" title="Units">
              Twelve apartments sit in this building.
            </Tab>
            <Tab value="documents" title="Documents">
              No documents uploaded.
            </Tab>
          </Tabs>
        </div>
      </Section>
      <Section
        title="Underline"
        align="start"
        code={`<Tabs
  variant="underline"
  group="docs-building-line"
  defaultValue="overview"
  actions={<Button small text="Export" icon="download" />}
>
  <Tab value="overview" title="Overview">
    Rooms, photos, and the work planned for this year.
  </Tab>
  <Tab value="units" title="Units">
    Twelve apartments sit in this building.
  </Tab>
  <Tab value="documents" title="Documents">
    No documents uploaded.
  </Tab>
</Tabs>`}
      >
        <div className={styles.stretch}>
          <Tabs
            variant="underline"
            group="docs-building-line"
            defaultValue="overview"
            actions={<Button small text="Export" icon="download" />}
          >
            <Tab value="overview" title="Overview">
              Rooms, photos, and the work planned for this year.
            </Tab>
            <Tab value="units" title="Units">
              Twelve apartments sit in this building.
            </Tab>
            <Tab value="documents" title="Documents">
              No documents uploaded.
            </Tab>
          </Tabs>
        </div>
      </Section>
    </Doc>
  )
}

export function TooltipPage() {
  return (
    <Doc title="Tooltip">
      <Section
        title="Placement"
        code={`<Tooltip content="Shown above" placement="top">
  <Button text="Top" />
</Tooltip>
<Tooltip content="Shown below" placement="bottom">
  <Button text="Bottom" />
</Tooltip>
<Tooltip content={<div><header>Estimate</header>This price is not confirmed.</div>}>
  <Button text="With title" />
</Tooltip>`}
      >
        <Tooltip content="Shown above" placement="top">
          <Button text="Top" />
        </Tooltip>
        <Tooltip content="Shown below" placement="bottom">
          <Button text="Bottom" />
        </Tooltip>
        <Tooltip
          content={
            <div>
              <header>Estimate</header>This price is not confirmed.
            </div>
          }
        >
          <Button text="With title" />
        </Tooltip>
      </Section>
    </Doc>
  )
}

export function MenuPage() {
  const [last, setLast] = useState('None')
  return (
    <Doc title="Menu">
      <Section
        title="Options"
        code={`<DropdownMenu
  title="Actions"
  icon="chevron-down"
  options={menuOptions}
  onSelect={(option) => setLast(option.label ?? option.key)}
/>`}
      >
        <DropdownMenu
          title="Actions"
          icon="chevron-down"
          options={menuOptions}
          onSelect={(option) => setLast(option.label ?? option.key)}
        />
        <span className={styles.note}>Selected · {last}</span>
      </Section>
      <Section
        title="Icon only"
        code={`<DropdownMenu
  icon="more-horizontal"
  options={menuOptions}
  onSelect={(option) => setLast(option.label ?? option.key)}
/>`}
      >
        <DropdownMenu
          icon="more-horizontal"
          options={menuOptions}
          onSelect={(option) => setLast(option.label ?? option.key)}
        />
      </Section>
    </Doc>
  )
}

export function NavigationMenuPage() {
  const [last, setLast] = useState('None')
  return (
    <Doc title="Navigation menu">
      <Section
        title="Panels"
        code={`<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Portfolio</NavigationMenuTrigger>
      <NavigationMenuContent layout="grid">
        <NavigationMenuLink
          href="#"
          icon="home"
          title="Buildings"
          description="Addresses, photos, and the work planned this year."
          onSelect={() => setLast('Buildings')}
        />
        <NavigationMenuLink
          href="#"
          icon="layers"
          title="Units"
          description="Apartments and rooms inside a building."
          onSelect={() => setLast('Units')}
        />
        <NavigationMenuLink
          href="#"
          icon="clipboard"
          title="Documents"
          description="Plans, surveys, and exported files."
          onSelect={() => setLast('Documents')}
        />
        <NavigationMenuLink
          href="#"
          icon="map"
          title="Map"
          description="Where the portfolio sits."
          onSelect={() => setLast('Map')}
        />
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Work</NavigationMenuTrigger>
      <NavigationMenuContent layout="stack">
        <NavigationMenuLink
          href="#"
          icon="calendar"
          title="Planned"
          description="Jobs that have not started."
          onSelect={() => setLast('Planned')}
        />
        <NavigationMenuLink
          href="#"
          icon="clock"
          title="In progress"
          description="Jobs on site this week."
          onSelect={() => setLast('In progress')}
        />
        <NavigationMenuLink
          href="#"
          icon="check"
          title="Done"
          description="Jobs signed off."
          onSelect={() => setLast('Done')}
        />
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="#">
        Pricing
      </NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`}
      >
        <div className={styles.navFrame}>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Portfolio</NavigationMenuTrigger>
                <NavigationMenuContent layout="grid">
                  <NavigationMenuLink
                    href="#"
                    icon="home"
                    title="Buildings"
                    description="Addresses, photos, and the work planned this year."
                    onSelect={() => setLast('Buildings')}
                  />
                  <NavigationMenuLink
                    href="#"
                    icon="layers"
                    title="Units"
                    description="Apartments and rooms inside a building."
                    onSelect={() => setLast('Units')}
                  />
                  <NavigationMenuLink
                    href="#"
                    icon="clipboard"
                    title="Documents"
                    description="Plans, surveys, and exported files."
                    onSelect={() => setLast('Documents')}
                  />
                  <NavigationMenuLink
                    href="#"
                    icon="map"
                    title="Map"
                    description="Where the portfolio sits."
                    onSelect={() => setLast('Map')}
                  />
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Work</NavigationMenuTrigger>
                <NavigationMenuContent layout="stack">
                  <NavigationMenuLink
                    href="#"
                    icon="calendar"
                    title="Planned"
                    description="Jobs that have not started."
                    onSelect={() => setLast('Planned')}
                  />
                  <NavigationMenuLink
                    href="#"
                    icon="clock"
                    title="In progress"
                    description="Jobs on site this week."
                    onSelect={() => setLast('In progress')}
                  />
                  <NavigationMenuLink
                    href="#"
                    icon="check"
                    title="Done"
                    description="Jobs signed off."
                    onSelect={() => setLast('Done')}
                  />
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  onSelect={() => setLast('Pricing')}
                >
                  Pricing
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <span className={styles.note}>Selected · {last}</span>
        </div>
      </Section>
      <Section
        title="Submenu"
        code={`<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Guides</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuSub defaultValue="foundations">
          <NavigationMenuList>
            <NavigationMenuItem value="foundations">
              <NavigationMenuTrigger>Foundations</NavigationMenuTrigger>
              <NavigationMenuContent layout="stack">
                <NavigationMenuLink
                  href="#"
                  title="Colors"
                  description="Surfaces, text, and status."
                />
                <NavigationMenuLink
                  href="#"
                  title="Radius"
                  description="Corners for controls and containers."
                />
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem value="components">
              <NavigationMenuTrigger>Components</NavigationMenuTrigger>
              <NavigationMenuContent layout="stack">
                <NavigationMenuLink
                  href="#"
                  title="Button"
                  description="Actions, with and without icons."
                />
                <NavigationMenuLink
                  href="#"
                  title="Menu"
                  description="Actions in a dropdown."
                />
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenuSub>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`}
      >
        <div className={styles.navFrame}>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Guides</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuSub defaultValue="foundations">
                    <NavigationMenuList>
                      <NavigationMenuItem value="foundations">
                        <NavigationMenuTrigger>
                          Foundations
                        </NavigationMenuTrigger>
                        <NavigationMenuContent layout="stack">
                          <NavigationMenuLink
                            href="#"
                            title="Colors"
                            description="Surfaces, text, and status."
                          />
                          <NavigationMenuLink
                            href="#"
                            title="Radius"
                            description="Corners for controls and containers."
                          />
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                      <NavigationMenuItem value="components">
                        <NavigationMenuTrigger>
                          Components
                        </NavigationMenuTrigger>
                        <NavigationMenuContent layout="stack">
                          <NavigationMenuLink
                            href="#"
                            title="Button"
                            description="Actions, with and without icons."
                          />
                          <NavigationMenuLink
                            href="#"
                            title="Menu"
                            description="Actions in a dropdown."
                          />
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenuSub>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </Section>
    </Doc>
  )
}

export function ContextMenuPage() {
  const [last, setLast] = useState('None')
  return (
    <Doc title="Context menu">
      <Section
        title="Right click"
        code={`<ContextMenu
  options={menuOptions}
  onSelect={(option) => setLast(option.label ?? option.key)}
>
  <div>Right click</div>
</ContextMenu>`}
      >
        <ContextMenu
          options={menuOptions}
          onSelect={(option) => setLast(option.label ?? option.key)}
        >
          <div className={styles.contextTarget}>Right click</div>
        </ContextMenu>
        <span className={styles.note}>Selected · {last}</span>
      </Section>
    </Doc>
  )
}

export function DialogPage() {
  const [open, setOpen] = useState(false)
  const [wide, setWide] = useState(false)
  return (
    <Doc title="Dialog">
      <Section
        title="Default"
        code={`<Button text="Open dialog" onClick={() => { setWide(false); setOpen(true) }} />
<Button text="Wide dialog" onClick={() => { setWide(true); setOpen(true) }} />
<Modal
  open={open}
  wide={wide}
  width={480}
  onClose={() => setOpen(false)}
  title="Add building"
  footer={
    <>
      <Button text="Cancel" onClick={() => setOpen(false)} />
      <Button text="Add" variant="primary" onClick={() => setOpen(false)} />
    </>
  }
>
  <p>Name the building and choose the portfolio it belongs to. You can add the floor area later.</p>
</Modal>`}
      >
        <Button
          text="Open dialog"
          onClick={() => {
            setWide(false)
            setOpen(true)
          }}
        />
        <Button
          text="Wide dialog"
          onClick={() => {
            setWide(true)
            setOpen(true)
          }}
        />
      </Section>
      <Modal
        open={open}
        wide={wide}
        width={480}
        onClose={() => setOpen(false)}
        title="Add building"
        footer={
          <>
            <Button text="Cancel" onClick={() => setOpen(false)} />
            <Button
              text="Add"
              variant="primary"
              onClick={() => setOpen(false)}
            />
          </>
        }
      >
        <p className={styles.prose}>
          Name the building and choose the portfolio it belongs to. You can add
          the floor area later.
        </p>
      </Modal>
    </Doc>
  )
}

const drawerSides: { side: DrawerSide; label: string }[] = [
  { side: 'bottom', label: 'Bottom' },
  { side: 'top', label: 'Top' },
  { side: 'right', label: 'Right' },
  { side: 'left', label: 'Left' },
]

export function DrawerPage() {
  const [open, setOpen] = useState(false)
  const [withClose, setWithClose] = useState(false)
  const [side, setSide] = useState<DrawerSide>('bottom')
  const [directionOpen, setDirectionOpen] = useState(false)

  return (
    <Doc title="Drawer">
      <Section
        title="Default"
        code={`<Button text="Open drawer" onClick={() => setOpen(true)} />
<Drawer
  open={open}
  onClose={() => setOpen(false)}
  title="Details"
  description="Review the details, then close this panel."
  footer={<Button text="Close" fullWidth onClick={() => setOpen(false)} />}
/>`}
      >
        <Button text="Open drawer" onClick={() => setOpen(true)} />
      </Section>
      <Section
        title="With close button"
        code={`<Button text="Open drawer" onClick={() => setWithClose(true)} />
<Drawer
  open={withClose}
  showCloseButton
  onClose={() => setWithClose(false)}
  title="Details"
  description="Review the details, then close this panel."
  footer={<Button text="Close" fullWidth onClick={() => setWithClose(false)} />}
/>`}
      >
        <Button text="Open drawer" onClick={() => setWithClose(true)} />
      </Section>
      <Section
        title="Directions"
        code={`<Button text="Bottom" onClick={() => { setSide('bottom'); setDirectionOpen(true) }} />
<Button text="Top" onClick={() => { setSide('top'); setDirectionOpen(true) }} />
<Button text="Right" onClick={() => { setSide('right'); setDirectionOpen(true) }} />
<Button text="Left" onClick={() => { setSide('left'); setDirectionOpen(true) }} />
<Drawer
  open={directionOpen}
  side={side}
  onClose={() => setDirectionOpen(false)}
  title="Details"
  description="Review the details, then close this panel."
  footer={<Button text="Close" fullWidth onClick={() => setDirectionOpen(false)} />}
/>`}
      >
        {drawerSides.map((item) => (
          <Button
            key={item.side}
            text={item.label}
            onClick={() => {
              setSide(item.side)
              setDirectionOpen(true)
            }}
          />
        ))}
      </Section>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Details"
        description="Review the details, then close this panel."
        footer={
          <Button text="Close" fullWidth onClick={() => setOpen(false)} />
        }
      />
      <Drawer
        open={withClose}
        showCloseButton
        onClose={() => setWithClose(false)}
        title="Details"
        description="Review the details, then close this panel."
        footer={
          <Button text="Close" fullWidth onClick={() => setWithClose(false)} />
        }
      />
      <Drawer
        open={directionOpen}
        side={side}
        onClose={() => setDirectionOpen(false)}
        title="Details"
        description="Review the details, then close this panel."
        footer={
          <Button
            text="Close"
            fullWidth
            onClick={() => setDirectionOpen(false)}
          />
        }
      />
    </Doc>
  )
}

export function ConfirmPage() {
  const confirm = useConfirm()
  const [result, setResult] = useState('No decision yet')
  return (
    <Doc title="Confirm">
      <Section
        title="Decision"
        code={`<Button
  text="Delete building"
  variant="delete"
  onClick={() => {
    void confirm({
      title: 'Delete this building?',
      message: 'Photos, notes, and documents for this building will be removed.',
    }).then((accepted) => setResult(accepted ? 'Confirmed' : 'Cancelled'))
  }}
/>`}
      >
        <Button
          text="Delete building"
          variant="delete"
          onClick={() => {
            void confirm({
              title: 'Delete this building?',
              message:
                'Photos, notes, and documents for this building will be removed.',
            }).then((accepted) =>
              setResult(accepted ? 'Confirmed' : 'Cancelled'),
            )
          }}
        />
        <span className={styles.note}>{result}</span>
      </Section>
    </Doc>
  )
}

export function CardPage() {
  return (
    <Doc title="Card">
      <Section
        title="Collapsible"
        align="start"
        code={`<Card collapsible section="docs-details">
  <CardHeader title="Details" icon="layers" action={<Button small text="Edit" />} />
  <CardContent>
    <p>Walls, roof, and windows. Areas shown here come from the latest survey.</p>
  </CardContent>
  <CardFooter>
    <Button text="Open details" />
  </CardFooter>
</Card>`}
      >
        <Card collapsible section="docs-details">
          <CardHeader
            title="Details"
            icon="layers"
            action={<Button small text="Edit" />}
          />
          <CardContent>
            {/* <p className={styles.prose}>Walls, roof, and windows. Areas shown here come from the latest survey.</p> */}
            <List divider>
              <li className={styles.pageRow}>
                <p>Kitchen · 1998</p>
              </li>
              <li className={styles.pageRow}>
                <p>Bathroom · 2021</p>
              </li>
              <li className={styles.pageRow}>
                <p>Windows · planned</p>
              </li>
            </List>
          </CardContent>
          <CardFooter>
            <Button text="Open details" />
          </CardFooter>
        </Card>
      </Section>
    </Doc>
  )
}

export function InputPage() {
  const [value, setValue] = useState('Bahnhofstrasse 12')
  const [bad, setBad] = useState('')
  return (
    <Doc title="Input">
      <Section
        title="Edit"
        align="start"
        code={`<TextInput edit allowEmpty value={value} onValueChange={setValue} />`}
      >
        <div className={styles.field}>
          <TextInput edit allowEmpty value={value} onValueChange={setValue} />
        </div>
      </Section>
      <Section
        title="Required"
        align="start"
        code={`<TextInput edit value={bad} minLength={3} onValueChange={setBad} placeholder="At least 3 characters" />`}
      >
        <div className={styles.field}>
          <TextInput
            edit
            value={bad}
            minLength={3}
            onValueChange={setBad}
            placeholder="At least 3 characters"
          />
        </div>
      </Section>
      <Section
        title="Read only"
        align="start"
        code={`<TextInput value={value} />`}
      >
        <div className={styles.field}>
          <TextInput value={value} />
        </div>
      </Section>
    </Doc>
  )
}

export function TextAreaPage() {
  const [value, setValue] = useState('Roof replaced in 2014. Kitchen original.')
  return (
    <Doc title="Textarea input">
      <Section
        title="Note"
        align="start"
        code={`<TextAreaInput edit allowEmpty value={value} onValueChange={setValue} />`}
      >
        <div className={styles.field}>
          <TextAreaInput
            edit
            allowEmpty
            value={value}
            onValueChange={setValue}
          />
        </div>
      </Section>
    </Doc>
  )
}

export function NumberPage() {
  const [value, setValue] = useState<number | null>(1280)
  const [size, setSize] = useState<number | null>(1280)
  const [count, setCount] = useState<number | null>(4)
  return (
    <Doc title="Number input">
      <Section
        title="With units"
        align="start"
        code={`<NumberInput edit optional value={value} units="m²" onValueChange={setValue} />`}
      >
        <div className={styles.field}>
          <NumberInput
            edit
            optional
            value={value}
            units="m²"
            onValueChange={setValue}
          />
        </div>
      </Section>
      <Section
        title="Step"
        align="start"
        code={`<NumberInput edit value={size} step={10} min={0} max={1300} units="m²" onValueChange={setSize} />
<NumberInput edit value={count} step={1} min={1} max={6} onValueChange={setCount} />`}
      >
        <div className={styles.stack}>
          <div className={styles.field}>
            <NumberInput
              edit
              value={size}
              step={10}
              min={0}
              max={1300}
              units="m²"
              onValueChange={setSize}
            />
          </div>
          <div className={styles.field}>
            <NumberInput
              edit
              value={count}
              step={1}
              min={1}
              max={6}
              onValueChange={setCount}
            />
          </div>
        </div>
      </Section>
      <Section
        title="Out of range"
        align="start"
        code={`<NumberInput edit value={240} min={0} max={100} units="%" />`}
      >
        <div className={styles.field}>
          <NumberInput edit value={240} min={0} max={100} units="%" />
        </div>
      </Section>
    </Doc>
  )
}

export function DatePage() {
  const [value, setValue] = useState('2024-06-01')
  const [blocked, setBlocked] = useState('2024-01-01')
  return (
    <Doc title="Date picker">
      <Section
        title="Date"
        align="start"
        code={`<DatePicker edit value={value} onValueChange={setValue} />`}
      >
        <div className={styles.field}>
          <DatePicker edit value={value} onValueChange={setValue} />
        </div>
      </Section>
      <Section
        title="Blocked"
        align="start"
        code={`<DatePicker
  edit
  value={value}
  onValueChange={setValue}
  invalidValues={['2024-01-01']}
  invalidValuesErrorMessage="This date is already booked"
/>`}
      >
        <div className={styles.field}>
          <DatePicker
            edit
            value={blocked}
            onValueChange={setBlocked}
            invalidValues={['2024-01-01']}
            invalidValuesErrorMessage="This date is already booked"
          />
        </div>
      </Section>
      <Section
        title="Read only"
        align="start"
        code={`<DatePicker value={value} />`}
      >
        <DatePicker value={value} />
      </Section>
    </Doc>
  )
}

export function SelectPage() {
  const [value, setValue] = useState<string | number | null>('house')
  return (
    <Doc title="Select input">
      <Section
        title="Type"
        align="start"
        code={`<SelectInput
  edit
  clearable
  value={value}
  onValueChange={setValue}
  options={[
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'office', label: 'Office' },
    { value: 'land', label: 'Land' },
  ]}
/>`}
      >
        <div className={styles.field}>
          <SelectInput
            edit
            clearable
            value={value}
            onValueChange={setValue}
            options={[
              { value: 'apartment', label: 'Apartment' },
              { value: 'house', label: 'House' },
              { value: 'office', label: 'Office' },
              { value: 'land', label: 'Land' },
            ]}
          />
        </div>
      </Section>
    </Doc>
  )
}

export function SliderPage() {
  const [volume, setVolume] = useState(40)
  const [weight, setWeight] = useState(400)
  const [price, setPrice] = useState([25, 75])
  const [marked, setMarked] = useState(50)
  return (
    <Doc title="Slider">
      <Section
        title="Simple"
        align="start"
        code={`<Slider label="Volume" value={volume} onValueChange={setVolume} />`}
      >
        <div className={styles.field}>
          <Slider label="Volume" value={volume} onValueChange={setVolume} />
        </div>
      </Section>
      <Section
        title="Steps"
        align="start"
        code={`<Slider label="Weight" min={100} max={900} step={100} value={weight} onValueChange={setWeight} />`}
      >
        <div className={styles.field}>
          <Slider
            label="Weight"
            min={100}
            max={900}
            step={100}
            value={weight}
            onValueChange={setWeight}
          />
        </div>
      </Section>
      <Section
        title="Range"
        align="start"
        code={`<Slider
  label="Price"
  value={price}
  onValueChange={setPrice}
  thumbLabels={['Minimum price', 'Maximum price']}
/>`}
      >
        <div className={styles.field}>
          <Slider
            label="Price"
            value={price}
            onValueChange={setPrice}
            thumbLabels={['Minimum price', 'Maximum price']}
          />
        </div>
      </Section>
      <Section
        title="Marks"
        align="start"
        code={`<Slider
  label="Volume"
  step={25}
  value={marked}
  onValueChange={setMarked}
  marks={[0, 25, 50, 75, 100]}
/>`}
      >
        <div className={styles.field}>
          <Slider
            label="Volume"
            step={25}
            value={marked}
            onValueChange={setMarked}
            marks={[0, 25, 50, 75, 100]}
          />
        </div>
      </Section>
    </Doc>
  )
}

export function CheckboxPage() {
  const [active, setActive] = useState(true)
  return (
    <Doc title="Checkbox input">
      <Section
        title="Edit"
        code={`<CheckInput edit label="Building is active" value={active} onValueChange={setActive} />`}
      >
        <CheckInput
          edit
          label="Building is active"
          value={active}
          onValueChange={setActive}
        />
      </Section>
      <Section
        title="Read only"
        code={`<CheckInput value={active} activeLabel="Active" inactiveLabel="Inactive" />`}
      >
        <CheckInput
          value={active}
          activeLabel="Active"
          inactiveLabel="Inactive"
        />
      </Section>
    </Doc>
  )
}

export function ColorPage() {
  const [value, setValue] = useState('#36b908')
  const [alphaValue, setAlphaValue] = useState('#36b908cc')
  return (
    <Doc title="Color picker">
      <Section
        title="Hex"
        align="start"
        code={`<ColorPicker edit value={value} onValueChange={setValue} />`}
      >
        <div className={styles.field}>
          <ColorPicker edit value={value} onValueChange={setValue} />
        </div>
      </Section>
      <Section
        title="With alpha"
        align="start"
        code={`<ColorPicker edit alpha value={value} onValueChange={setValue} />`}
      >
        <div className={styles.field}>
          <ColorPicker
            edit
            alpha
            value={alphaValue}
            onValueChange={setAlphaValue}
          />
        </div>
      </Section>
      <Section
        title="Channels"
        align="start"
        code={`<ColorPickerPanel value={value} onValueChange={setValue} />
<ColorPickerPanel alpha value={alphaValue} onValueChange={setAlphaValue} />`}
      >
        <ColorPickerPanel value={value} onValueChange={setValue} />
        <ColorPickerPanel
          alpha
          value={alphaValue}
          onValueChange={setAlphaValue}
        />
      </Section>
      <Section
        title="Read only"
        align="start"
        code={`<ColorPicker value={value} />`}
      >
        <ColorPicker value={value} />
      </Section>
    </Doc>
  )
}

function BuildingScene({ renovated = false }: { renovated?: boolean }) {
  const sky = renovated ? '#d7eef6' : '#e4e4e4'
  const ground = renovated ? '#d3e8c4' : '#d0d0d0'
  const wall = renovated ? '#fafafa' : '#f3f3f3'
  const line = renovated ? '#e3e3e3' : '#c8c8c8'
  const glass = renovated ? '#243038' : '#ececec'
  const door = renovated ? '#36b908' : '#cfcfcf'
  const foliage = renovated ? '#3aaa4a' : '#c4c4c4'
  const trunk = renovated ? '#6b5344' : '#bdbdbd'
  const windows = [0, 1, 2].flatMap((column) =>
    [0, 1].map((row) => {
      const x = 202 + column * 72
      const y = 148 + row * 52
      return (
        <rect
          key={`${column}-${row}`}
          x={x}
          y={y}
          width="52"
          height="36"
          rx="2"
          fill={glass}
          stroke={renovated ? 'none' : line}
        />
      )
    }),
  )

  return (
    <svg
      viewBox="0 0 600 400"
      role="img"
      aria-label={
        renovated ? 'Building after renovation' : 'Building before renovation'
      }
    >
      <rect width="600" height="400" fill={sky} />
      <circle
        cx="508"
        cy="74"
        r="26"
        fill={renovated ? '#f1c757' : '#d5d5d5'}
      />
      <rect y="286" width="600" height="114" fill={ground} />
      <rect x="82" y="286" width="8" height="36" fill={trunk} />
      <rect x="516" y="292" width="8" height="30" fill={trunk} />
      <circle cx="86" cy="278" r="34" fill={foliage} />
      <circle cx="520" cy="286" r="26" fill={renovated ? '#2f9a42' : foliage} />
      <rect
        x="168"
        y="124"
        width="264"
        height="176"
        fill={wall}
        stroke={line}
      />
      {windows}
      <rect x="274" y="246" width="52" height="54" fill={door} />
    </svg>
  )
}

export function ComparePage() {
  return (
    <Doc title="Compare">
      <Section
        title="Horizontal"
        align="start"
        code={`<Compare
  beforeLabel="Before"
  afterLabel="After"
  before={<BuildingScene />}
  after={<BuildingScene renovated />}
/>`}
      >
        <div className={styles.stretch}>
          <Compare
            beforeLabel="Before"
            afterLabel="After"
            before={<BuildingScene />}
            after={<BuildingScene renovated />}
          />
        </div>
      </Section>
    </Doc>
  )
}

export function InfoPage() {
  return (
    <Doc title="Info">
      <Section
        title="Types"
        align="start"
        code={`<Info title="Price per m²">
  Asking price divided by floor area. Taken from the latest listing.
</Info>
<Info type="warning" title="Incomplete listing">
  Floor area is missing, so this figure is an upper bound.
</Info>
<Info type="error" title="Missing price">
  The listing has no price, so this figure cannot be shown.
</Info>`}
      >
        <div className={styles.stack}>
          <FlexBoxRow>
            <span>Price per m²</span>
            <Info title="Price per m²">
              Asking price divided by floor area. Taken from the latest listing.
            </Info>
          </FlexBoxRow>
          <FlexBoxRow>
            <span>CHF 4,200 / m²</span>
            <Info type="warning" title="Incomplete listing">
              Floor area is missing, so this figure is an upper bound.
            </Info>
          </FlexBoxRow>
          <FlexBoxRow>
            <span>CHF — / m²</span>
            <Info type="error" title="Missing price">
              The listing has no price, so this figure cannot be shown.
            </Info>
          </FlexBoxRow>
        </div>
      </Section>
    </Doc>
  )
}

const askingPrices = [
  890_000, 1_250_000, 1_480_000, 2_340_000, 3_200_000, 12_500_000,
]
const squareMetrePrices = [2740, 3850, 4320, 6100, 8900]
const listingChanges = [0.042, -0.018, 0.126, -0.073, 0.008]

function pickNext<T>(options: T[], current: T) {
  const choices = options.filter((option) => option !== current)
  return choices[Math.floor(Math.random() * choices.length)]
}

export function NumberFlowPage() {
  const [price, setPrice] = useState(1_480_000)
  const [rate, setRate] = useState(4320)
  const [change, setChange] = useState(0.042)
  return (
    <Doc title="Number flow">
      <Section
        title="Asking price"
        code={`<NumberFlow
  locales="de-CH"
  format={{ style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }}
  value={price}
/>`}
      >
        <div className={styles.flowStack}>
          <NumberFlow
            className={styles.flowValue}
            locales="de-CH"
            format={{
              style: 'currency',
              currency: 'CHF',
              maximumFractionDigits: 0,
            }}
            value={price}
          />
          <Button
            text="New asking price"
            onClick={() =>
              setPrice((current) => pickNext(askingPrices, current))
            }
          />
        </div>
      </Section>
      <Section
        title="Per square metre"
        code={`<NumberFlow
  locales="de-CH"
  format={{ style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }}
  suffix=" / m²"
  value={rate}
/>`}
      >
        <div className={styles.flowStack}>
          <NumberFlow
            className={styles.flowRate}
            locales="de-CH"
            format={{
              style: 'currency',
              currency: 'CHF',
              maximumFractionDigits: 0,
            }}
            suffix=" / m²"
            value={rate}
          />
          <Button
            text="New price"
            onClick={() =>
              setRate((current) => pickNext(squareMetrePrices, current))
            }
          />
        </div>
      </Section>
      <Section
        title="Since listing"
        code={`<NumberFlow
  locales="de-CH"
  format={{ style: 'percent', maximumFractionDigits: 1, signDisplay: 'exceptZero' }}
  value={change}
/>`}
      >
        <div className={styles.flowStack}>
          <NumberFlow
            className={
              change > 0
                ? `${styles.flowDelta} ${styles.flowUp}`
                : change < 0
                  ? `${styles.flowDelta} ${styles.flowDown}`
                  : styles.flowDelta
            }
            locales="de-CH"
            format={{
              style: 'percent',
              maximumFractionDigits: 1,
              signDisplay: 'exceptZero',
            }}
            value={change}
          />
          <Button
            text="New change"
            onClick={() =>
              setChange((current) => pickNext(listingChanges, current))
            }
          />
        </div>
      </Section>
    </Doc>
  )
}

const buildings = Array.from(
  { length: 42 },
  (_, index) => `Building ${index + 1}`,
)

export function PaginationPage() {
  const data = useMemo(() => buildings, [])
  const [visible, setVisible] = useState<string[]>([])
  return (
    <Doc title="Pagination">
      <Section
        title="Buildings"
        align="start"
        code={`<Pagination data={buildings} pageSize={8} onPageChange={(page) => setVisible(page)} />`}
      >
        <div className={styles.stack}>
          <List divider>
            {visible.map((item) => (
              <li key={item} className={styles.pageRow}>
                {item}
              </li>
            ))}
          </List>
          <Pagination
            data={data}
            pageSize={8}
            onPageChange={(page) => setVisible(page)}
          />
        </div>
      </Section>
    </Doc>
  )
}

export function PillPage() {
  return (
    <Doc title="Pill">
      <Section
        title="Variants"
        code={`<Pill>Default</Pill>
<Pill variant="transparent">Transparent</Pill>
<Pill variant="inverted">Inverted</Pill>
<Pill variant="outline">Outline</Pill>
<Pill variant="danger">Danger</Pill>
<Pill variant="brand">Brand</Pill>`}
      >
        <Pill>Default</Pill>
        <Pill variant="transparent">Transparent</Pill>
        <Pill variant="inverted">Inverted</Pill>
        <Pill variant="outline">Outline</Pill>
        <Pill variant="danger">Danger</Pill>
        <Pill variant="brand">Brand</Pill>
      </Section>
      <Section
        title="Sizes"
        code={`<Pill size="small">Small</Pill>
<Pill>Medium</Pill>
<Pill size="large">Large</Pill>`}
      >
        <Pill size="small">Small</Pill>
        <Pill>Medium</Pill>
        <Pill size="large">Large</Pill>
      </Section>
      <Section
        title="With icon"
        code={`<Pill icon="check">Active</Pill>
<Pill icon="alert-circle" variant="danger">Overdue</Pill>`}
      >
        <Pill icon="check">Active</Pill>
        <Pill icon="alert-circle" variant="danger">
          Overdue
        </Pill>
      </Section>
    </Doc>
  )
}

export function RadioCardsPage() {
  const [plan, setPlan] = useState('apartment')
  const [view, setView] = useState('grid')
  const [heat, setHeat] = useState('gas')
  return (
    <Doc title="Radio cards">
      <Section
        title="Default"
        align="start"
        code={`<RadioCards
  aria-label="Building type"
  columns={3}
  value={plan}
  onValueChange={setPlan}
>
  <RadioCard value="studio" title="Studio" description="One room, 32 m²" />
  <RadioCard value="apartment" title="Apartment" description="Three rooms, 78 m²" />
  <RadioCard value="house" title="House" description="Five rooms, 140 m²" />
</RadioCards>`}
      >
        <RadioCards
          aria-label="Building type"
          columns={3}
          value={plan}
          onValueChange={setPlan}
        >
          <RadioCard
            value="studio"
            title="Studio"
            description="One room, 32 m²"
          />
          <RadioCard
            value="apartment"
            title="Apartment"
            description="Three rooms, 78 m²"
          />
          <RadioCard
            value="house"
            title="House"
            description="Five rooms, 140 m²"
          />
        </RadioCards>
      </Section>
      <Section
        title="Custom content"
        align="start"
        code={`<RadioCards columns={3} value={view} onValueChange={setView} aria-label="View">
  <RadioCard value="grid">
    <Icon icon="grid" width={16} />
    Grid
  </RadioCard>
  <RadioCard value="table">
    <Icon icon="table" width={16} />
    Table
  </RadioCard>
  <RadioCard value="map">
    <Icon icon="map" width={16} />
    Map
  </RadioCard>
</RadioCards>`}
      >
        <RadioCards
          columns={3}
          value={view}
          onValueChange={setView}
          aria-label="View"
        >
          <RadioCard value="grid">
            <Icon icon="grid" width={16} />
            Grid
          </RadioCard>
          <RadioCard value="table">
            <Icon icon="table" width={16} />
            Table
          </RadioCard>
          <RadioCard value="map">
            <Icon icon="map" width={16} />
            Map
          </RadioCard>
        </RadioCards>
      </Section>
      <Section
        title="In a form"
        align="start"
        code={`<FormItem layout="vertical" label="Heating">
  <RadioCards columns={3} value={heat} onValueChange={setHeat}>
    <RadioCard value="gas" title="Gas" />
    <RadioCard value="electric" title="Electric" />
    <RadioCard value="heat-pump" title="Heat pump" />
  </RadioCards>
</FormItem>`}
      >
        <div className={styles.stretch}>
          <FormItem layout="vertical" label="Heating">
            <RadioCards columns={3} value={heat} onValueChange={setHeat}>
              <RadioCard value="gas" title="Gas" />
              <RadioCard value="electric" title="Electric" />
              <RadioCard value="heat-pump" title="Heat pump" />
            </RadioCards>
          </FormItem>
        </div>
      </Section>
    </Doc>
  )
}

export function FormPage() {
  const [name, setName] = useState('Harbour House')
  const [area, setArea] = useState<number | null>(2400)
  const [project, setProject] = useState('Harbour House')
  const [floor, setFloor] = useState<number | null>(2400)
  const [state, setState] = useState<FormState>({ edit: false, isValid: true })
  return (
    <Doc title="Form">
      <Section
        title="Edit container"
        align="start"
        code={`<EditContainer
  formState={state}
  onAction={(action) => {
    if (action === 'edit') setState({ edit: true, isValid: true })
    if (action === 'cancel') setState({ edit: false, isValid: true })
    if (action === 'save') setState({ edit: false, pending: true, isValid: true })
  }}
>
  <FormItem label="Name" infoText="Shown in the portfolio list and on exports.">
    <TextInput edit={state.edit} allowEmpty value={name} onValueChange={setName} />
  </FormItem>
  <FormItem label="Area" optional>
    <NumberInput edit={state.edit} optional value={area} units="m²" onValueChange={setArea} />
  </FormItem>
</EditContainer>`}
      >
        <div className={styles.stretch}>
          <EditContainer
            formState={state}
            onAction={(action) => {
              if (action === 'edit') setState({ edit: true, isValid: true })
              if (action === 'cancel') setState({ edit: false, isValid: true })
              if (action === 'save')
                setState({ edit: false, pending: true, isValid: true })
            }}
          >
            <FormItem
              label="Name"
              infoText="Shown in the portfolio list and on exports."
            >
              <TextInput
                edit={state.edit}
                allowEmpty
                value={name}
                onValueChange={setName}
              />
            </FormItem>
            <FormItem label="Area" optional>
              <NumberInput
                edit={state.edit}
                optional
                value={area}
                units="m²"
                onValueChange={setArea}
              />
            </FormItem>
          </EditContainer>
          {state.pending ? (
            <ButtonWrapper>
              <Button
                text="Finish save"
                onClick={() => setState({ edit: false, isValid: true })}
              />
            </ButtonWrapper>
          ) : null}
        </div>
      </Section>
      <Section
        title="Vertical"
        align="start"
        code={`<FormItem layout="vertical" label="Name" infoText="Shown in the portfolio list and on exports.">
  <TextInput edit allowEmpty value={project} onValueChange={setProject} />
</FormItem>
<FormItem layout="vertical" label="Area" optional>
  <NumberInput edit optional value={floor} units="m²" onValueChange={setFloor} />
</FormItem>`}
      >
        <div className={styles.field}>
          <FormItem
            layout="vertical"
            label="Name"
            infoText="Shown in the portfolio list and on exports."
          >
            <TextInput
              edit
              allowEmpty
              value={project}
              onValueChange={setProject}
            />
          </FormItem>
          <FormItem layout="vertical" label="Area" optional>
            <NumberInput
              edit
              optional
              value={floor}
              units="m²"
              onValueChange={setFloor}
            />
          </FormItem>
        </div>
      </Section>
    </Doc>
  )
}

export function LayoutPage() {
  return (
    <Doc title="Layout">
      <Section
        title="Box"
        align="start"
        code={`<Box>Floor area is taken from the latest survey.</Box>`}
      >
        <Box>Floor area is taken from the latest survey.</Box>
      </Section>
      <Section
        title="Empty"
        align="start"
        code={`<Empty text="There aren't any units in this building." />`}
      >
        <Empty text="There aren't any units in this building." />
      </Section>
      <Section
        title="List"
        align="start"
        code={`<List divider>
  <li>Kitchen · 1998</li>
  <li>Bathroom · 2021</li>
  <li>Windows · planned</li>
</List>`}
      >
        <List divider>
          <li className={styles.pageRow}>Kitchen · 1998</li>
          <li className={styles.pageRow}>Bathroom · 2021</li>
          <li className={styles.pageRow}>Windows · planned</li>
        </List>
      </Section>
      <Section
        title="Row"
        code={`<FlexBoxRow>
  <Icon icon="map-pin" width={16} />
  <span>Zürich</span>
</FlexBoxRow>`}
      >
        <FlexBoxRow>
          <Icon icon="map-pin" width={16} />
          <span>Zürich</span>
        </FlexBoxRow>
      </Section>
    </Doc>
  )
}
