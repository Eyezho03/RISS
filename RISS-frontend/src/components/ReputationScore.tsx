import { RadialBarChart, RadialBar, ResponsiveContainer, Cell } from 'recharts'
import type { ReputationScore } from '@/types/reputation'

interface ReputationScoreProps {
  score: ReputationScore
  size?: 'sm' | 'md' | 'lg'
}

export function ReputationScore({ score, size = 'md' }: ReputationScoreProps): JSX.Element {
  const sizeClasses = {
    sm: 'h-32 w-32',
    md: 'h-48 w-48',
    lg: 'h-64 w-64',
  }

  const data = [
    { name: 'Identity', value: score.identity, fill: '#B6FF3B' },
    { name: 'Contribution', value: score.contribution, fill: '#00D4FF' },
    { name: 'Trust', value: score.trust, fill: '#FF6B9D' },
    { name: 'Social', value: score.social, fill: '#C77DFF' },
    { name: 'Engagement', value: score.engagement, fill: '#FFD93D' },
  ]

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <ResponsiveContainer width="100%" height={size === 'sm' ? 128 : size === 'md' ? 192 : 256}>
          <RadialBarChart
            innerRadius={size === 'sm' ? 40 : size === 'md' ? 60 : 80}
            outerRadius={size === 'sm' ? 60 : size === 'md' ? 90 : 120}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar dataKey="value" cornerRadius={4}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </RadialBar>
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-accent">{score.total}</div>
            <div className="font-body text-xs text-muted">RISS Score</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {data.map((item) => (
          <div key={item.name} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 border-2"
              style={{ borderColor: item.fill, backgroundColor: `${item.fill}40` }}
            />
            <span className="font-body text-muted">{item.name}</span>
            <span className="font-display font-bold text-accent">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

