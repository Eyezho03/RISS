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
 * This is a placeholder for a more advanced graph, but matches
 * the neon / Web3 aesthetic using your existing color tokens.
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
          <defs>
            <radialGradient id="trust-bg" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="rgba(56,189,248,0.1)" />
              <stop offset="100%" stopColor="rgba(15,23,42,0)" />
            </radialGradient>
          </defs>

          <circle cx={center} cy={center} r={center - 10} fill="url(#trust-bg)" />

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
                stroke="rgba(56,189,248,1)"
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
                  fill={isCenter ? 'rgba(168,85,247,1)' : 'rgba(15,23,42,1)'}
                  stroke={isCenter ? 'rgba(56,189,248,1)' : 'rgba(148,163,184,0.6)'}
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