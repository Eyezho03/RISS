# Contributing to RISS

Thank you for your interest in contributing to RISS! This document outlines code style, component naming conventions, and contribution guidelines.

## Code Style

### TypeScript

- Use **TypeScript** for all new code
- Explicit return types for exported functions
- Use interfaces for object shapes
- Prefer `const` over `let`, avoid `var`
- Use arrow functions for component definitions

```typescript
// ✅ Good
export function MyComponent(): JSX.Element {
  return <div>Content</div>
}

// ❌ Bad
export function MyComponent() {
  return <div>Content</div>
}
```

### Component Naming

- **PascalCase** for component files and components
- **camelCase** for utility functions and hooks
- Prefix hooks with `use` (e.g., `useWallet`, `useDID`)
- Prefix UI components with descriptive names (e.g., `Button`, `Input`, `Modal`)

```
components/
  ├── ui/
  │   ├── Button.tsx        ✅
  │   ├── Input.tsx         ✅
  │   └── StaggerReveal.tsx ✅
  └── Navbar.tsx            ✅
```

### File Structure

- One component per file
- Co-locate tests in `__tests__` directories
- Group related components in folders

```
hooks/
  ├── __tests__/
  │   └── useWallet.test.ts
  └── useWallet.ts
```

### Imports

- Use absolute imports with `@/` alias
- Group imports: external → internal → types
- Use named exports for utilities, default exports for components

```typescript
// ✅ Good
import { useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import { Button } from '@/components/ui/Button'
import type { User } from '@/types'

// ❌ Bad
import React, { useState } from 'react'
import { Button } from './Button'
```

## Design System Rules

### Typography

- **DO NOT** use Inter, Roboto, Arial, system-ui, or Space Grotesk
- Use `font-display` for headings
- Use `font-body` for body text
- Maintain strong typographic hierarchy

### Colors

- **Single accent color**: `#B6FF3B` (toxic green)
- Use CSS variables: `var(--accent)`, `var(--bg)`, etc.
- No gradients or soft pastels
- Maintain WCAG AA contrast ratios

### Components

- **Rigid geometric shapes** - rectangular buttons, no soft rounded corners
- **Editorial modals** - strong typographic hierarchy
- **Minimal mechanical interactions** - simple color transitions on hover

### Animations

- **One primary animation**: StaggerReveal (40ms stagger, 360ms duration)
- Use only for major page load reveals
- Micro-interactions: simple color transitions only
- No bubbly or soft animations

## Component Guidelines

### Accessibility

- All interactive elements must have `aria-label` or accessible text
- Use semantic HTML (`<button>`, `<nav>`, etc.)
- Ensure keyboard navigation works
- Test with screen readers

```tsx
// ✅ Good
<button aria-label="Close modal" onClick={handleClose}>
  <X size={24} />
</button>

// ❌ Bad
<div onClick={handleClose}>
  <X size={24} />
</div>
```

### Responsive Design

- **Mobile-first** approach
- Use Tailwind responsive prefixes: `sm:`, `md:`, `lg:`
- Test on mobile devices
- Large touch targets (minimum 44x44px)

### Comments

- Inline comments for non-trivial logic (wallet, DID, verification)
- JSDoc comments for exported functions
- Explain "why", not "what"

```typescript
/**
 * useWallet Hook
 * MetaMask + WalletConnect stub integration
 * Uses ethers.js for wallet connection
 */
export function useWallet() {
  // Check if wallet is already connected on mount
  useEffect(() => {
    // ...
  }, [])
}
```

## Testing

### Unit Tests

- Write tests for critical components and hooks
- Use descriptive test names
- Test user interactions, not implementation details
- Aim for >80% coverage on critical paths

```typescript
describe('Button', () => {
  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()
    render(<Button onClick={handleClick}>Click</Button>)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

## Git Workflow

1. Create a feature branch from `main`
2. Make your changes following the style guide
3. Write/update tests
4. Run `npm run lint` and fix any issues
5. Run `npm run test` and ensure all tests pass
6. Commit with descriptive messages
7. Push and create a pull request

### Commit Messages

- Use present tense: "Add feature" not "Added feature"
- Be descriptive: "Fix wallet connection error" not "Fix bug"
- Reference issues: "Fix #123: Wallet connection error"

## Code Review

- All PRs require at least one approval
- Address review comments promptly
- Keep PRs focused and small when possible
- Update documentation if needed

## Questions?

If you have questions about contributing, please open an issue or contact the maintainers.

Thank you for contributing to RISS! 🚀

