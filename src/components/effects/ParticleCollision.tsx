'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { RefreshCw } from 'lucide-react'
import content from '@/lib/content.json'

interface Track {
  id: number
  startAngle: number
  curvature: number
  momentum: number
  charge: number
  maxRadius: number
  color: string
  thickness: number
}

interface ParticleCollisionProps {
  isVisible: boolean
  className?: string
}

export default function ParticleCollision({ isVisible, className = '' }: ParticleCollisionProps) {
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
    if (!canvasRef.current || !isVisible) return
    
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
    
    const width = canvas.getBoundingClientRect().width
    const height = canvas.getBoundingClientRect().height
    const centerX = width / 2
    const centerY = height / 2
    const maxR = Math.min(width, height) / 2 * 0.9
    
    // Detector layers
    const detectorLayers = [
      { radius: 0.15, label: 'Pixel', color: 'rgba(0, 240, 255, 0.15)' },
      { radius: 0.25, label: 'SCT', color: 'rgba(0, 240, 255, 0.10)' },
      { radius: 0.40, label: 'TRT', color: 'rgba(0, 240, 255, 0.08)' },
      { radius: 0.60, label: 'ECAL', color: 'rgba(168, 85, 247, 0.08)' },
      { radius: 0.80, label: 'HCAL', color: 'rgba(168, 85, 247, 0.06)' },
      { radius: 0.95, label: 'Muon', color: 'rgba(255, 255, 255, 0.04)' },
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
        
        let color: string
        if (maxRadius > 0.85) {
          color = 'rgba(168, 85, 247, 0.8)'
        } else if (maxRadius > 0.55) {
          color = 'rgba(16, 185, 129, 0.7)'
        } else {
          color = 'rgba(0, 240, 255, 0.8)'
        }
        
        tracks.push({
          id: i,
          startAngle: angle,
          curvature,
          momentum,
          charge,
          maxRadius: maxRadius * maxR,
          color,
          thickness: 1 + momentum * 1.5,
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
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
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
      
      ctx.beginPath()
      ctx.strokeStyle = track.color
      ctx.lineWidth = track.thickness
      ctx.lineCap = 'round'
      
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
    
    const drawVertexFlash = (progress: number) => {
      if (progress > 0.2) return
      
      const flashProgress = progress / 0.2
      const radius = flashProgress * 30
      const opacity = 1 - flashProgress
      
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
      gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`)
      gradient.addColorStop(0.5, `rgba(0, 240, 255, ${opacity * 0.5})`)
      gradient.addColorStop(1, 'rgba(0, 240, 255, 0)')
      
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
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
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
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
  }, [isVisible, animationKey])
  
  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      
      {/* Shuffle button */}
      <button
        onClick={handleShuffle}
        disabled={!canShuffle || isAnimating}
        className={`absolute bottom-4 right-4 p-2 rounded-full border transition-all duration-300 ${
          canShuffle && !isAnimating
            ? 'border-white/20 text-white/40 hover:border-accent-cyan/50 hover:text-accent-cyan cursor-pointer'
            : 'border-white/5 text-white/10 cursor-not-allowed'
        }`}
        title={content.contact.collision.newCollision}
      >
        <RefreshCw 
          size={14} 
          className={isAnimating ? 'animate-spin' : ''} 
        />
      </button>
    </div>
  )
}
