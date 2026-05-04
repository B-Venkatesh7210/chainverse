---
name: tds
description: Tatum Design System guide — components, design tokens, patterns, and best practices for @tatum-io/tatum-design-system
---

# Tatum Design System (TDS)

A React 19 + TypeScript component library styled with Tailwind CSS 3, built on Radix UI primitives.

**Package:** `@tatum-io/tatum-design-system` (v1.19.2)
**Storybook:** https://tatum-desing-system-ed3d1a.gitlab.io/

---

## 1. Setup & Installation

### Required Tokens

Two tokens are needed before installing. Ask the developer for these if not already set:

1. **`NPM_TOKEN`** — GitLab registry access token for the `@tatum-io/tatum-design-system` package
2. **`UNTITLEDUI_PRO_TOKEN`** — Access token for the Untitled UI Pro icon library (`@untitledui-pro/icons`)

Set them in your terminal (or add to `~/.zshrc` for persistence):

```bash
export NPM_TOKEN="your_gitlab_token"
export UNTITLEDUI_PRO_TOKEN="your_untitledui_pro_token"
```

### Install the package

Add `.npmrc` to your project (ensure it's in `.gitignore`):

```
@tatum-io:registry=https://gitlab.com/api/v4/projects/68384178/packages/npm/
//gitlab.com/api/v4/projects/68384178/packages/npm/:_authToken=${NPM_TOKEN}
```

```bash
yarn add @tatum-io/tatum-design-system
```

### Configure Tailwind

```js
// tailwind.config.js
import tdsPlugin from '@tatum-io/tatum-design-system/tailwind-plugin'

export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@tatum-io/tatum-design-system/dist/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [tdsPlugin],
}
```

### Import styles (required for Poppins font)

```tsx
import '@tatum-io/tatum-design-system/styles.css'
```

### TypeScript

Use `"moduleResolution": "node16"` or `"bundler"` in tsconfig.json.

### Widget / Shadow DOM

Add `data-tds-root="true"` to your widget container so portal-based components (Dialog, Dropdown, Tooltip, Popover) render inside the Shadow DOM with proper styles:

```tsx
<div data-tds-root="true">{/* widget content */}</div>
```

---

## 2. Import Patterns

```tsx
// Barrel import (most common)
import { Button, Card, Input } from '@tatum-io/tatum-design-system'

// Component-level import (for tree-shaking)
import { Button } from '@tatum-io/tatum-design-system/components/Button'

// Import enums alongside components
import { Button, ButtonVariant, ButtonSize, ButtonColorPalette } from '@tatum-io/tatum-design-system'

// Composition components (Dialog, Dropdown, Tabs, Popover)
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle, DialogDescription
} from '@tatum-io/tatum-design-system'

// Toast
import { Toaster, toast } from '@tatum-io/tatum-design-system'

// Field components
import { Field, Label, Hint } from '@tatum-io/tatum-design-system'

// Tailwind plugin (for tailwind.config.js)
import tdsPlugin from '@tatum-io/tatum-design-system/tailwind-plugin'
```

---

## 3. Design Tokens Reference

All tokens are available as Tailwind utilities after configuring the TDS plugin. Use the `tatum-*` prefix.

### Colors

8 color palettes, each with shades: 25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950.

| Palette | Token pattern | Role | 500 value |
|---------|--------------|------|-----------|
| `tatum-primary` | `tatum-primary-{shade}` | Brand purple | `rgba(79, 55, 253, 1)` |
| `tatum-secondary` | `tatum-secondary-{shade}` | Navy/dark blue | `rgba(28, 30, 79, 1)` |
| `tatum-tertiary` | `tatum-tertiary-{shade}` | Green/teal | `rgba(44, 205, 154, 1)` |
| `tatum-gray` | `tatum-gray-{shade}` | Standard gray | `rgba(113, 118, 128, 1)` |
| `tatum-dark-gray` | `tatum-dark-gray-{shade}` | Dark UI gray | `rgba(133, 136, 142, 1)` |
| `tatum-error` | `tatum-error-{shade}` | Error/danger red | `rgba(240, 68, 56, 1)` |
| `tatum-warning` | `tatum-warning-{shade}` | Warning orange | `rgba(247, 144, 9, 1)` |
| `tatum-success` | `tatum-success-{shade}` | Success green | `rgba(23, 178, 106, 1)` |

**Neutrals:** `tatum-white`, `tatum-black`, `tatum-transparent`

**Usage:** `bg-tatum-primary-500`, `text-tatum-gray-700`, `border-tatum-error-300`

**Common semantic mappings:**
- Page text: `text-tatum-gray-900`
- Secondary text: `text-tatum-gray-600`
- Placeholder text: `text-tatum-gray-500`
- Disabled text: `text-tatum-gray-400` / `text-tatum-gray-300`
- Borders: `border-tatum-gray-200` / `border-tatum-gray-300`
- Page background: `bg-tatum-white`
- Subtle background: `bg-tatum-gray-50`
- Brand actions: `bg-tatum-primary-500`
- Error states: `text-tatum-error-600`, `bg-tatum-error-50`
- Success states: `text-tatum-success-600`, `bg-tatum-success-50`
- Warning states: `text-tatum-warning-600`, `bg-tatum-warning-50`

### Spacing

Used with `p-`, `m-`, `gap-`, `w-`, `h-`, etc.

| Token | Value |
|-------|-------|
| `tatum-none` | 0 |
| `tatum-xxs` | 0.125rem (2px) |
| `tatum-xs` | 0.25rem (4px) |
| `tatum-sm` | 0.375rem (6px) |
| `tatum-md` | 0.5rem (8px) |
| `tatum-md-lg` | 0.625rem (10px) |
| `tatum-lg` | 0.75rem (12px) |
| `tatum-lg-xl` | 0.875rem (14px) |
| `tatum-xl` | 1rem (16px) |
| `tatum-2xl` | 1.25rem (20px) |
| `tatum-3xl` | 1.5rem (24px) |
| `tatum-4xl` | 2rem (32px) |
| `tatum-5xl` | 2.5rem (40px) |
| `tatum-6xl` | 3rem (48px) |
| `tatum-7xl` | 4rem (64px) |
| `tatum-8xl` | 5rem (80px) |
| `tatum-9xl` | 6rem (96px) |
| `tatum-10xl` | 8rem (128px) |
| `tatum-11xl` | 10rem (160px) |

### Typography

**Font family:** `font-tds` = Poppins, sans-serif

**Font sizes** (includes line-height):

| Token | Size | Line height |
|-------|------|------------|
| `text-tatum-text-xs` | 12px | 18px |
| `text-tatum-text-sm` | 14px | 20px |
| `text-tatum-text-md` | 16px | 24px |
| `text-tatum-text-lg` | 18px | 28px |
| `text-tatum-text-xl` | 20px | 30px |
| `text-tatum-heading-xs` | 24px | 32px |
| `text-tatum-heading-sm` | 30px | 38px |
| `text-tatum-heading-md` | 36px | 44px |
| `text-tatum-heading-lg` | 48px | 60px |
| `text-tatum-heading-xl` | 60px | 72px |
| `text-tatum-heading-2xl` | 72px | 90px |

**Font weights:**

| Token | Weight |
|-------|--------|
| `font-tatum-regular` | 400 |
| `font-tatum-medium` | 500 |
| `font-tatum-semibold` | 600 |
| `font-tatum-bold` | 700 |

### Border Radius

| Token | Value |
|-------|-------|
| `rounded-tatum-none` | 0 |
| `rounded-tatum-xxs` | 0.125rem (2px) |
| `rounded-tatum-xs` | 0.25rem (4px) |
| `rounded-tatum-sm` | 0.375rem (6px) |
| `rounded-tatum-md` | 0.5rem (8px) |
| `rounded-tatum-lg` | 0.625rem (10px) |
| `rounded-tatum-xl` | 0.75rem (12px) |
| `rounded-tatum-2xl` | 1rem (16px) |
| `rounded-tatum-3xl` | 1.25rem (20px) |
| `rounded-tatum-4xl` | 1.5rem (24px) |
| `rounded-tatum-full` | 50% |

### Border Width

| Token | Value |
|-------|-------|
| `border-tatum-none` | 0 |
| `border-tatum-xs` | 0.0625rem (1px) |
| `border-tatum-sm` | 0.125rem (2px) |
| `border-tatum-md` | 0.1875rem (3px) |
| `border-tatum-lg` | 0.25rem (4px) |
| `border-tatum-xl` | 0.375rem (6px) |

### Box Shadows

| Token | Description |
|-------|-------------|
| `shadow-tatum-xs` | Minimal shadow |
| `shadow-tatum-sm` | Subtle elevation |
| `shadow-tatum-md` | Card-level elevation |
| `shadow-tatum-lg` | Dropdown/popover elevation |
| `shadow-tatum-xl` | Modal-level elevation |
| `shadow-tatum-2xl` | High elevation |
| `shadow-tatum-3xl` | Maximum elevation |
| `shadow-tatum-inner` | Inset shadow |

### Transitions

**Properties:** `transition-tatum-default` (all visual), `transition-tatum-colors`, `transition-tatum-opacity`, `transition-tatum-shadow`, `transition-tatum-transform`

**Timing:** `ease-tatum-default` (ease-in-out), `ease-tatum-linear`, `ease-tatum-in`, `ease-tatum-out`, `ease-tatum-in-out`

**Durations:** `duration-tatum-fast` (150ms), `duration-tatum-normal` (300ms), `duration-tatum-slow` (500ms), `duration-tatum-very-slow` (1000ms)

### Z-Index

`z-tatum-minus-1` (-1), `z-tatum-0` (0), `z-tatum-1` (1), `z-tatum-10` (10), `z-tatum-20` (20), `z-tatum-30` (30), `z-tatum-40` (40), `z-tatum-50` (50), `z-tatum-60` (60)

---

## 4. Component Catalog

### Form Controls

#### Input

Text input with optional slots and inline description.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `error` | `boolean` | - | Shows error state (sets `aria-invalid`) |
| `slotLeft` | `ReactNode` | - | Left slot (e.g., icon, prefix) |
| `slotRight` | `ReactNode` | - | Right slot (e.g., icon, button) |
| `description` | `ReactNode` | - | Inline description shown after value |
| `inputClassName` | `string` | - | Class for the inner `<input>` element |
| `wrapperRef` | `Ref<HTMLDivElement>` | - | Ref for the outer wrapper |

#### TextArea

Multi-line text input.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `error` | `boolean` | - | Error state |
| `textareaClassName` | `string` | - | Class for inner `<textarea>` |
| `wrapperRef` | `Ref<HTMLDivElement>` | - | Ref for outer wrapper |

#### Checkbox

Radix-based checkbox with optional label.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean \| 'indeterminate'` | - | Checked state |
| `onCheckedChange` | `(checked) => void` | - | Change handler |
| `size` | `'sm' \| 'md'` | `'md'` | Checkbox size |
| `label` | `ReactNode` | - | Label text |
| `error` | `boolean` | - | Error state |
| `required` | `boolean` | - | Shows asterisk |

#### Switch

Toggle switch with optional labels.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | - | Checked state |
| `onCheckedChange` | `(checked) => void` | - | Change handler |
| `label` | `string` | - | Right-side label |
| `color` | `SwitchColor` | `Success` | Color: `White`, `Primary`, `Secondary`, `Success`, `Error` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size |
| `leftLabel` / `rightLabel` | `string` | - | Selection mode labels |
| `selectionMode` | `boolean` | `false` | Enables left/right label mode |

#### RadioGroup + RadioGroupItem

Radix radio group.

```tsx
<RadioGroup value={value} onValueChange={setValue}>
  <RadioGroupItem value="option1" size="md" />
  <RadioGroupItem value="option2" size="sm" />
</RadioGroup>
```

`RadioGroupItem` accepts `size: 'sm' | 'md'` (default `'md'`).

#### Slider

Radix slider with labels and marks.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number[]` | - | Current value(s) |
| `onValueChange` | `(values: number[]) => void` | - | Change handler |
| `min` / `max` / `step` | `number` | `0`/`100`/`1` | Range config |
| `labelType` | `SliderLabelType` | `Basic` | `None`, `Floating`, `Basic` |
| `labelFormatter` | `(value: number) => string` | - | Custom label format |
| `marks` | `{value, label}[]` | - | Mark points |
| `colorVariant` | `SliderColorVariant` | `Default` | `Default`, `Free`, `Starter`, `Pro`, `Scale`, `Business` |

#### Field, Label, Hint

Form field wrapper with label and hint. The `Hint` automatically turns red when a child input has `aria-invalid="true"`.

```tsx
<Field>
  <Label required>Email</Label>
  <Input error={!!errors.email} />
  <Hint>{errors.email || 'Enter your email address'}</Hint>
</Field>
```

#### Combobox

Searchable single-select dropdown built on Downshift.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `DropdownItem[]` | - | Array of `{ id, label, description?, icon?, disabled? }` |
| `value` | `string \| null` | - | Selected item id |
| `onChange` | `(item: DropdownItem \| null) => void` | - | Selection handler |
| `clearable` | `boolean` | `false` | Allow clearing selection |
| `placeholder` | `string` | - | Placeholder text |
| `customItemRender` | `(item, index) => ReactNode` | - | Custom item rendering |
| `inputProps` | `InputProps` | - | Props passed to underlying Input |

**`DropdownItem` shape:** `{ id: string, label: string, description?: ReactNode, icon?: ReactNode, disabled?: boolean }`

#### MultiSelect

Multi-value combobox with tokens.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `DropdownItem[]` | - | Available items |
| `value` | `string[]` | `[]` | Selected item ids |
| `onChange` | `(items: DropdownItem[]) => void` | - | Selection handler |
| `placeholder` | `string` | - | Placeholder |
| `customItemRender` | `(item, index) => ReactNode` | - | Custom dropdown item |
| `customTokenRender` | `(props) => ReactNode` | - | Custom selected token |
| `slotLeft` | `ReactNode` | - | Left slot |
| `error` | `boolean` | - | Error state |

#### Autosuggest

Autocomplete input (similar API to Combobox).

#### DatePicker / DateRangePicker / Calendar

Date selection components built on `react-day-picker`.

### Layout & Content

#### Card

Simple container section with border and padding.

```tsx
<Card className="gap-tatum-xl">
  <h2>Title</h2>
  <p>Content</p>
</Card>
```

Renders as `<section>` with `rounded-tatum-xl border border-tatum-gray-200 bg-tatum-white p-tatum-2xl`.

#### Tabs

Radix tabbed interface with 5 visual variants.

**Subcomponents:** `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`

| Prop (on Tabs) | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `TabsVariant` | `ButtonBrand` | `ButtonBrand`, `ButtonGray`, `Underline`, `ButtonBorder`, `ButtonMinimal` |
| `size` | `'sm' \| 'md'` | `'sm'` | Text size |
| `large` | `boolean` | `false` | Full-width tabs |
| `defaultValue` | `string` | - | Initially active tab |
| `value` / `onValueChange` | `string` / `fn` | - | Controlled mode |

```tsx
<Tabs defaultValue="tab1" variant={TabsVariant.Underline}>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

#### Skeleton

Loading placeholder with pulse animation.

```tsx
<Skeleton className="h-tatum-4xl w-full" />
```

#### Carousel

Content carousel built on Embla Carousel.

#### GradientBorder

Decorative gradient border wrapper.

#### PricingCard

Pricing plan display card.

### Feedback & Overlay

#### Alert

Status alert with icon, title, description, and actions.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | - | Alert title (required) |
| `description` | `ReactNode` | - | Detail text |
| `type` | `AlertType` | `Default` | `Success`, `Error`, `Warning`, `Default` |
| `layout` | `'horizontal' \| 'vertical'` | auto | Layout direction |
| `onClose` | `() => void` | - | Close handler |
| `withoutCloseButton` | `boolean` | `false` | Hide close button |
| `icon` | `ReactNode` | - | Custom icon override |
| `children` | `ReactNode` | - | Action buttons |

#### Badge

Label/status badge with color variants.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `BadgeVariant` | `Default` | `Default` (rounded corners), `Pill` (fully rounded) |
| `color` | `BadgeColor` | - | `Gray`, `Brand`, `Success`, `Warning`, `Error`, `GrayBlue`, `BlueLight`, `Blue`, `Indigo`, `Purple`, `Pink`, `Orange` |
| `size` | `BadgeSize` | `Medium` | `Small`, `Medium`, `Large` |

#### Dialog

Modal dialog built on Radix Dialog.

**Subcomponents:** `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogBody`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `DialogClose`, `DialogOverlay`

| Prop (on DialogContent) | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `string` | `'25rem'` | Dialog width (CSS value) |
| `variant` | `'modal' \| 'drawer'` | `'modal'` | Modal or side drawer |

#### Dropdown

Radix dropdown menu with rich item types.

**Subcomponents:** `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuSection`, `DropdownMenuGroup`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`, `DropdownMenuPortal`, `DropdownMenuShortcut`, `DropdownMenuAccountItem`

`DropdownMenuItem` props: `icon?: ReactNode`, `shortcut?: string`, `inset?: boolean`

#### Popover

Radix popover.

**Subcomponents:** `Popover`, `PopoverTrigger`, `PopoverContent`

`PopoverContent` requires `triggerRef: HTMLElement | null` for Shadow DOM portal support.

#### Tooltip

Simple tooltip wrapper.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `ReactNode` | - | Tooltip content (required) |
| `children` | `ReactNode` | - | Trigger element |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Placement |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment |
| `delayDuration` | `number` | `0` | Show delay (ms) |
| `withoutArrow` | `boolean` | `false` | Hide arrow |
| `isDisabled` | `boolean` | `false` | Disable tooltip |

#### Toaster + toast()

Toast notifications using react-hot-toast.

**Setup:** Place `<Toaster />` once in your app root (renders at top-center).

**API:**

```tsx
import { toast } from '@tatum-io/tatum-design-system'

toast.success('Saved!')
toast.error('Something went wrong')
toast.warning('Please check your input')
toast.info('New version available')
toast.loading('Processing...')

// With options
toast.success('Saved!', {
  variant: 'solid',  // 'solid' | 'light' (default: 'light')
  action: { label: 'Undo', onClick: handleUndo },
  duration: 5000,
})

// Dismiss
toast.dismiss(toastId)
```

#### ProgressBar

Radix progress bar with label options.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | - | Current value |
| `max` | `number` | `100` | Maximum value |
| `labelType` | `ProgressBarLabelType` | `None` | `None`, `Floating`, `Basic` |
| `labelPlacement` | `ProgressBarLabelPlacement` | `Bottom` | `Top`, `Bottom`, `Left`, `Right` |
| `getValueLabel` | `(value, max) => string` | - | Custom label formatter |
| `indicatorClassName` | `string` | - | Custom indicator class |

### Actions

#### Button

Primary action component with 7 variants, 5 sizes, and 2 color palettes.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `ButtonVariant` | `Primary` | `Primary`, `Secondary`, `Accent`, `Outlined`, `Flat`, `LinkPrimary`, `LinkGray` |
| `size` | `ButtonSize` | `Medium` | `Small`, `Medium`, `MediumLarge`, `Large`, `ExtraLarge` |
| `colorPalette` | `ButtonColorPalette` | `Primary` | `Primary`, `Destructive` |
| `leftIcon` | `ReactNode` | - | Icon before text |
| `rightIcon` | `ReactNode` | - | Icon after text |
| `busy` | `boolean` | - | Shows loading spinner, disables button |
| `focused` | `boolean` | - | Manual focus ring |
| `as` | `'button' \| 'a'` | `'button'` | Render as anchor (requires `href`) |
| `disabled` | `boolean` | `false` | Disabled state |

#### IconButton

Icon-only button variant. Same API as Button but sized for icon-only use.

#### CopyButton

Copy-to-clipboard button with automatic feedback state.

### Data Display

#### Table

Data table built on TanStack React Table.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `ColumnDef<TData>[]` | - | Column definitions (TanStack) |
| `data` | `TData[]` | - | Row data |
| `isLoading` | `boolean` | - | Shows skeleton rows |
| `header` | `ReactNode` | - | Table header content |
| `noPagination` | `boolean` | - | Hide pagination |
| `pageSize` | `number` | `5` | Rows per page |
| `noDataLabel` | `string` | `'No data available.'` | Empty state text |
| `manualDataHandling` | `ManualDataHandlingProps` | - | Server-side pagination & sorting |
| `reactTableProps` | `Partial<TableOptions>` | - | Pass-through to useReactTable |

**`ManualDataHandlingProps`:** `{ rowCount, currentPage, onPageChange, sorting, onSortingChange }`

#### Pagination

Page navigation controls.

| Prop | Type | Description |
|------|------|-------------|
| `currentPage` | `number` | Active page index |
| `noOfPages` | `number` | Total pages |
| `onNextPage` / `onPrevPage` | `() => void` | Navigation handlers |
| `setCurrentPage` | `(page: number) => void` | Jump to page |
| `canGoBack` / `canGoNext` | `boolean` | Navigation state |
| `variant` | `'default' \| 'buttonGroup'` | Visual variant |

#### CodeHighlight / CodeHighlightBase

Syntax-highlighted code display using react-syntax-highlighter.

#### SortableList

Drag-and-drop sortable list built on @dnd-kit.

### Visual & Branding

#### FeaturedIcon

Styled icon container for feature highlights.

#### ChainIcon

Blockchain chain icon component.

#### StripeBadges

Stripe payment badge display.

#### AddressHandle

Blockchain address display with copy functionality.

---

## 5. Composition Patterns & Examples

### Form with Validation

```tsx
import { Field, Label, Hint, Input, Button } from '@tatum-io/tatum-design-system'

function LoginForm() {
  const [errors, setErrors] = useState<Record<string, string>>({})

  return (
    <form className="flex flex-col gap-tatum-2xl">
      <Field>
        <Label required>Email</Label>
        <Input
          type="email"
          placeholder="you@example.com"
          error={!!errors.email}
          slotLeft={<MailIcon size={20} className="text-tatum-gray-500" />}
        />
        <Hint>{errors.email || 'We will never share your email'}</Hint>
      </Field>

      <Field>
        <Label required>Password</Label>
        <Input type="password" error={!!errors.password} />
        <Hint>{errors.password}</Hint>
      </Field>

      <Button type="submit">Sign In</Button>
    </form>
  )
}
```

### Modal Dialog

```tsx
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody,
  DialogFooter, DialogTitle, DialogDescription, Button
} from '@tatum-io/tatum-design-system'

function ConfirmDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={ButtonVariant.Secondary}>Delete</Button>
      </DialogTrigger>
      <DialogContent width="28rem">
        <DialogHeader>
          <DialogTitle>Delete item?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant={ButtonVariant.Secondary}>Cancel</Button>
          </DialogTrigger>
          <Button colorPalette={ButtonColorPalette.Destructive} onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

For dialogs with scrollable content, use `DialogBody`:

```tsx
<DialogContent>
  <DialogHeader><DialogTitle>Long content</DialogTitle></DialogHeader>
  <DialogBody>{/* scrollable content */}</DialogBody>
  <DialogFooter>{/* actions */}</DialogFooter>
</DialogContent>
```

### Dropdown Menu

```tsx
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuSection, DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuLabel, Button
} from '@tatum-io/tatum-design-system'
import { Settings02, LogOut01 } from '@untitledui-pro/icons/line'

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={ButtonVariant.Secondary}>Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSection>
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuItem icon={<Settings02 size={16} />}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem icon={<LogOut01 size={16} />}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuSection>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### Data Table

