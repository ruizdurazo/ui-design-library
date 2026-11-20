# UI Design Library

A modern UI component library built for React.

The library is built on top of Radix UI primitives when possible.

Icons are a mix of Feather, Iconoir, and a few custom ones.

## Stack

- React
- TypeScript
- Vite
- Radix UI
- SCSS modules

## Components

- `Button` — Actions, with and without icons.
- `ButtonWrapper` — A row of buttons.
- `Card` — A bordered section that can collapse. Also `CardHeader`, `CardContent`, and `CardFooter`.
- `CheckInput` — A boolean choice with a label.
- `ColorPicker` — A hex color, picked or typed. Also `ColorPickerPanel`.
- `Compare` — Two views, split by a draggable divider.
- `ConfirmProvider` — A decision that must be explicit. Open it with `useConfirm`.
- `ContextMenu` — Actions opened at the pointer with a right click.
- `DatePicker` — A date you can type or pick from a calendar.
- `Drawer` — A panel that slides in from the edge of the screen.
- `DropdownMenu` — Actions in a dropdown, including submenus.
- `EditContainer` — Edit state and save actions for a form. Labels come from `FormItem` and `FormLabel`.
- `Icon` — The icon set.
- `Info` — Help, a caution, or an error beside a label.
- `LoadingSpinner` — Pending state for buttons and forms.
- `Modal` — A modal surface for a focused task.
- `NavigationMenu` — A bar of links, with panels for groups of pages.
- `NumberFlow` — A number that rolls into its next value.
- `NumberInput` — Numeric values with optional units.
- `Pagination` — Page through a list.
- `Pill` — A short label with fully round corners.
- `RadioCards` — A single choice, shown as cards. Also `RadioCard`.
- `SelectInput` — One choice from a list.
- `Slider` — A value, or a range, along a track.
- `Switch` — An on or off setting.
- `Tabs` — Switch between views in a group. Also `Tab`.
- `TextAreaInput` — Multi-line text.
- `TextInput` — Single-line text, with validation.
- `ToggleButton` — A single-choice segmented control.
- `Tooltip` — Short hints on hover or focus. Wrap the tree with `TooltipProvider`.

Layout helpers: `Box`, `Empty`, `List`, and `FlexBoxRow`.

## Scripts

```bash
pnpm install
pnpm dev
pnpm build
```

The dev server runs at http://localhost:5178.
