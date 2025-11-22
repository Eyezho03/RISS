/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-panel': 'var(--bg-panel)',
        'primary-purple': 'var(--primary-purple)',
        'primary-cyan': 'var(--primary-cyan)',
        'text-primary': 'var(--text-primary)',
        'text-muted': 'var(--text-muted)',
        'success': 'var(--success)',
        'warning': 'var(--warning)',
        'error': 'var(--error)',
        'border': 'var(--border)',
        'glass': 'var(--glass)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
      },
      borderRadius: {
        'card': '6px',
        'button': '4px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.5)',
        'neon-cyan': '0 0 20px rgba(56, 189, 248, 0.5)',
      },
      backdropBlur: {
        'glass': '10px',
      },
    },
  },
  plugins: [],
}

