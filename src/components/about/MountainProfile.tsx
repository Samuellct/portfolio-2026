'use client'

import { useId, useMemo } from 'react'
import { ILLUSTRATION } from '@/lib/theme'
import { withAlpha } from '@/lib/color'

interface MountainProfileProps {
  progress: number
  className?: string
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

// Elevation profile of a personal Gran Paradiso ascent (GPX, 27.7 km round trip),
// resampled to 60 points over distance and normalised to 0..1. No coordinates kept.
const elevation = [
  0.056, 0.053, 0.037, 0.024, 0.007, 0.003, 0, 0.031, 0.09, 0.129,
  0.158, 0.189, 0.219, 0.251, 0.288, 0.315, 0.348, 0.375, 0.35, 0.349,
  0.326, 0.312, 0.321, 0.339, 0.34, 0.362, 0.378, 0.38, 0.408, 0.441,
  0.495, 0.542, 0.617, 0.701, 0.791, 0.864, 0.92, 0.982, 1, 0.994,
  0.927, 0.874, 0.804, 0.714, 0.628, 0.55, 0.499, 0.45, 0.411, 0.374,
  0.333, 0.295, 0.258, 0.22, 0.184, 0.136, 0.087, 0.069, 0.061, 0.055,
]

const WIDTH = 400
const HEIGHT = 150
const LEFT = 12
const RIGHT = 388
const BASE = 136
const TOP = 22

const routePoints: [number, number][] = elevation.map((e, i) => [
  LEFT + ((RIGHT - LEFT) * i) / (elevation.length - 1),
  BASE - e * (BASE - TOP),
])

const summitIndex = elevation.indexOf(1)

// Arc-length parameterization - pre-compute cumulative segment lengths
const cumLengths = [0]
let totalLength = 0
for (let i = 1; i < routePoints.length; i++) {
  const dx = routePoints[i][0] - routePoints[i - 1][0]
  const dy = routePoints[i][1] - routePoints[i - 1][1]
  totalLength += Math.sqrt(dx * dx + dy * dy)
  cumLengths.push(totalLength)
}
const summitProgress = cumLengths[summitIndex] / totalLength

const routeD = routePoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`).join(' ')
const areaD = `${routeD} L ${RIGHT} ${HEIGHT} L ${LEFT} ${HEIGHT} Z`

// Faint altitude reference lines
const referenceLines = [0.25, 0.5, 0.75].map((f) => BASE - f * (BASE - TOP))

function posAtProgress(p: number) {
  p = clamp(p, 0, 1)
  const target = p * totalLength
  for (let i = 0; i < routePoints.length - 1; i++) {
    if (cumLengths[i + 1] >= target) {
      const segLen = cumLengths[i + 1] - cumLengths[i]
      const t = segLen > 0 ? (target - cumLengths[i]) / segLen : 0
      return {
        x: routePoints[i][0] + (routePoints[i + 1][0] - routePoints[i][0]) * t,
        y: routePoints[i][1] + (routePoints[i + 1][1] - routePoints[i][1]) * t,
      }
    }
  }
  const last = routePoints[routePoints.length - 1]
  return { x: last[0], y: last[1] }
}

export default function MountainProfile({ progress, className }: MountainProfileProps) {
  const id = useId()
  const [summitX, summitY] = routePoints[summitIndex]

  const { climber, dashOffset, flagOpacity } = useMemo(() => {
    const p = clamp(progress, 0, 1)
    return {
      climber: posAtProgress(p),
      dashOffset: totalLength * (1 - p),
      flagOpacity: clamp((p - summitProgress) * 12, 0, 1),
    }
  }, [progress])

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}_mtnFill`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={ILLUSTRATION.mountain} stopOpacity="0.16" />
          <stop offset="100%" stopColor={ILLUSTRATION.mountain} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Altitude reference lines */}
      {referenceLines.map((y) => (
        <line
          key={y}
          x1={LEFT}
          y1={y}
          x2={RIGHT}
          y2={y}
          stroke={withAlpha(ILLUSTRATION.mountainLow, 0.18)}
          strokeWidth="0.5"
          strokeDasharray="2 6"
        />
      ))}

      {/* Profile silhouette, fading out towards the base */}
      <path d={areaD} fill={`url(#${id}_mtnFill)`} />

      {/* Ghost route (full profile, very subtle) */}
      <path
        d={routeD}
        fill="none"
        stroke={withAlpha(ILLUSTRATION.mountainLow, 0.25)}
        strokeWidth="1"
        strokeDasharray="3 4"
        strokeLinecap="round"
      />

      {/* Route: pink misregistered pass, then the blue line on top */}
      <path
        d={routeD}
        transform="translate(1.5 1.5)"
        fill="none"
        stroke={ILLUSTRATION.overprint}
        strokeOpacity="0.55"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={totalLength}
        strokeDashoffset={dashOffset}
      />
      <path
        d={routeD}
        fill="none"
        stroke={ILLUSTRATION.mountain}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={totalLength}
        strokeDashoffset={dashOffset}
      />

      {/* Start marker */}
      <line
        x1={routePoints[0][0]}
        y1={routePoints[0][1] - 5}
        x2={routePoints[0][0]}
        y2={routePoints[0][1] + 5}
        stroke={ILLUSTRATION.mountainLow}
        strokeWidth="1"
        opacity="0.5"
      />

      {/* Summit flag, raised once the climber passes the top */}
      <g opacity={flagOpacity}>
        <line x1={summitX} y1={summitY} x2={summitX} y2={summitY - 16} stroke={ILLUSTRATION.mountainLow} strokeWidth="1" />
        <polygon
          points={`${summitX},${summitY - 16} ${summitX + 11},${summitY - 12.5} ${summitX},${summitY - 9}`}
          fill={ILLUSTRATION.overprint}
        />
      </g>

      {/* Climber dot */}
      {progress > 0.003 && (
        <g>
          <circle cx={climber.x} cy={climber.y} r="7" fill={withAlpha(ILLUSTRATION.mountain, 0.15)} />
          <circle cx={climber.x} cy={climber.y} r="3" fill={ILLUSTRATION.mountain} />
        </g>
      )}
    </svg>
  )
}
