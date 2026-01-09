'use client'

import { useRef, useEffect } from 'react'
import { SiDocker, SiNextcloud, SiProxmox, SiJellyfin } from 'react-icons/si'
import { TbServer } from 'react-icons/tb'

interface NetworkGraphProps {
  progress: number // 0 to 1
  className?: string
}

// Configuration des nœuds du réseau
const nodes = [
  { id: 'docker', Icon: SiDocker, color: '#2496ed', angle: 0, label: 'Docker' },
  { id: 'nextcloud', Icon: SiNextcloud, color: '#0082c9', angle: 72, label: 'Nextcloud' },
  { id: 'proxmox', Icon: SiProxmox, color: '#e57000', angle: 144, label: 'Proxmox' },
  { id: 'jellyfin', Icon: SiJellyfin, color: '#00a4dc', angle: 216, label: 'Jellyfin' },
  { id: 'truenas', Icon: TbServer, color: '#0095d5', angle: 288, label: 'TrueNAS' },
]

export default function NetworkGraph({ progress, className = '' }: NetworkGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Calculer les positions des nœuds sur un cercle
  const radius = 70 // Rayon du cercle
  const centerX = 100
  const centerY = 100
  
  const getNodePosition = (angle: number) => {
    const rad = (angle - 90) * (Math.PI / 180) // -90 pour commencer en haut
    return {
      x: centerX + radius * Math.cos(rad),
      y: centerY + radius * Math.sin(rad)
    }
  }
  
  // Phase de l'animation
  // 0-0.2: Centre apparaît
  // 0.2-0.7: Lignes se dessinent
  // 0.7-1: Icônes apparaissent
  const centerOpacity = Math.min(1, progress * 5) // 0-0.2 -> 0-1
  const lineProgress = Math.max(0, Math.min(1, (progress - 0.2) / 0.5)) // 0.2-0.7 -> 0-1
  const iconsOpacity = Math.max(0, (progress - 0.7) / 0.3) // 0.7-1 -> 0-1
  
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Grille de fond */}
        <defs>
          <pattern id="networkGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.5" fill="rgba(255,255,255,0.05)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#networkGrid)" />
        
        {/* Lignes vers les nœuds */}
        {nodes.map((node, index) => {
          const pos = getNodePosition(node.angle)
          const nodeLineProgress = Math.max(0, Math.min(1, (lineProgress - index * 0.15) / 0.4))
          
          return (
            <line
              key={`line-${node.id}`}
              x1={centerX}
              y1={centerY}
              x2={centerX + (pos.x - centerX) * nodeLineProgress}
              y2={centerY + (pos.y - centerY) * nodeLineProgress}
              stroke={node.color}
              strokeWidth="1"
              strokeOpacity={0.6}
              style={{ transition: 'all 0.1s ease-out' }}
            />
          )
        })}
        
        {/* Cercle central (serveur) */}
        <g style={{ opacity: centerOpacity, transition: 'opacity 0.3s ease-out' }}>
          {/* Glow */}
          <circle
            cx={centerX}
            cy={centerY}
            r="18"
            fill="rgba(229, 112, 0, 0.2)"
          />
          {/* Cercle principal */}
          <circle
            cx={centerX}
            cy={centerY}
            r="14"
            fill="#1a1a2e"
            stroke="#e57000"
            strokeWidth="1.5"
          />
          {/* Icône serveur au centre */}
          <text
            x={centerX}
            y={centerY + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="12"
            fill="#e57000"
          >
            ⬡
          </text>
        </g>
        
        {/* Petits cercles aux extrémités des lignes */}
        {nodes.map((node, index) => {
          const pos = getNodePosition(node.angle)
          const nodeLineProgress = Math.max(0, Math.min(1, (lineProgress - index * 0.15) / 0.4))
          
          if (nodeLineProgress < 1) return null
          
          return (
            <circle
              key={`dot-${node.id}`}
              cx={pos.x}
              cy={pos.y}
              r="3"
              fill={node.color}
              style={{ opacity: iconsOpacity, transition: 'opacity 0.3s ease-out' }}
            />
          )
        })}
      </svg>
      
      {/* Icônes positionnées en absolute */}
      {nodes.map((node, index) => {
        const pos = getNodePosition(node.angle)
        const Icon = node.Icon
        const nodeLineProgress = Math.max(0, Math.min(1, (lineProgress - index * 0.15) / 0.4))
        
        if (nodeLineProgress < 1) return null
        
        // Convertir les coordonnées SVG en pourcentages
        const left = (pos.x / 200) * 100
        const top = (pos.y / 200) * 100
        
        // Décalage pour positionner l'icône à l'extérieur du cercle
        const angle = node.angle - 90
        const offsetX = Math.cos(angle * Math.PI / 180) * 20
        const offsetY = Math.sin(angle * Math.PI / 180) * 20
        
        return (
          <div
            key={`icon-${node.id}`}
            className="absolute flex flex-col items-center gap-1"
            style={{
              left: `calc(${left}% + ${offsetX}px)`,
              top: `calc(${top}% + ${offsetY}px)`,
              transform: 'translate(-50%, -50%)',
              opacity: iconsOpacity,
              transition: 'opacity 0.3s ease-out',
            }}
          >
            <Icon 
              size={20} 
              color={node.color}
              style={{ filter: `drop-shadow(0 0 6px ${node.color}40)` }}
            />
            <span 
              className="text-[8px] tracking-wider uppercase whitespace-nowrap"
              style={{ color: node.color, opacity: 0.8 }}
            >
              {node.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
