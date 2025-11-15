/**
 * RISS Logo Component
 * Bold wordmark + minimal glyph
 * Inline SVG for performance
 */
export function LogoSVG({ className = '' }: { className?: string }): JSX.Element {
  return (
    <svg
      className={className}
      width="120"
      height="40"
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="RISS Logo"
    >
      {/* Minimal glyph - geometric shape */}
      <rect x="0" y="8" width="8" height="24" fill="currentColor" className="text-accent" />
      <rect x="12" y="12" width="8" height="20" fill="currentColor" className="text-accent" />
      <rect x="24" y="16" width="8" height="16" fill="currentColor" className="text-accent" />
      
      {/* Wordmark */}
      <text
        x="40"
        y="28"
        fontFamily="var(--font-display)"
        fontSize="24"
        fontWeight="700"
        fill="currentColor"
        className="text-accent"
      >
        RISS
      </text>
    </svg>
  )
}

