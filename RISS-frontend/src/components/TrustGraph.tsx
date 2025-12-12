import { useMemo } from 'react'
import { Card } from './ui/Card'

interface TrustNode {
  id: string
  label: string
  level: number
}

interface TrustEdge {
  from: string
  to: string
  weight: number
}

interface TrustGraphProps {
  nodes?: TrustNode[]
  edges?: TrustEdge[]
}

/**
 * Simple radial trust graph visualization using SVG.
 * Minimalist design using the accent color palette.
 */
export function TrustGraph({ nodes, edges }: TrustGraphProps) {
  const { computedNodes, computedEdges } = useMemo(() => {
    const defaultNodes: TrustNode[] = [
      { id: 'you', label: 'You', level: 0 },
      { id: 'dao1', label: 'KRNL DAO', level: 1 },
      { id: 'dao2', label: 'RISS Governance', level: 1 },
      { id: 'user1', label: 'Contributor A', level: 2 },
      { id: 'user2', label: 'Auditor B', level: 2 },
      { id: 'user3', label: 'Reviewer C', level: 2 },
    ]

    const defaultEdges: TrustEdge[] = [
      { from: 'you', to: 'dao1', weight: 0.9 },
      { from: 'you', to: 'dao2', weight: 0.8 },
      { from: 'dao1', to: 'user1', weight: 0.7 },
      { from: 'dao1', to: 'user2', weight: 0.6 },
      { from: 'dao2', to: 'user3', weight: 0.75 },
    ]

    const allNodes = nodes && nodes.length ? nodes : defaultNodes
    const allEdges = edges && edges.length ? edges : defaultEdges

    return { computedNodes: allNodes, computedEdges: allEdges }
  }, [nodes, edges])

  const size = 260
  const center = size / 2
  const radiusStep = 60

  const positionedNodes = computedNodes.map((node, index) => {
    if (node.level === 0) {
      return { ...node, x: center, y: center }
    }
    const peers = computedNodes.filter((n) => n.level === node.level)
    const peerIndex = peers.findIndex((n) => n.id === node.id)
    const angle = (peerIndex / Math.max(peers.length, 1)) * Math.PI * 2
    const r = radiusStep * node.level
    return {
      ...node,
      x: center + Math.cos(angle) * r,
      y: center + Math.sin(angle) * r,
    }
  })

  const findNode = (id: string) => positionedNodes.find((n) => n.id === id)

  return (
    <Card variant="glass">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-bold text-text-primary">Trust Graph</h3>
        <span className="text-xs text-text-muted">Neural trust network</span>
      </div>
      <div className="flex items-center justify-center">
        <svg width={size} height={size}>
          <circle cx={center} cy={center} r={center - 10} fill="var(--accent-soft)" />

          {computedEdges.map((edge, idx) => {
            const from = findNode(edge.from)
            const to = findNode(edge.to)
            if (!from || !to) return null
            const opacity = 0.3 + edge.weight * 0.5
            return (
              <line
                key={idx}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="var(--accent)"
                strokeWidth={1.5}
                strokeOpacity={opacity}
              />
            )
          })}

          {positionedNodes.map((node) => {
            const isCenter = node.level === 0
            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isCenter ? 12 : 8}
                  fill={isCenter ? 'var(--accent)' : 'var(--bg-panel)'}
                  stroke={isCenter ? 'var(--accent)' : 'var(--border)'}
                  strokeWidth={2}
                />
                <text
                  x={node.x}
                  y={node.y + (isCenter ? 24 : 18)}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-300"
                >
                  {node.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </Card>
  )
}