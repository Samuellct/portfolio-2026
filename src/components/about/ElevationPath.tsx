'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ElevationPathProps {
  progress: number // 0 to 1
  className?: string
}

// Profil d'élévation inspiré d'un trail de montagne (style MaxiRace)
// Points: [x, y] où y est l'altitude relative (inversé pour SVG)
const elevationPoints = [
  [0, 80],     // Départ (vallée)
  [15, 75],    // Petite montée
  [30, 45],    // Premier col
  [45, 65],    // Descente partielle
  [60, 25],    // Deuxième col (plus haut)
  [75, 55],    // Descente
  [90, 35],    // Troisième col
  [105, 60],   // Descente
  [120, 20],   // Point culminant
  [140, 50],   // Grande descente
  [160, 40],   // Remontée
  [180, 70],   // Descente vers arrivée
  [200, 75],   // Arrivée
]

// Générer un path SVG smooth à partir des points
function generateSmoothPath(points: number[][]): string {
  if (points.length < 2) return ''
  
  let path = `M ${points[0][0]} ${points[0][1]}`
  
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    
    // Control points for Bézier curve
    const cpX1 = prev[0] + (curr[0] - prev[0]) * 0.5
    const cpY1 = prev[1]
    const cpX2 = prev[0] + (curr[0] - prev[0]) * 0.5
    const cpY2 = curr[1]
    
    path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr[0]} ${curr[1]}`
  }
  
  return path
}

export default function ElevationPath({ progress, className = '' }: ElevationPathProps) {
  const pathRef = useRef<SVGPathElement>(null)
  const runnerRef = useRef<SVGCircleElement>(null)
  
  const pathD = generateSmoothPath(elevationPoints)
  const pathLength = 600 // Approximation de la longueur du path
  
  useEffect(() => {
    if (!pathRef.current) return
    
    // Calculer le dashoffset basé sur la progression
    const offset = pathLength * (1 - progress)
    pathRef.current.style.strokeDashoffset = `${offset}`
  }, [progress])
  
  // Calculer la position du runner sur le path
  const getRunnerPosition = () => {
    if (progress <= 0) return { x: elevationPoints[0][0], y: elevationPoints[0][1] }
    if (progress >= 1) return { x: elevationPoints[elevationPoints.length - 1][0], y: elevationPoints[elevationPoints.length - 1][1] }
    
    // Interpolation linéaire simple entre les points
    const totalPoints = elevationPoints.length - 1
    const exactIndex = progress * totalPoints
    const index = Math.floor(exactIndex)
    const t = exactIndex - index
    
    const p1 = elevationPoints[index]
    const p2 = elevationPoints[Math.min(index + 1, elevationPoints.length - 1)]
    
    return {
      x: p1[0] + (p2[0] - p1[0]) * t,
      y: p1[1] + (p2[1] - p1[1]) * t
    }
  }
  
  const runnerPos = getRunnerPosition()
  
  return (
    <div className={`relative ${className}`}>
      <svg 
        viewBox="0 0 200 100" 
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Grille de fond subtile */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path 
              d="M 20 0 L 0 0 0 20" 
              fill="none" 
              stroke="rgba(255,255,255,0.03)" 
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Ligne de base (niveau mer) */}
        <line 
          x1="0" y1="85" x2="200" y2="85" 
          stroke="rgba(255,255,255,0.1)" 
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />
        
        {/* Path d'arrière-plan (trace complète en gris) */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Path principal animé */}
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="url(#elevationGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength}
          style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
        />
        
        {/* Gradient pour le path */}
        <defs>
          <linearGradient id="elevationGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        
        {/* Runner point */}
        {progress > 0 && (
          <g>
            {/* Glow */}
            <circle
              cx={runnerPos.x}
              cy={runnerPos.y}
              r="6"
              fill="rgba(0, 240, 255, 0.3)"
            />
            {/* Point */}
            <circle
              ref={runnerRef}
              cx={runnerPos.x}
              cy={runnerPos.y}
              r="3"
              fill="#00f0ff"
            />
          </g>
        )}
        
        {/* Labels d'altitude */}
        <text x="5" y="25" fill="rgba(255,255,255,0.3)" fontSize="4" fontFamily="monospace">
          2500m
        </text>
        <text x="5" y="82" fill="rgba(255,255,255,0.3)" fontSize="4" fontFamily="monospace">
          500m
        </text>
      </svg>
    </div>
  )
}
