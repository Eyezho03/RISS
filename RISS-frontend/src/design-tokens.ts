export const DesignTokens = {
  colors: {
    // Dark mode - black palette
    bg: '#000000',
    secondary: '#111111',
    panel: '#1A1A1A',
    accent: '#B8860B',
    accentStrong: '#9C7209',
    accentSoft: 'rgba(184, 134, 11, 0.12)',
    text: '#FFFFFF',
    muted: '#CCCCCC',
    textOnAccent: '#000000',
    border: 'rgba(255, 255, 255, 0.15)',
    borderStrong: 'rgba(184, 134, 11, 0.4)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    glass: 'rgba(255, 255, 255, 0.03)',
    // Light mode - white palette
    light: {
      bg: '#FFFFFF',
      secondary: '#F5F5F5',
      panel: '#FAFAFA',
      accent: '#B8860B',
      accentStrong: '#A37409',
      accentSoft: 'rgba(184, 134, 11, 0.12)',
      text: '#000000',
      muted: '#666666',
      textOnAccent: '#FFFFFF',
      border: 'rgba(0, 0, 0, 0.15)',
      borderStrong: 'rgba(184, 134, 11, 0.45)',
      overlay: 'rgba(255, 255, 255, 0.7)',
      glass: 'rgba(0, 0, 0, 0.02)',
    },
  },
  typography: {
    display: {
      fontFamily: 'Inter, "Segoe UI", system-ui, sans-serif',
      fontWeight: 700,
    },
    body: {
      fontFamily: 'Inter, "Segoe UI", system-ui, sans-serif',
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

export const cssVariables = `
  :root {
    --bg-primary: ${DesignTokens.colors.bg};
    --bg-secondary: ${DesignTokens.colors.secondary};
    --bg-panel: ${DesignTokens.colors.panel};
    --accent: ${DesignTokens.colors.accent};
    --accent-strong: ${DesignTokens.colors.accentStrong};
    --accent-soft: ${DesignTokens.colors.accentSoft};
    --text-primary: ${DesignTokens.colors.text};
    --text-muted: ${DesignTokens.colors.muted};
    --text-on-accent: ${DesignTokens.colors.textOnAccent};
    --border: ${DesignTokens.colors.border};
    --border-strong: ${DesignTokens.colors.borderStrong};
    --overlay: ${DesignTokens.colors.overlay};
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
    --bg-primary: ${DesignTokens.colors.light.bg};
    --bg-secondary: ${DesignTokens.colors.light.secondary};
    --bg-panel: ${DesignTokens.colors.light.panel};
    --accent: ${DesignTokens.colors.light.accent};
    --accent-strong: ${DesignTokens.colors.light.accentStrong};
    --accent-soft: ${DesignTokens.colors.light.accentSoft};
    --text-primary: ${DesignTokens.colors.light.text};
    --text-muted: ${DesignTokens.colors.light.muted};
    --text-on-accent: ${DesignTokens.colors.light.textOnAccent};
    --border: ${DesignTokens.colors.light.border};
    --border-strong: ${DesignTokens.colors.light.borderStrong};
    --overlay: ${DesignTokens.colors.light.overlay};
    --glass: ${DesignTokens.colors.light.glass};
  }
`;

