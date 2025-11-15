# Design Tokens Documentation

This document describes the design tokens used in RISS and how to use them.

## Overview

RISS uses a **Cyber-Noir** design system with a single toxic green accent color (#B6FF3B) against a dark background. The design is intentionally rigid, geometric, and editorial—avoiding soft gradients, rounded corners, and generic fonts.

## Colors

### Dark Mode (Default)

```css
--bg: #0A0A0C        /* Main background */
--panel: #1E1E22     /* Panel/card background */
--accent: #B6FF3B    /* Single accent color (toxic green) */
--muted: #9AA0A6     /* Muted text color */
--glass: rgba(255,255,255,0.02)  /* Glass effect overlay */
```

### Light Mode

```css
--bg: #FAFAFA        /* Light background */
--panel: #FFFFFF     /* White panel */
--accent: #B6FF3B    /* Same accent (toxic green) */
--muted: #6B7280     /* Darker muted text */
--glass: rgba(0,0,0,0.02)  /* Subtle glass effect */
```

### Usage

In Tailwind classes:
```tsx
<div className="bg-bg text-muted">
  <div className="bg-panel border-2 border-accent">
    <span className="text-accent">Accent text</span>
  </div>
</div>
```

In CSS:
```css
.my-component {
  background-color: var(--bg);
  color: var(--muted);
  border-color: var(--accent);
}
```

## Typography

### Font Families

- **Display**: `var(--font-display)` - Canela (Google Fonts fallback)
  - Used for headings (h1, h2, h3, etc.)
  - Font weight: 700 (bold)
  
- **Body**: `var(--font-body)` - Merriweather Sans (Google Fonts)
  - Used for body text, labels, descriptions
  - Font weight: 400 (regular)

### Font Restrictions

**DO NOT USE**:
- Inter
- Roboto
- Arial
- system-ui
- Space Grotesk

### Usage

```tsx
<h1 className="font-display text-4xl font-bold text-accent">
  Heading
</h1>

<p className="font-body text-muted">
  Body text
</p>
```

## Spacing

Spacing tokens use a consistent scale:

```css
--spacing-xs: 0.5rem   /* 8px */
--spacing-sm: 1rem     /* 16px */
--spacing-md: 1.5rem   /* 24px */
--spacing-lg: 2rem     /* 32px */
--spacing-xl: 3rem     /* 48px */
--spacing-2xl: 4rem    /* 64px */
```

### Usage

```tsx
<div className="p-md space-y-lg">
  <div className="mb-sm">Content</div>
</div>
```

## Animation

### StaggerReveal

The primary animation for page/component reveals:

- **Stagger**: 40ms between children
- **Duration**: 360ms per item
- **Easing**: `cubic-bezier(0.33, 1, 0.68, 1)` (ease-out-cubic)
- **Direction**: Bottom to top

### Usage

```tsx
<StaggerReveal>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</StaggerReveal>
```

### Animation Rules

- **Only use StaggerReveal** for major page load reveals
- Micro-interactions: Simple color transitions only (200ms)
- No bubbly, soft, or elastic animations
- Mechanical and purposeful motion only

## Background

### Noise Texture

Small repeating pattern (80x80px) applied to body background:

```css
background-image: url("data:image/svg+xml,...");
background-size: 80px 80px;
```

### Grid Overlay

Faint grid overlay (24x24px) for depth:

```css
background-image: 
  linear-gradient(rgba(182, 255, 59, 0.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(182, 255, 59, 0.03) 1px, transparent 1px);
background-size: 24px 24px;
```

## Components

### Buttons

- **Shape**: Rectangular (no rounded corners)
- **Typography**: Uppercase, bold, display font
- **Variants**: `primary`, `secondary`, `ghost`
- **Sizes**: `sm`, `md`, `lg`

```tsx
<Button variant="primary" size="md">
  Click Me
</Button>
```

### Inputs

- **Shape**: Rectangular borders
- **Labels**: Large, bold, display font
- **Focus**: Accent color border

```tsx
<Input
  label="Document Hash"
  value={value}
  onChange={handleChange}
/>
```

### Modals

- **Style**: Editorial with strong typography
- **Border**: 2px accent color
- **Background**: Panel color with glass effect

```tsx
<Modal
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Modal Title"
>
  Content
</Modal>
```

## Accessibility

### Color Contrast

All color combinations meet **WCAG AA** standards:

- Text on `--bg`: ✅ AA compliant
- Text on `--panel`: ✅ AA compliant
- `--accent` on `--bg`: ✅ AA compliant
- `--muted` on `--bg`: ✅ AA compliant

### Focus States

Interactive elements use accent color for focus:

```css
focus:outline-none
focus:border-accent
focus:text-accent
```

## Theme Toggle

Theme is controlled via `data-theme` attribute on `<html>`:

```tsx
// Dark mode (default)
<html data-theme="dark">

// Light mode
<html data-theme="light">
```

Use `useTheme` hook to toggle:

```tsx
const { theme, toggleTheme } = useTheme()
```

## Token Source

All tokens are defined in `src/design-tokens.ts` and exported as:

- TypeScript object: `DesignTokens`
- CSS variables: Injected via `src/index.css`

## Best Practices

1. **Always use tokens** - Don't hardcode colors or spacing
2. **Respect the accent** - Use `--accent` sparingly, only for primary actions
3. **Maintain hierarchy** - Use display font for headings, body font for text
4. **Keep it rigid** - No soft rounded corners or gradients
5. **Test contrast** - Ensure WCAG AA compliance

## Examples

### Card Component

```tsx
<div className="bg-panel border-2 border-muted/20 p-lg">
  <h3 className="font-display text-xl font-bold text-accent mb-md">
    Card Title
  </h3>
  <p className="font-body text-muted">
    Card content
  </p>
</div>
```

### Accent Button

```tsx
<button className="bg-accent text-bg px-lg py-md font-display font-bold uppercase">
  Primary Action
</button>
```

### Glass Effect

```tsx
<div className="glass border-2 border-muted/20 p-md">
  Glass panel content
</div>
```

---

For questions or updates to design tokens, see `CONTRIBUTING.md`.

