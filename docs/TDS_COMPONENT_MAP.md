# Tatum Design System (TDS) — component map

This document lists **which TDS components and APIs** were wired into BlockVille and **what they replaced**. Package: `@tatum-io/tatum-design-system` (see [TDS Storybook](https://tatum-desing-system-ed3d1a.gitlab.io/?path=/docs/introduction--docs)).

## Global setup

| Item | Purpose |
|------|---------|
| `tailwind.config.ts` → `tdsPlugin` from `@tatum-io/tatum-design-system/tailwind-plugin` | Enables `tatum-*` Tailwind tokens (colors, spacing, typography, shadows). |
| `tailwind.config.ts` → `content` includes `node_modules/@tatum-io/tatum-design-system/dist/**` | Lets Tailwind scan TDS class names used inside the library. |
| `src/app/layout.tsx` → `@tatum-io/tatum-design-system/styles.css` | Required global TDS styles (including Poppins / `font-tds`). |
| `src/app/layout.tsx` → `font-tds`, `bg-tatum-secondary-950`, `text-tatum-gray-50` on `<body>` | Replaced Geist + `bg-game-bg` / `text-zinc-100` as the default app shell. |
| `src/components/TdsToaster.tsx` → `<Toaster />` | Replaced the fixed bottom `successMessage` banner; toasts are shown via `toast.success()` from the design system. |

## File-by-file replacements

### `src/store/gameStore.ts`

- **Removed:** `successMessage`, `setSuccessMessage` (Zustand UI state for a transient banner).
- **Replaced by:** `toast.success()` at call sites (TDS `toast` API).

### `src/components/GameEngine.tsx`

| Before | After (TDS) |
|--------|-------------|
| Custom `<header>` / indigo gradients | Same structure; **TDS tokens** (`border-tatum-gray-700`, `bg-tatum-secondary-900/90`, etc.). |
| Custom `<div>` progress bar | **`ProgressBar`** (`ProgressBarLabelType.None`) with `indicatorClassName` gradient. |
| Freeplay shell: `section` with indigo borders | **`Card`** (`as="section"`) + nested **`Card`** for the generator panel. |
| Raw `<input>` + `<button>` for custom level | **`Field`**, **`Label`** (sr-only), **`Input`**, **`Button`** (`Primary`, `busy` while generating). |
| Inline error `<p>` | **`Alert`** (`AlertType.Error`, `withoutCloseButton`). |
| Success line for custom level count | Plain text with **`text-tatum-success-400`**. |

### `src/components/Modal.tsx`

| Before | After (TDS) |
|--------|-------------|
| Fixed overlay + hand-rolled panel | **`Dialog`**, **`DialogPortal`**, **`DialogOverlay`**, **`DialogContent`**, **`DialogHeader`**, **`DialogTitle`**, **`DialogBody`**. |
| Custom close `<button>` + `X` | **`DialogClose`** + **`IconButton`** (`ButtonVariant.Flat`, `ButtonSize.Small`). |

### `src/components/LevelCard.tsx`

| Before | After (TDS) |
|--------|-------------|
| Chapter card `<button>` (indigo/zinc/emerald utilities) | Same pattern; **TDS color tokens** (`tatum-primary`, `tatum-success`, `tatum-gray`, shadows). |
| `setSuccessMessage` + timeout | **`toast.success()`**. |
| Connect warning `<p>` | **`Alert`** (`AlertType.Warning`). |
| Raw `<label>` + `<input>` | **`Field`**, **`Label`**, **`Input`** (`inputClassName` via shared `TDS_GAME_INPUT_CLASSNAME` in `src/lib/tdsInputStyles.ts`: white fill, black bold value, regular gray placeholder). |
| “Let’s Test It” `<button>` | **`Button`** (`Primary`, `busy`). |
| Result / subscription / mock blocks as `<div>` | **`Card`** (`as="div"`) with semantic **tatum** borders/backgrounds; mock webhook control as **`Button`** (`Secondary`, `Small`). |

### `src/components/TutorialPanel.tsx`

| Before | After (TDS) |
|--------|-------------|
| “Skip Tutorial” / nav `<button>`s | **`Button`** variants (`Outlined`, `Primary`, `Secondary`, `Accent` for “Continue Story”). |
| Challenge inputs | **`Field`**, **`Label`**, **`Input`**. |
| Result panels (green bordered divs) | **`Card`** with success styling; reveal key control as **`Button`** (`Outlined`, `Small`). |
| Villager dialogue bubble (gradient div) | **`Card`** with token-based border/gradient. |
| Task / “What you’ll learn” panels | **`Card`** for structure; learn chips as **`Badge`** (`Pill`, `Brand`, `Small`). |
| `setSuccessMessage` | **`toast.success()`**. |

### `src/components/ConsolePanel.tsx`

| Before | After (TDS) |
|--------|-------------|
| Bordered panel `<div>` | **`Card`** (`as="div"`) + **tatum** typography and borders for header + log area. |

### `src/components/CodeSnippet.tsx`

| Before | After (TDS) |
|--------|-------------|
| Wrapper `<div>` with indigo border | **`Card`** (`as="div"`, `p-0`, dark-friendly border/bg). |
| (Still uses `react-syntax-highlighter` + Prism.) | No TDS **`CodeHighlight`** yet (that API expects `languages[]` + injected highlighter); wrapper is TDS-aligned. |

### `src/components/TypewriterText.tsx`

| Before | After (TDS) |
|--------|-------------|
| Link colors (`text-sky-*`) | **`text-tatum-primary-*`** + matching underline tokens for the “Tatum” doc link. |

### `src/components/TdsToaster.tsx` (new)

| Before | After (TDS) |
|--------|-------------|
| — | Client-only **`Toaster`** mount for App Router server `layout.tsx`. |

## Intentionally unchanged

- **`react-syntax-highlighter`** in `CodeSnippet` (kept for simple single-language snippets; can migrate to TDS `CodeHighlight` later if desired).
- **Villager images**, **background image layers** in `TutorialPanel` (game art); only controls and chrome use TDS.
- **Next.js `Image`**, **Zustand** store logic (except removed success message state).

## References

- TDS Storybook: [Introduction / docs](https://tatum-desing-system-ed3d1a.gitlab.io/?path=/docs/introduction--docs)
- Internal skill: `.agents/skills/tds.md` (tokens, imports, patterns)
