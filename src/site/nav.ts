export type NavItem = {
  title: string
  path: string
  description?: string
}

export type NavSection = {
  title?: string
  items: NavItem[]
}

export const sections: NavSection[] = [
  {
    items: [
      {
        title: 'Introduction',
        path: '/',
        description: 'A poster of the interface.',
      },
    ],
  },
  {
    title: 'Foundations',
    items: [
      {
        title: 'Brand',
        path: '/brand',
        description: 'The mark, the green, and how they are used.',
      },
      {
        title: 'Colors',
        path: '/colors',
        description: 'Surfaces, text, status, and ranking colors.',
      },
      {
        title: 'Radius',
        path: '/radius',
        description: 'Corner scale used by controls and containers.',
      },
      {
        title: 'Shadows',
        path: '/shadows',
        description: 'Elevation for tiles, menus, and dialogs.',
      },
    ],
  },
  {
    title: 'Typography',
    items: [
      {
        title: 'Font families',
        path: '/fonts',
        description: 'Inter is the interface face.',
      },
      {
        title: 'Headings',
        path: '/heading',
        description: 'Sizes for page and section titles.',
      },
      {
        title: 'Text',
        path: '/text',
        description: 'Body copy used across the product.',
      },
      {
        title: 'Caption',
        path: '/caption',
        description: 'Secondary labels and metadata.',
      },
    ],
  },
  {
    title: 'Primitives',
    items: [
      {
        title: 'Button',
        path: '/button',
        description: 'Actions, with and without icons.',
      },
      {
        title: 'Card',
        path: '/card',
        description: 'A bordered section that can collapse.',
      },
      {
        title: 'Checkbox input',
        path: '/checkbox',
        description: 'A boolean choice with a label.',
      },
      {
        title: 'Color picker',
        path: '/color',
        description: 'A hex color, picked or typed.',
      },
      {
        title: 'Compare',
        path: '/compare',
        description: 'Two views, split by a draggable divider.',
      },
      {
        title: 'Confirm',
        path: '/confirm',
        description: 'A decision that must be explicit.',
      },
      {
        title: 'Context menu',
        path: '/context-menu',
        description: 'Actions opened at the pointer with a right click.',
      },
      {
        title: 'Date picker',
        path: '/date',
        description: 'A date you can type or pick from a calendar.',
      },
      {
        title: 'Dialog',
        path: '/dialog',
        description: 'A modal surface for a focused task.',
      },
      {
        title: 'Drawer',
        path: '/drawer',
        description: 'A panel that slides in from the edge of the screen.',
      },
      {
        title: 'Form',
        path: '/form',
        description: 'Field labels, edit state, and save actions.',
      },
      { title: 'Icon', path: '/icon', description: 'The icon set.' },
      {
        title: 'Info',
        path: '/info',
        description: 'Help, a caution, or an error beside a label.',
      },
      {
        title: 'Input',
        path: '/input',
        description: 'Single-line text, with validation.',
      },
      {
        title: 'Layout',
        path: '/layout',
        description: 'Box, empty state, list, and horizontal rows.',
      },
      {
        title: 'Menu',
        path: '/menu',
        description: 'Actions in a dropdown, including submenus.',
      },
      {
        title: 'Navigation menu',
        path: '/navigation-menu',
        description: 'A bar of links, with panels for groups of pages.',
      },
      {
        title: 'Number flow',
        path: '/number-flow',
        description: 'A number that rolls into its next value.',
      },
      {
        title: 'Number input',
        path: '/number',
        description: 'Numeric values with optional units.',
      },
      {
        title: 'Pagination',
        path: '/pagination',
        description: 'Page through a list.',
      },
      {
        title: 'Pill',
        path: '/pill',
        description: 'A short label with fully round corners.',
      },
      {
        title: 'Radio cards',
        path: '/radio-cards',
        description: 'A single choice, shown as cards.',
      },
      {
        title: 'Select input',
        path: '/select',
        description: 'One choice from a list.',
      },
      {
        title: 'Slider',
        path: '/slider',
        description: 'A value, or a range, along a track.',
      },
      {
        title: 'Spinner',
        path: '/spinner',
        description: 'Pending state for buttons and forms.',
      },
      {
        title: 'Switch',
        path: '/switch',
        description: 'An on or off setting.',
      },
      {
        title: 'Tabs',
        path: '/tabs',
        description: 'Switch between views in a group.',
      },
      {
        title: 'Textarea input',
        path: '/textarea',
        description: 'Multi-line text.',
      },
      {
        title: 'Toggle',
        path: '/toggle',
        description: 'A single-choice segmented control.',
      },
      {
        title: 'Tooltip',
        path: '/tooltip',
        description: 'Short hints on hover or focus.',
      },
    ],
  },
]

export const pages = sections.flatMap((section) => section.items)
