import { ShieldCheck, GitBranch, GaugeCircle, LockKeyhole, Network } from 'lucide-react'

/**
 * Compact visual pipeline showing how RISS computes and proves a developer score.
 * Designed to be low-text and reusable across pages.
 */
export function ScoringPipeline() {
  const steps = [
    { icon: ShieldCheck, label: 'DID on KRNL' },
    { icon: GitBranch, label: 'Aggregate data' },
    { icon: GaugeCircle, label: 'AI score 0–100' },
    { icon: LockKeyhole, label: 'IPFS + proof' },
    { icon: Network, label: 'On-chain verify' },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isLast = index === steps.length - 1
          return (
            <div key={step.label} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-bg-panel border border-border flex items-center justify-center">
                  <Icon className="w-4 h-4 text-accent" />
                </div>
                <span className="text-[11px] text-text-muted text-center max-w-[80px]">
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div className="w-6 h-px bg-border hidden md:block" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}