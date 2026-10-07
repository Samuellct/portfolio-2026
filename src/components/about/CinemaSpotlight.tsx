'use client'

import { useId, useMemo } from 'react'
import { ILLUSTRATION } from '@/lib/theme'

interface CinemaSpotlightProps {
  progress: number
  className?: string
}

const WIDTH = 400
const HEIGHT = 150
// Lens exit and screen position, in viewBox units
const LENS_X = 79
const LENS_Y = 75
const SCREEN_X = 376

export default function CinemaSpotlight({ progress, className }: CinemaSpotlightProps) {
  const id = useId()

  const {
    reelAngle,
    beamOpacity,
    lightTravel,
    screenOpacity,
  } = useMemo(() => {
    const p = Math.max(0, Math.min(1, progress))

    return {
      reelAngle: p * 720, // Two full reel turns over the scroll
      beamOpacity: Math.min(1, p > 0.1 ? (p - 0.1) * 1.2 : 0), // Light appears after a short delay
      lightTravel: p * (SCREEN_X - LENS_X), // Reveals the beam from the lens to the screen
      screenOpacity: p > 0.8 ? (p - 0.8) * 5 : 0,
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
        {/* Light loses intensity as it travels */}
        <linearGradient id={`${id}_beamGrad`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={ILLUSTRATION.cinema} stopOpacity="0.75" />
          <stop offset="100%" stopColor={ILLUSTRATION.cinema} stopOpacity="0.08" />
        </linearGradient>

        {/* Clip that reveals the beam as it moves forward */}
        <clipPath id={`${id}_lightReveal`}>
          <rect x={LENS_X} y="0" width={lightTravel} height={HEIGHT} />
        </clipPath>
      </defs>

      {/* Beam, overprinted on the paper */}
      <polygon
        points={`${LENS_X},${LENS_Y} ${SCREEN_X},14 ${SCREEN_X},136`}
        fill={`url(#${id}_beamGrad)`}
        opacity={beamOpacity}
        clipPath={`url(#${id}_lightReveal)`}
        style={{ mixBlendMode: 'multiply' }}
      />

      {/* Screen, lit at the end of the scroll */}
      <line
        x1={SCREEN_X}
        y1="8"
        x2={SCREEN_X}
        y2="142"
        stroke={ILLUSTRATION.cinema}
        strokeWidth="3"
        strokeLinecap="round"
        opacity={screenOpacity}
      />

      {/* Projector, drawn at 1.5x from its original 200-unit artwork */}
      <g transform="translate(10 -75) scale(1.5)">
        {/* Body */}
        <rect x="15" y="90" width="25" height="20" rx="2" fill={ILLUSTRATION.cinemaDeep} stroke={ILLUSTRATION.cinema} strokeWidth="1.5" />
        {/* Lens */}
        <rect x="40" y="96" width="6" height="8" rx="1" fill={ILLUSTRATION.cinemaDeep} stroke={ILLUSTRATION.cinema} strokeWidth="1.5" />

        {/* Tripod */}
        <line x1="27" y1="110" x2="27" y2="135" stroke={ILLUSTRATION.cinema} strokeWidth="2" />
        <line x1="27" y1="135" x2="15" y2="145" stroke={ILLUSTRATION.cinema} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="27" y1="135" x2="40" y2="145" stroke={ILLUSTRATION.cinema} strokeWidth="1.5" strokeLinecap="round" />

        {/* Front reel */}
        <g transform="translate(20, 80)">
          <circle cx="0" cy="0" r="10" fill={ILLUSTRATION.cinemaDeep} stroke={ILLUSTRATION.cinema} strokeWidth="1.5" />
          <g transform={`rotate(${reelAngle})`}>
            <line x1="0" y1="-10" x2="0" y2="10" stroke={ILLUSTRATION.cinema} strokeWidth="1" />
            <line x1="-8.6" y1="-5" x2="8.6" y2="5" stroke={ILLUSTRATION.cinema} strokeWidth="1" />
            <line x1="-8.6" y1="5" x2="8.6" y2="-5" stroke={ILLUSTRATION.cinema} strokeWidth="1" />
          </g>
          <circle cx="0" cy="0" r="2" fill={ILLUSTRATION.cinema} />
        </g>

        {/* Back reel */}
        <g transform="translate(38, 85)">
          <circle cx="0" cy="0" r="7" fill={ILLUSTRATION.cinemaDeep} stroke={ILLUSTRATION.cinema} strokeWidth="1.5" />
          <g transform={`rotate(${-reelAngle * 1.5})`}>
            <line x1="0" y1="-7" x2="0" y2="7" stroke={ILLUSTRATION.cinema} strokeWidth="1" />
            <line x1="-6" y1="-3.5" x2="6" y2="3.5" stroke={ILLUSTRATION.cinema} strokeWidth="1" />
            <line x1="-6" y1="3.5" x2="6" y2="-3.5" stroke={ILLUSTRATION.cinema} strokeWidth="1" />
          </g>
          <circle cx="0" cy="0" r="1.5" fill={ILLUSTRATION.cinema} />
        </g>
      </g>
    </svg>
  )
}
