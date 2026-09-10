'use client'

import { useId, useMemo } from 'react'

interface CinemaSpotlightProps {
  progress: number
  className?: string
}

export default function CinemaSpotlight({ progress, className }: CinemaSpotlightProps) {
  const id = useId()

  const {
    reelAngle,
    beamOpacity,
    lightTravel,
  } = useMemo(() => {
    // On borne brutalement entre 0 et 1 pour éviter les comportements bizarres
    const p = Math.max(0, Math.min(1, progress))
    
    return {
      reelAngle: p * 720, // Les bobines font 2 tours complets sur la durée du scroll
      beamOpacity: p > 0.1 ? (p - 0.1) * 1.2 : 0, // La lumière apparaît après un court délai
      lightTravel: p * 160, // Découpe le faisceau de x=45 à x=205
    }
  }, [progress])

  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Dégradé simple pour simuler la perte d'intensité de la lumière */}
        <linearGradient id={`${id}_beamGrad`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e5737d" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#e5737d" stopOpacity="0.1" />
        </linearGradient>
        
        {/* Masque d'écrêtage qui simule l'avancée de la lumière */}
        <clipPath id={`${id}_lightReveal`}>
          <rect x="45" y="0" width={lightTravel} height="200" />
        </clipPath>
      </defs>

      {/* --- LE FAISCEAU --- */}
      <polygon
        points="45,100 190,40 190,160"
        fill={`url(#${id}_beamGrad)`}
        opacity={Math.min(1, beamOpacity)}
        clipPath={`url(#${id}_lightReveal)`}
        style={{ mixBlendMode: 'screen' }}
      />

      {/* --- L'ÉCRAN (s'illumine sur la fin du scroll) --- */}
      <line 
        x1="190" y1="30" x2="190" y2="170" 
        stroke="#e5737d" 
        strokeWidth="3" 
        strokeLinecap="round"
        opacity={progress > 0.8 ? (progress - 0.8) * 5 : 0} 
      />

      {/* --- LE PROJECTEUR (Épuré) --- */}
      <g>
        {/* Corps principal */}
        <rect x="15" y="90" width="25" height="20" rx="2" fill="#1a0810" stroke="#e5737d" strokeWidth="1.5" />
        {/* Lentille */}
        <rect x="40" y="96" width="6" height="8" rx="1" fill="#1a0810" stroke="#e5737d" strokeWidth="1.5" />
        
        {/* Trépied minimaliste */}
        <line x1="27" y1="110" x2="27" y2="135" stroke="#e5737d" strokeWidth="2" />
        <line x1="27" y1="135" x2="15" y2="145" stroke="#e5737d" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="27" y1="135" x2="40" y2="145" stroke="#e5737d" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Bobine Haut/Avant */}
        <g transform="translate(20, 80)">
          <circle cx="0" cy="0" r="10" fill="#050e20" stroke="#e5737d" strokeWidth="1.5" />
          <g transform={`rotate(${reelAngle})`}>
            <line x1="0" y1="-10" x2="0" y2="10" stroke="#e5737d" strokeWidth="1" />
            <line x1="-8.6" y1="-5" x2="8.6" y2="5" stroke="#e5737d" strokeWidth="1" />
            <line x1="-8.6" y1="5" x2="8.6" y2="-5" stroke="#e5737d" strokeWidth="1" />
          </g>
          <circle cx="0" cy="0" r="2" fill="#e5737d" />
        </g>

        {/* Bobine Bas/Arrière */}
        <g transform="translate(38, 85)">
          <circle cx="0" cy="0" r="7" fill="#050e20" stroke="#e5737d" strokeWidth="1.5" />
          <g transform={`rotate(${-reelAngle * 1.5})`}>
            <line x1="0" y1="-7" x2="0" y2="7" stroke="#e5737d" strokeWidth="1" />
            <line x1="-6" y1="-3.5" x2="6" y2="3.5" stroke="#e5737d" strokeWidth="1" />
            <line x1="-6" y1="3.5" x2="6" y2="-3.5" stroke="#e5737d" strokeWidth="1" />
          </g>
          <circle cx="0" cy="0" r="1.5" fill="#e5737d" />
        </g>
      </g>
    </svg>
  )
}