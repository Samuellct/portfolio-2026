'use client'

import { useId } from 'react'
import { SiDocker, SiNextcloud, SiProxmox, SiJellyfin } from 'react-icons/si'
import { TbServer } from 'react-icons/tb'
import { BRAND, ILLUSTRATION } from '@/lib/theme'
import { withAlpha } from '@/lib/color'

interface NetworkGraphProps {
  progress: number // 0 to 1
  className?: string
}

const WIDTH = 400
const HEIGHT = 150
const CENTER_X = 200
const CENTER_Y = 78
// Nodes sit on a flat ellipse so the graph fills a landscape frame
const RADIUS_X = 145
const RADIUS_Y = 52
// Lines stop short of each node so they do not run under the icon
const NODE_GAP = 16

const nodes = [
  { id: 'docker', Icon: SiDocker, color: BRAND.docker, angle: 0, label: 'Docker' },
  { id: 'nextcloud', Icon: SiNextcloud, color: BRAND.nextcloud, angle: 72, label: 'Nextcloud' },
  { id: 'proxmox', Icon: SiProxmox, color: BRAND.proxmox, angle: 144, label: 'Proxmox' },
  { id: 'jellyfin', Icon: SiJellyfin, color: BRAND.jellyfin, angle: 216, label: 'Jellyfin' },
  { id: 'truenas', Icon: TbServer, color: BRAND.truenas, angle: 288, label: 'TrueNAS' },
].map((node) => {
  const rad = (node.angle - 90) * (Math.PI / 180)
  const x = CENTER_X + RADIUS_X * Math.cos(rad)
  const y = CENTER_Y + RADIUS_Y * Math.sin(rad)
  const dx = x - CENTER_X
  const dy = y - CENTER_Y
  const length = Math.sqrt(dx * dx + dy * dy)
  return { ...node, x, y, endX: x - (dx / length) * NODE_GAP, endY: y - (dy / length) * NODE_GAP }
})

export default function NetworkGraph({ progress, className = '' }: NetworkGraphProps) {
  const id = useId()

  // Animation phases
  // 0-0.2: hub appears
  // 0.2-0.7: lines draw out
  // 0.7-1: icons appear
  const centerOpacity = Math.min(1, progress * 5)
  const lineProgress = Math.max(0, Math.min(1, (progress - 0.2) / 0.5))
  const iconsOpacity = Math.max(0, (progress - 0.7) / 0.3)
  const nodeProgress = (index: number) => Math.max(0, Math.min(1, (lineProgress - index * 0.15) / 0.4))

  return (
    // The frame keeps the viewBox ratio, so percentage positions match SVG units
    <div className={`relative aspect-[8/3] ${className}`} aria-hidden="true">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="absolute inset-0 w-full h-full">
        <defs>
          <pattern id={`${id}_grid`} width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.6" fill={withAlpha(ILLUSTRATION.homelab, 0.18)} />
          </pattern>
        </defs>
        <rect width={WIDTH} height={HEIGHT} fill={`url(#${id}_grid)`} />

        {/* Lines out to the nodes */}
        {nodes.map((node, index) => {
          const p = nodeProgress(index)
          return (
            <line
              key={`line-${node.id}`}
              x1={CENTER_X}
              y1={CENTER_Y}
              x2={CENTER_X + (node.endX - CENTER_X) * p}
              y2={CENTER_Y + (node.endY - CENTER_Y) * p}
              stroke={node.color}
              strokeWidth="1.2"
              strokeOpacity={0.7}
            />
          )
        })}

        {/* Hub: a small two-unit server rack */}
        <g style={{ opacity: centerOpacity, transition: 'opacity 0.3s ease-out' }}>
          <circle cx={CENTER_X} cy={CENTER_Y} r="21" fill={withAlpha(ILLUSTRATION.homelab, 0.15)} />
          <circle cx={CENTER_X} cy={CENTER_Y} r="16" fill={ILLUSTRATION.homelabNode} stroke={ILLUSTRATION.homelab} strokeWidth="1.5" />
          {[-4.5, 4.5].map((dy) => (
            <g key={dy}>
              <rect
                x={CENTER_X - 8.5}
                y={CENTER_Y + dy - 3.5}
                width="17"
                height="7"
                rx="1.5"
                fill="none"
                stroke={ILLUSTRATION.homelab}
                strokeWidth="1.2"
              />
              <circle cx={CENTER_X - 4.5} cy={CENTER_Y + dy} r="1" fill={ILLUSTRATION.homelab} />
            </g>
          ))}
        </g>
      </svg>

      {/* Node icons and labels, the icon centred on each node */}
      {nodes.map((node, index) => {
        if (nodeProgress(index) < 1) return null
        const Icon = node.Icon
        // The top node's line arrives from below, so its label goes beside the icon
        const labelBeside = node.y < CENTER_Y - RADIUS_Y / 2
        return (
          <div
            key={`icon-${node.id}`}
            className={`absolute flex items-center ${labelBeside ? 'flex-row gap-1.5' : 'flex-col gap-0.5'}`}
            style={{
              left: `${(node.x / WIDTH) * 100}%`,
              top: `${(node.y / HEIGHT) * 100}%`,
              transform: labelBeside ? 'translate(-10px, -50%)' : 'translate(-50%, -30%)',
              opacity: iconsOpacity,
              transition: 'opacity 0.3s ease-out',
            }}
          >
            <Icon size={20} color={node.color} />
            {/* Brand colour stays on the icon; the label is ink (brand hues fail AA on paper) */}
            <span className="text-meta tracking-wider uppercase whitespace-nowrap text-white">
              {node.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
