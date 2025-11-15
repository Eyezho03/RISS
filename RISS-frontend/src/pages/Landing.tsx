import { Link } from 'react-router-dom'
import { StaggerReveal } from '@/components/ui/StaggerReveal'
import { Button } from '@/components/ui/Button'
import { FileText } from 'lucide-react'

export default function Landing(): JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-4xl w-full">
        <StaggerReveal>
          <div className="space-y-8">
            {/* Asymmetrical editorial layout */}
            <div className="space-y-4">
              <h1 className="font-display text-7xl sm:text-8xl lg:text-9xl font-bold text-accent leading-none">
                RISS
              </h1>
              <p className="font-body text-xl sm:text-2xl text-muted max-w-2xl">
                Reputation & Identity Scoring System
              </p>
              <p className="font-body text-lg text-muted max-w-2xl">
                The credit score of Web3 collaboration. Build trust through verified actions.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Link to="/auth">
                <Button size="lg" className="w-full sm:w-auto">
                  Generate Your Digital Identity
                </Button>
              </Link>
              <a
                href="#whitepaper"
                className="flex items-center gap-2 font-body text-muted hover:text-accent transition-colors"
              >
                <FileText size={20} />
                <span>Read Whitepaper</span>
              </a>
            </div>
          </div>
        </StaggerReveal>
      </div>

      {/* Subtle parallax effect on scroll */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
      </div>
    </div>
  )
}

