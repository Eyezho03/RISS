/**
 * RISS Design Tokens
 * Cyber-Noir theme with single accent color (#B6FF3B)
 * Typography: Expressive display + supporting serif/sans combos
 */

export const DesignTokens = {
  colors: {
    bg: '#0A0A0C',
    panel: '#1E1E22',
    accent: '#B6FF3B', // TOXIC GREEN — single accent
    muted: '#9AA0A6',
    glass: 'rgba(255,255,255,0.02)',
    // Light mode variants
    light: {
      bg: '#FAFAFA',
      panel: '#FFFFFF',
      accent: '#B6FF3B',
      muted: '#6B7280',
      glass: 'rgba(0,0,0,0.02)',
    },
  },
  typography: {
    display: {
      fontFamily: 'Clash Display, "Canela", serif',
      fontWeight: 700,
    },
    body: {
      fontFamily: '"Neue Haas Grotesk Text", "Merriweather Sans", sans-serif',
      fontWeight: 400,
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
  },
  animation: {
    stagger: 40, // ms
    duration: 360, // ms
    easing: 'cubic-bezier(0.33, 1, 0.68, 1)', // ease-out-cubic
  },
} as const;

/**
 * CSS Variables for design tokens
 * These are injected into :root via index.css
 */
export const cssVariables = `
  :root {
    --bg: ${DesignTokens.colors.bg};
    --panel: ${DesignTokens.colors.panel};
    --accent: ${DesignTokens.colors.accent};
    --muted: ${DesignTokens.colors.muted};
    --glass: ${DesignTokens.colors.glass};
    
    --spacing-xs: ${DesignTokens.spacing.xs};
    --spacing-sm: ${DesignTokens.spacing.sm};
    --spacing-md: ${DesignTokens.spacing.md};
    --spacing-lg: ${DesignTokens.spacing.lg};
    --spacing-xl: ${DesignTokens.spacing.xl};
    --spacing-2xl: ${DesignTokens.spacing['2xl']};
    
    --font-display: ${DesignTokens.typography.display.fontFamily};
    --font-body: ${DesignTokens.typography.body.fontFamily};
  }
  
  :root[data-theme="light"] {
    --bg: ${DesignTokens.colors.light.bg};
    --panel: ${DesignTokens.colors.light.panel};
    --accent: ${DesignTokens.colors.light.accent};
    --muted: ${DesignTokens.colors.light.muted};
    --glass: ${DesignTokens.colors.light.glass};
  }
`;

