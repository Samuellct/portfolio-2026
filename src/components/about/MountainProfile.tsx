'use client'

import { useId, useMemo } from 'react'

interface MountainProfileProps {
  progress: number
  className?: string
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

// 24 route points — climbing route from base to summit
const routePoints: [number, number][] = [
  [15, 173], [22, 165], [30, 153], [38, 143], [46, 133],
  [52, 125], [58, 117], [62, 115], [66, 108], [72, 98],
  [76, 88],  [80, 78],  [84, 68],  [88, 60],  [92, 52],
  [96, 46],  [100, 43], [104, 46], [108, 49], [112, 44],
  [116, 38], [120, 32], [124, 29], [126, 27],
]

// Arc-length parameterization — pre-compute cumulative segment lengths
const cumLengths = [0]
let totalLength = 0
for (let i = 1; i < routePoints.length; i++) {
  const dx = routePoints[i][0] - routePoints[i - 1][0]
  const dy = routePoints[i][1] - routePoints[i - 1][1]
  totalLength += Math.sqrt(dx * dx + dy * dy)
  cumLengths.push(totalLength)
}

// Route SVG path
const routeD = routePoints.map((pt, i) =>
  i === 0 ? `M ${pt[0]} ${pt[1]}` : `L ${pt[0]} ${pt[1]}`
).join(' ')

// Mountain silhouette path
const mountainPath = [
  'M0,192',
  'L8,180 L15,168 L22,158 L30,148',
  'L38,138 L45,128 L52,120 L58,112',
  'L64,104 L70,96 L76,86 L82,74',
  'L86,65 L90,56 L94,48 L98,42',
  'L100,38 L104,41 L108,44',
  'L112,40 L116,33 L120,28 L124,24 L126,22',
  'L128,25 L132,34 L136,42 L142,52',
  'L148,64 L154,76 L160,90 L166,104',
  'L172,118 L178,132 L184,148 L190,164 L196,178 L200,192 Z',
].join(' ')

// Snow patches at peaks
const snowPaths = [
  'M96,44 L100,38 L104,41',
  'M122,28 L126,22 L128,25',
]

// Anchor indices along the route
const anchorIndices = [3, 7, 11, 15, 19]

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

  const { climber, dashOffset, flagOpacity, flagFill } = useMemo(() => {
    const p = clamp(progress, 0, 1)
    return {
      climber: posAtProgress(p),
      dashOffset: totalLength * (1 - p),
      flagOpacity: p > 0.9 ? clamp((p - 0.9) * 10, 0, 0.7) : 0.12,
      flagFill: p > 0.9 ? 0.6 : 0.08,
    }
  }, [progress])

  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <pattern id={`${id}_grid`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
        </pattern>

        <linearGradient id={`${id}_mtnFill`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.01" />
        </linearGradient>

        <linearGradient id={`${id}_routeGrad`} x1="0%" y1="100%" x2="40%" y2="0%">
          <stop offset="0%" stopColor="#00c8ff" stopOpacity="0.5" />
          <stop offset="40%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#66f7ff" />
        </linearGradient>

        <filter id={`${id}_glow`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id={`${id}_fog`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#200a0a" stopOpacity="0" />
          <stop offset="60%" stopColor="#200a0a" stopOpacity="0" />
          <stop offset="100%" stopColor="#200a0a" stopOpacity="0.5" />
        </linearGradient>

        <radialGradient id={`${id}_summitGlow`} cx="63%" cy="14%" r="15%">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Grid background */}
      <rect width="200" height="200" fill={`url(#${id}_grid)`} />

      {/* Altitude reference lines */}
      <line x1="8" y1="50" x2="195" y2="50" stroke="rgba(255,255,255,0.02)" strokeWidth="0.3" strokeDasharray="2 8" />
      <line x1="8" y1="90" x2="195" y2="90" stroke="rgba(255,255,255,0.02)" strokeWidth="0.3" strokeDasharray="2 8" />
      <line x1="8" y1="130" x2="195" y2="130" stroke="rgba(255,255,255,0.02)" strokeWidth="0.3" strokeDasharray="2 8" />

      {/* Subtle summit glow */}
      <circle cx="126" cy="27" r="30" fill={`url(#${id}_summitGlow)`} />

      {/* Mountain silhouette */}
      <path d={mountainPath} fill={`url(#${id}_mtnFill)`} />
      <path d={mountainPath} fill="none" stroke="#00f0ff" strokeWidth="0.7" opacity="0.25" />

      {/* Snow patches */}
      {snowPaths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {/* Ghost route (full path, very subtle) */}
      <path
        d={routeD}
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth="0.8"
        strokeDasharray="3 4"
        strokeLinecap="round"
      />

      {/* Route: wide transparent halo */}
      <path
        d={routeD}
        fill="none"
        stroke="#00f0ff"
        strokeWidth="4"
        opacity="0.07"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={totalLength}
        strokeDashoffset={dashOffset}
      />

      {/* Route: sharp line with gradient */}
      <path
        d={routeD}
        fill="none"
        stroke={`url(#${id}_routeGrad)`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={totalLength}
        strokeDashoffset={dashOffset}
      />

      {/* Anchor points */}
      {anchorIndices.map((idx) => {
        const anchorProg = cumLengths[idx] / totalLength
        if (progress < anchorProg + 0.01) return null
        const pt = routePoints[idx]
        const fade = clamp((progress - anchorProg) * 5, 0, 0.45)
        return (
          <circle
            key={idx}
            cx={pt[0]}
            cy={pt[1]}
            r="1.2"
            fill="none"
            stroke="#00c8ff"
            strokeWidth="0.5"
            opacity={fade}
          />
        )
      })}

      {/* Base camp triangle */}
      <g opacity="0.4">
        <polygon
          points="12,170 18,170 15,163"
          fill="none"
          stroke="#00f0ff"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
        <line x1="15" y1="170" x2="15" y2="175" stroke="#00f0ff" strokeWidth="0.4" />
      </g>

      {/* Summit flag */}
      <g opacity={flagOpacity}>
        <line x1="126" y1="27" x2="126" y2="17" stroke="#00f0ff" strokeWidth="0.6" />
        <polygon points="126,17 134,19.5 126,22" fill="#00f0ff" opacity={flagFill} />
      </g>

      {/* Climber dot + glow */}
      {progress > 0.003 && (
        <g filter={`url(#${id}_glow)`}>
          <circle cx={climber.x} cy={climber.y} r="7" fill="rgba(0,240,255,0.15)" />
          <circle cx={climber.x} cy={climber.y} r="2.5" fill="#00f0ff" />
        </g>
      )}

      {/* Fog at base */}
      <rect x="0" y="145" width="200" height="55" fill={`url(#${id}_fog)`} />
    </svg>
  )
}