```tsx
import { Table } from '@tatum-io/tatum-design-system'
import { ColumnDef } from '@tanstack/react-table'

type User = { name: string; email: string; role: string }

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'role',
    header: 'Role',
    meta: { headerTooltip: 'User permission level' },
  },
]

function UsersTable({ data }: { data: User[] }) {
  return (
    <Table
      columns={columns}
      data={data}
      header={<span>Team Members</span>}
      pageSize={10}
    />
  )
}
```

### Toast Notifications

```tsx
import { Toaster, toast } from '@tatum-io/tatum-design-system'

// In app root:
function App() {
  return (
    <>
      <Toaster />
      <YourApp />
    </>
  )
}

// Anywhere in your app:
toast.success('Changes saved')
toast.error('Failed to save', { variant: 'solid' })
toast.info('Update available', {
  action: { label: 'Update', onClick: () => updateApp() },
})
```

### Tabbed Interface

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent, TabsVariant } from '@tatum-io/tatum-design-system'

function SettingsTabs() {
  return (
    <Tabs defaultValue="general" variant={TabsVariant.Underline}>
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="pt-tatum-2xl">
        {/* General settings */}
      </TabsContent>
      <TabsContent value="security" className="pt-tatum-2xl">
        {/* Security settings */}
      </TabsContent>
      <TabsContent value="billing" className="pt-tatum-2xl">
        {/* Billing settings */}
      </TabsContent>
    </Tabs>
  )
}
```

---

## 6. Best Practices

### Required setup checklist
- Import `@tatum-io/tatum-design-system/styles.css` in your app entry
- Add `node_modules/@tatum-io/tatum-design-system/dist/**/*.{js,ts,jsx,tsx}` to Tailwind `content`
- Add `tdsPlugin` to Tailwind `plugins`

### Styling
- Use `tatum-*` design tokens instead of raw Tailwind values (e.g., `p-tatum-xl` not `p-4`)
- All components accept `className` — classes merge via `tailwind-merge` so TDS classes can be overridden
- Use `bg-tatum-primary-500` not `bg-[#4F37FD]` — tokens are the source of truth

### Component patterns
- Import enums for type-safe variants: `ButtonVariant.Primary` not `'Primary'`
- Composition components (Dialog, Dropdown, Tabs, Popover) use the compound component pattern — import and compose subcomponents
- Portal-based components need `data-tds-root="true"` on the widget container in Shadow DOM environments
- `Hint` inside `Field` auto-detects error state from sibling inputs with `aria-invalid="true"`

### Combobox / MultiSelect items
- Items must follow the `DropdownItem` shape: `{ id: string, label: string, description?, icon?, disabled? }`
- `id` is the unique identifier, `label` is the display text

### Icons
- Import from `@untitledui-pro/icons/line` (outline) or `@untitledui-pro/icons/solid` (filled)
- Icons accept `size: number` and `className: string`
- Typical sizes: 16px (inline), 20px (buttons/inputs), 24px (standalone)

```tsx
import { Settings02 } from '@untitledui-pro/icons/line'

<Settings02 size={20} className="text-tatum-gray-500" />
```

---

## 7. Installing This Skill in Other Projects

To use this skill in any Tatum project that consumes the design system:

1. Copy this file to your project:
   ```bash
   mkdir -p .claude/skills
   cp path/to/tatum-design-system/.claude/skills/tds.md .claude/skills/tds.md
   ```

2. Or create a symlink (if TDS repo is locally available):
   ```bash
   mkdir -p .claude/skills
   ln -s /path/to/tatum-design-system/.claude/skills/tds.md .claude/skills/tds.md
   ```

3. Invoke with `/tds` followed by your question, e.g.:
   - `/tds How do I create a form with validation?`
   - `/tds What color token should I use for error states?`
   - `/tds Show me how to use the Table component with server-side pagination`
