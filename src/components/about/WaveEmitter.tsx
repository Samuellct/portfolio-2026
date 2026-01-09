'use client'

import { useMemo } from 'react'

interface WaveEmitterProps {
  progress: number // 0 to 1
  className?: string
}

// Positions des "personnes" (points) autour du centre
const peoplePositions = [
  { x: 30, y: 25, delay: 0.3 },
  { x: 170, y: 35, delay: 0.5 },
  { x: 45, y: 160, delay: 0.4 },
  { x: 155, y: 150, delay: 0.6 },
  { x: 20, y: 90, delay: 0.35 },
  { x: 180, y: 100, delay: 0.55 },
  { x: 80, y: 20, delay: 0.25 },
  { x: 120, y: 175, delay: 0.45 },
]

export default function WaveEmitter({ progress, className = '' }: WaveEmitterProps) {
  const centerX = 100
  const centerY = 100
  const maxRadius = 90
  
  // Nombre d'ondes concentriques
  const waveCount = 4
  
  // Phase de l'animation
  // 0-0.3: Centre apparaît
  // 0.3-1: Ondes s'étendent
  const centerOpacity = Math.min(1, progress * 3.3) // 0-0.3 -> 0-1
  const waveProgress = Math.max(0, (progress - 0.3) / 0.7) // 0.3-1 -> 0-1
  
  // Calculer la distance d'un point au centre
  const getDistance = (x: number, y: number) => {
    return Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
  }
  
  // Vérifier si un point est "illuminé" par les ondes
  const isPointIlluminated = (x: number, y: number, delay: number) => {
    const distance = getDistance(x, y)
    const normalizedDistance = distance / maxRadius
    // Le point s'illumine quand l'onde l'atteint (avec délai)
    const effectiveProgress = Math.max(0, waveProgress - delay * 0.5)
    return effectiveProgress > normalizedDistance
  }
  
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Fond avec grille subtile */}
        <defs>
          <pattern id="waveGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="0.3" fill="rgba(255,255,255,0.03)" />
          </pattern>
          
          {/* Gradient radial pour les ondes */}
          <radialGradient id="waveGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#waveGrid)" />
        
        {/* Ondes concentriques */}
        {Array.from({ length: waveCount }).map((_, index) => {
          const waveDelay = index * 0.2
          const effectiveProgress = Math.max(0, waveProgress - waveDelay)
          const radius = effectiveProgress * maxRadius
          const opacity = Math.max(0, 0.6 - effectiveProgress * 0.5)
          
          if (radius <= 0) return null
          
          return (
            <circle
              key={`wave-${index}`}
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#a855f7"
              strokeWidth="1"
              strokeOpacity={opacity}
              style={{ transition: 'all 0.1s ease-out' }}
            />
          )
        })}
        
        {/* Zone d'effet (remplissage subtil) */}
        <circle
          cx={centerX}
          cy={centerY}
          r={waveProgress * maxRadius}
          fill="url(#waveGradient)"
          opacity={0.3}
          style={{ transition: 'r 0.1s ease-out' }}
        />
        
        {/* Centre émetteur */}
        <g style={{ opacity: centerOpacity, transition: 'opacity 0.3s ease-out' }}>
          {/* Glow */}
          <circle
            cx={centerX}
            cy={centerY}
            r="15"
            fill="rgba(168, 85, 247, 0.3)"
          />
          {/* Cercle central */}
          <circle
            cx={centerX}
            cy={centerY}
            r="10"
            fill="#1a1a2e"
            stroke="#a855f7"
            strokeWidth="2"
          />
          {/* Icône centrale (onde) */}
          <text
            x={centerX}
            y={centerY + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fill="#a855f7"
          >
            ◉
          </text>
        </g>
        
        {/* Points représentant les "personnes" */}
        {peoplePositions.map((person, index) => {
          const illuminated = isPointIlluminated(person.x, person.y, person.delay)
          
          return (
            <g key={`person-${index}`}>
              {/* Glow quand illuminé */}
              {illuminated && (
                <circle
                  cx={person.x}
                  cy={person.y}
                  r="8"
                  fill="rgba(0, 240, 255, 0.2)"
                  style={{ transition: 'all 0.3s ease-out' }}
                />
              )}
              {/* Point */}
              <circle
                cx={person.x}
                cy={person.y}
                r="4"
                fill={illuminated ? '#00f0ff' : 'rgba(255,255,255,0.2)'}
                style={{ transition: 'fill 0.3s ease-out' }}
              />
              {/* Petite icône personne */}
              <text
                x={person.x}
                y={person.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="5"
                fill={illuminated ? '#00f0ff' : 'rgba(255,255,255,0.3)'}
                style={{ transition: 'fill 0.3s ease-out' }}
              >
                ●
              </text>
            </g>
          )
        })}
        
        {/* Labels */}
        <text 
          x={centerX} 
          y={centerY + 30} 
          textAnchor="middle" 
          fontSize="6" 
          fill="rgba(168, 85, 247, 0.6)"
          style={{ opacity: centerOpacity }}
        >
          Source
        </text>
      </svg>
    </div>
  )
}
