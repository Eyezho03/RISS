import { useAppContext } from '@/context/AppContext'
import { StaggerReveal } from '@/components/ui/StaggerReveal'
import { ReputationScore } from '@/components/ReputationScore'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { TrendingUp, Award, Shield, Users, Code } from 'lucide-react'

export default function Reputation(): JSX.Element {
  const { reputation } = useAppContext()

  const scoreData = [
    { name: 'Identity', value: reputation.score.identity },
    { name: 'Contribution', value: reputation.score.contribution },
    { name: 'Trust', value: reputation.score.trust },
    { name: 'Social', value: reputation.score.social },
    { name: 'Engagement', value: reputation.score.engagement },
  ]

  // Mock historical data
  const historyData = [
    { date: 'Week 1', score: 20 },
    { date: 'Week 2', score: 35 },
    { date: 'Week 3', score: 50 },
    { date: 'Week 4', score: 65 },
    { date: 'Week 5', score: 75 },
    { date: 'Week 6', score: reputation.score.total },
  ]

  const activityBreakdown = reputation.activities.reduce(
    (acc, activity) => {
      if (activity.verificationLevel === 'verified') {
        acc[activity.type] = (acc[activity.type] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <StaggerReveal>
          {/* Header */}
          <div>
            <h1 className="font-display text-4xl font-bold text-accent mb-2">
              Reputation Breakdown
            </h1>
            <p className="font-body text-muted">
              Transparent scoring system showing how your reputation is calculated
            </p>
          </div>

          {/* Score Visualization */}
          <div className="bg-panel border-2 border-muted/20 p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold text-accent mb-6">Current Score</h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <ReputationScore score={reputation.score} size="lg" />
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={scoreData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(182, 255, 59, 0.1)" />
                    <XAxis dataKey="name" stroke="#9AA0A6" />
                    <YAxis stroke="#9AA0A6" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1E1E22',
                        border: '2px solid #B6FF3B',
                        color: '#B6FF3B',
                      }}
                    />
                    <Bar dataKey="value" fill="#B6FF3B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Score History */}
          <div className="bg-panel border-2 border-muted/20 p-6">
            <h2 className="font-display text-2xl font-bold text-accent mb-6">Score History</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(182, 255, 59, 0.1)" />
                <XAxis dataKey="date" stroke="#9AA0A6" />
                <YAxis stroke="#9AA0A6" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E1E22',
                    border: '2px solid #B6FF3B',
                    color: '#B6FF3B',
                  }}
                />
                <Line type="monotone" dataKey="score" stroke="#B6FF3B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Score Breakdown */}
          <div className="bg-panel border-2 border-muted/20 p-6">
            <h2 className="font-display text-2xl font-bold text-accent mb-6">
              How Your Score is Calculated
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-bg border-2 border-muted/20 p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Shield size={24} className="text-accent" />
                  <h3 className="font-display font-bold text-accent">Identity (25%)</h3>
                </div>
                <p className="font-body text-sm text-muted mb-2">
                  Based on verified identity documents, certifications, and KYC status
                </p>
                <div className="font-display text-2xl font-bold text-accent">
                  {reputation.score.identity}/100
                </div>
              </div>
              <div className="bg-bg border-2 border-muted/20 p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Code size={24} className="text-accent" />
                  <h3 className="font-display font-bold text-accent">Contribution (35%)</h3>
                </div>
                <p className="font-body text-sm text-muted mb-2">
                  GitHub commits, PRs, KRNL tasks completed, bounties, and code contributions
                </p>
                <div className="font-display text-2xl font-bold text-accent">
                  {reputation.score.contribution}/100
                </div>
              </div>
              <div className="bg-bg border-2 border-muted/20 p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Users size={24} className="text-accent" />
                  <h3 className="font-display font-bold text-accent">Trust (20%)</h3>
                </div>
                <p className="font-body text-sm text-muted mb-2">
                  Endorsements, DAO votes, verified transactions, and peer trust
                </p>
                <div className="font-display text-2xl font-bold text-accent">
                  {reputation.score.trust}/100
                </div>
              </div>
              <div className="bg-bg border-2 border-muted/20 p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <TrendingUp size={24} className="text-accent" />
                  <h3 className="font-display font-bold text-accent">Social (10%)</h3>
                </div>
                <p className="font-body text-sm text-muted mb-2">
                  DAO proposals, community engagement, and social contributions
                </p>
                <div className="font-display text-2xl font-bold text-accent">
                  {reputation.score.social}/100
                </div>
              </div>
            </div>
          </div>

          {/* Activity Breakdown */}
          {Object.keys(activityBreakdown).length > 0 && (
            <div className="bg-panel border-2 border-muted/20 p-6">
              <h2 className="font-display text-2xl font-bold text-accent mb-6">
                Activity Breakdown
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(activityBreakdown).map(([type, count]) => (
                  <div key={type} className="bg-bg border-2 border-muted/20 p-4 text-center">
                    <div className="font-display text-3xl font-bold text-accent mb-1">{count}</div>
                    <div className="font-body text-xs text-muted capitalize">
                      {type.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </StaggerReveal>
      </div>
    </div>
  )
}

