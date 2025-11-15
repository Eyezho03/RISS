import { useState, useMemo } from 'react'
import { StaggerReveal } from '@/components/ui/StaggerReveal'
import { Input } from '@/components/ui/Input'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface User {
  id: string
  did: string
  address: string
  verifications: number
  status: 'pending' | 'verified' | 'rejected'
  createdAt: string
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    did: 'did:riss:user1',
    address: '0x1234...5678',
    verifications: 3,
    status: 'verified',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    did: 'did:riss:user2',
    address: '0x2345...6789',
    verifications: 1,
    status: 'pending',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    did: 'did:riss:user3',
    address: '0x3456...7890',
    verifications: 2,
    status: 'verified',
    createdAt: '2024-03-10',
  },
]

// Mock chart data
const chartData = [
  { date: '2024-01-15', verifications: 5 },
  { date: '2024-01-16', verifications: 8 },
  { date: '2024-01-17', verifications: 12 },
  { date: '2024-01-18', verifications: 10 },
  { date: '2024-01-19', verifications: 15 },
  { date: '2024-01-20', verifications: 18 },
  { date: '2024-01-21', verifications: 20 },
]

export default function AdminPanel(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all')

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch =
        user.did.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.address.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [searchTerm, statusFilter])

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <StaggerReveal>
          <div className="space-y-8">
            <h1 className="font-display text-4xl font-bold text-accent">
              Admin Panel
            </h1>

            {/* Analytics Chart */}
            <div className="bg-panel border-2 border-muted/20 p-6">
              <h2 className="font-display text-2xl font-bold text-accent mb-6">
                Verifications Per Day
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    stroke="var(--muted)"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis stroke="var(--muted)" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--panel)',
                      border: '2px solid var(--accent)',
                      color: 'var(--muted)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="verifications"
                    stroke="var(--accent)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--accent)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Filters */}
            <div className="bg-panel border-2 border-muted/20 p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    label="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by DID or address..."
                  />
                </div>
                <div className="sm:w-48">
                  <label className="block font-display text-lg font-bold text-accent mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(
                        e.target.value as 'all' | 'pending' | 'verified' | 'rejected'
                      )
                    }
                    className="w-full px-4 py-3 bg-panel border-2 border-muted/20 text-muted font-body focus:outline-none focus:border-accent focus:text-accent transition-colors"
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-panel border-2 border-muted/20 p-6 overflow-x-auto">
              <h2 className="font-display text-2xl font-bold text-accent mb-6">
                Users ({filteredUsers.length})
              </h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-muted/20">
                    <th className="text-left py-3 px-4 font-display font-bold text-accent">
                      DID
                    </th>
                    <th className="text-left py-3 px-4 font-display font-bold text-accent">
                      Address
                    </th>
                    <th className="text-left py-3 px-4 font-display font-bold text-accent">
                      Verifications
                    </th>
                    <th className="text-left py-3 px-4 font-display font-bold text-accent">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-display font-bold text-accent">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-muted/10 hover:bg-glass transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-sm text-muted">
                        {user.did}
                      </td>
                      <td className="py-3 px-4 font-mono text-sm text-muted">
                        {user.address}
                      </td>
                      <td className="py-3 px-4 font-body text-muted">
                        {user.verifications}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-display font-bold text-xs uppercase px-2 py-1 ${
                            user.status === 'verified'
                              ? 'bg-accent text-bg'
                              : user.status === 'pending'
                              ? 'bg-muted/20 text-muted'
                              : 'bg-red-500/20 text-red-500'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-body text-sm text-muted">
                        {user.createdAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </StaggerReveal>
      </div>
    </div>
  )
}

