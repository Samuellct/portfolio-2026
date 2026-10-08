'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { RefreshCw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { RISO } from '@/lib/theme'
import { withAlpha } from '@/lib/color'

interface Track {
  id: number
  startAngle: number
  curvature: number
  momentum: number
  charge: number
  maxRadius: number
  color: string
  thickness: number
  // Exotic track: a yellow highlighter pass printed under the pink line
  highlight: boolean
}

interface ParticleCollisionProps {
  isVisible: boolean
  className?: string
}

export default function ParticleCollision({ isVisible, className = '' }: ParticleCollisionProps) {
  const t = useTranslations('contact')
  const prefersReducedMotion = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [canShuffle, setCanShuffle] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)
  
  // Shuffle handler with buffer
  const handleShuffle = useCallback(() => {
    if (!canShuffle || isAnimating) return
    setCanShuffle(false)
    setAnimationKey(prev => prev + 1)
  }, [canShuffle, isAnimating])
  
  useEffect(() => {
    if (!canvasRef.current || !isVisible || prefersReducedMotion) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // canvas size
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }
    updateSize()
    // Printed on paper (DEC-16j): inks multiply where tracks cross, like
    // overlapping riso plates; no light, no glow.
    ctx.globalCompositeOperation = 'multiply'
    
    const width = canvas.getBoundingClientRect().width
    const height = canvas.getBoundingClientRect().height
    const centerX = width / 2
    const centerY = height / 2
    const maxR = Math.min(width, height) / 2 * 0.9
    
    // Detector layers
    const detectorLayers = [
      { radius: 0.15, label: 'Pixel', color: withAlpha(RISO.blue, 0.40) },
      { radius: 0.25, label: 'SCT', color: withAlpha(RISO.blue, 0.30) },
      { radius: 0.40, label: 'TRT', color: withAlpha(RISO.blue, 0.22) },
      { radius: 0.60, label: 'ECAL', color: withAlpha(RISO.pink, 0.35) },
      { radius: 0.80, label: 'HCAL', color: withAlpha(RISO.pink, 0.25) },
      { radius: 0.95, label: 'Muon', color: withAlpha(RISO.ink, 0.2) },
    ]
    
    // Generate tracks
    const generateTracks = (): Track[] => {
      const tracks: Track[] = []
      const numTracks = 12 + Math.floor(Math.random() * 6)
      
      for (let i = 0; i < numTracks; i++) {
        const angle = (Math.PI * 2 * i / numTracks) + (Math.random() - 0.5) * 0.3
        const momentum = 0.3 + Math.random() * 0.7
        const charge = Math.random() > 0.5 ? 1 : -1
        const curvature = charge * (0.1 + (1 - momentum) * 0.4)
        
        let maxRadius: number
        if (momentum < 0.4) {
          maxRadius = 0.3 + momentum * 0.5
        } else if (momentum < 0.7) {
          maxRadius = 0.5 + momentum * 0.4
        } else {
          maxRadius = Math.random() > 0.7 ? 0.95 : 0.7 + momentum * 0.2
        }
        
        // Yellow vanishes on paper as a line, so it only survives as the
        // highlighter under the rare exotic track (roughly 1 in 50 tracks).
        let color: string
        let highlight = false
        if (maxRadius > 0.85) {
          color = withAlpha(RISO.pink, 0.9)
          highlight = Math.random() < 0.15
        } else if (maxRadius > 0.55) {
          color = withAlpha(RISO.blue, 0.85)
        } else {
          color = withAlpha(RISO.ink, 0.9)
        }
        
        tracks.push({
          id: i,
          startAngle: angle,
          curvature,
          momentum,
          charge,
          maxRadius: maxRadius * maxR,
          color,
          thickness: 1.25 + momentum * 1.5,
          highlight,
        })
      }
      
      return tracks
    }
    
    const tracks = generateTracks()
    
    // Animation state
    let progress = 0
    const duration = 2500
    let startTime: number | null = null
    
    setIsAnimating(true)
    setCanShuffle(false)
    
    const drawDetector = () => {
      detectorLayers.forEach(layer => {
        ctx.beginPath()
        ctx.arc(centerX, centerY, layer.radius * maxR, 0, Math.PI * 2)
        ctx.strokeStyle = layer.color
        ctx.lineWidth = 1
        ctx.stroke()
      })
      
      ctx.strokeStyle = withAlpha(RISO.ink, 0.5)
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(centerX - 8, centerY)
      ctx.lineTo(centerX + 8, centerY)
      ctx.moveTo(centerX, centerY - 8)
      ctx.lineTo(centerX, centerY + 8)
      ctx.stroke()
    }
    
    const drawTrack = (track: Track, progress: number) => {
      const steps = 100
      const currentSteps = Math.floor(steps * progress)
      
      if (currentSteps < 2) return
      
      const tracePath = () => {
        ctx.beginPath()
        for (let i = 0; i <= currentSteps; i++) {
          const t = i / steps
          const r = t * track.maxRadius
          const angle = track.startAngle + track.curvature * t * Math.PI
          const x = centerX + Math.cos(angle) * r
          const y = centerY + Math.sin(angle) * r
          
          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
      }
      
      ctx.lineCap = 'round'
      if (track.highlight) {
        tracePath()
        ctx.strokeStyle = RISO.yellow
        ctx.lineWidth = track.thickness + 4
        ctx.stroke()
      }
      tracePath()
      ctx.strokeStyle = track.color
      ctx.lineWidth = track.thickness
      ctx.stroke()
      
      if (progress > 0.3) {
        const t = currentSteps / steps
        const r = t * track.maxRadius
        const angle = track.startAngle + track.curvature * t * Math.PI
        const x = centerX + Math.cos(angle) * r
        const y = centerY + Math.sin(angle) * r
        
        ctx.beginPath()
        ctx.arc(x, y, track.thickness * 1.5, 0, Math.PI * 2)
        ctx.fillStyle = track.color
        ctx.fill()
      }
    }
    
    // Vertex burst: a flat ring of pink halftone dots spreading out and
    // shrinking, instead of a glow.
    const drawVertexFlash = (progress: number) => {
      if (progress > 0.2) return
      
      const flashProgress = progress / 0.2
      const radius = flashProgress * 30
      const dot = 2.5 * (1 - flashProgress)
      
      ctx.fillStyle = withAlpha(RISO.pink, 1 - flashProgress)
      for (let k = 0; k < 12; k++) {
        const a = (Math.PI * 2 * k) / 12
        ctx.beginPath()
        ctx.arc(centerX + Math.cos(a) * radius, centerY + Math.sin(a) * radius, dot, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      progress = Math.min(elapsed / duration, 1)
      
      ctx.clearRect(0, 0, width, height)
      drawDetector()
      drawVertexFlash(progress)
      
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      tracks.forEach(track => {
        drawTrack(track, easedProgress)
      })
      
      ctx.beginPath()
      ctx.arc(centerX, centerY, 3, 0, Math.PI * 2)
      ctx.fillStyle = RISO.ink
      ctx.fill()
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
        // allow new shuffle with small buffer
        setTimeout(() => setCanShuffle(true), 300)
      }
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [isVisible, animationKey, prefersReducedMotion])
  
  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full mix-blend-multiply"
        style={{ display: 'block' }}
      />
      
      {/* Shuffle button */}
      <button
        onClick={handleShuffle}
        disabled={!canShuffle || isAnimating}
        className={`absolute bottom-4 right-4 p-2 rounded-full border transition-all duration-300 ${
          canShuffle && !isAnimating
            ? 'border-riso-blue/50 text-riso-ink hover:bg-riso-ink hover:text-riso-paper cursor-pointer'
            : 'border-riso-blue/20 text-riso-ink/30 cursor-not-allowed'
        }`}
        title={t('collision.newCollision')}
        aria-label={t('collision.newCollision')}
      >
        <RefreshCw 
          size={14} 
          className={isAnimating ? 'animate-spin' : ''} 
        />
      </button>
    </div>
  )
}
