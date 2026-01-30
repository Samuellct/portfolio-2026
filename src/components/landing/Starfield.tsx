'use client'

import { useEffect, useRef, useCallback } from 'react'

interface StarfieldProps {
  isHyperspace: boolean
  onHyperspaceComplete: () => void
}

// class pour def le champ 3D
class Star {
  x: number
  y: number
  z: number
  prevX: number
  prevY: number
  prevZ: number
  brightness: number
  color: string
  
  private width: number
  private height: number
  private maxDepth: number
  
  constructor(width: number, height: number, maxDepth: number) {
    this.width = width
    this.height = height
    this.maxDepth = maxDepth
    
    this.x = 0
    this.y = 0
    this.z = 0
    this.prevX = 0
    this.prevY = 0
    this.prevZ = 0
    this.brightness = 0
    this.color = ''
    
    this.reset()
  }
  
  reset() {
    // Random position in 3D
    this.x = (Math.random() - 0.5) * this.width * 2
    this.y = (Math.random() - 0.5) * this.height * 2
    this.z = Math.random() * this.maxDepth
    
    // Store previous position for trails
    this.prevX = this.x
    this.prevY = this.y
    this.prevZ = this.z
    
    // Visual properties
    this.brightness = Math.random() * 0.5 + 0.5
    
    const colors = [
      '255, 255, 255',
      '200, 220, 255',
      '255, 240, 220',
      '180, 200, 255',
    ]
    this.color = colors[Math.floor(Math.random() * colors.length)]
  }
  
  update(speed: number, maxDepth: number) {
    // Store previous position
    this.prevX = this.x
    this.prevY = this.y
    this.prevZ = this.z
    
    // Move star towards viewer
    this.z -= speed
    
    // Reset if star passes viewer
    if (this.z <= 0) {
      this.reset()
      this.z = maxDepth
      this.prevZ = maxDepth
    }
  }
  
  draw(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    focalLength: number,
    isHyperspace: boolean,
    hyperspaceProgress: number,
    maxDepth: number
  ) {
    // 3D to 2D projection
    const scale = focalLength / this.z
    const x2d = centerX + this.x * scale
    const y2d = centerY + this.y * scale
    
    // Previous position projection
    const prevScale = focalLength / this.prevZ
    const prevX2d = centerX + this.prevX * prevScale
    const prevY2d = centerY + this.prevY * prevScale
    
    // Size based on depth
    const size = Math.max(0.5, (1 - this.z / maxDepth) * 2.5)
    
    const opacity = Math.min(1, (1 - this.z / maxDepth) * 2) * this.brightness
    
    if (isHyperspace && hyperspaceProgress > 0.1) {
      // Draw trail during hyperspace
      const trailLength = Math.sqrt(
        Math.pow(x2d - prevX2d, 2) + Math.pow(y2d - prevY2d, 2)
      )
      
      if (trailLength > 2) {
        // Create gradient for trail
        const gradient = ctx.createLinearGradient(prevX2d, prevY2d, x2d, y2d)
        gradient.addColorStop(0, `rgba(${this.color}, 0)`)
        gradient.addColorStop(0.3, `rgba(${this.color}, ${opacity * 0.3})`)
        gradient.addColorStop(1, `rgba(${this.color}, ${opacity})`)
        
        ctx.beginPath()
        ctx.moveTo(prevX2d, prevY2d)
        ctx.lineTo(x2d, y2d)
        ctx.strokeStyle = gradient
        ctx.lineWidth = size * (1 + hyperspaceProgress * 3)
        ctx.lineCap = 'round'
        ctx.stroke()
      }
    } else {
      // Draw point during cruise
      ctx.beginPath()
      ctx.arc(x2d, y2d, size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${this.color}, ${opacity})`
      ctx.fill()
      
      // Glow for bright stars
      if (opacity > 0.6) {
        ctx.beginPath()
        ctx.arc(x2d, y2d, size * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${this.color}, ${opacity * 0.15})`
        ctx.fill()
      }
    }
  }
}

export default function Starfield({ isHyperspace, onHyperspaceComplete }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const animationRef = useRef<number>(0)
  const hyperspaceProgressRef = useRef(0)
  const transitionTriggeredRef = useRef(false)
  
  // config
  const STAR_COUNT = 600
  const STAR_SPEED_NORMAL = 0.3
  const STAR_SPEED_HYPERSPACE = 40
  const MAX_DEPTH = 1000
  const FOCAL_LENGTH = 300
  
  // Initialize stars
  const initStars = useCallback((width: number, height: number) => {
    starsRef.current = []
    for (let i = 0; i < STAR_COUNT; i++) {
      starsRef.current.push(new Star(width, height, MAX_DEPTH))
    }
  }, [])
  
  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    
    // Clear with fade
    if (isHyperspace) {
      ctx.fillStyle = `rgba(0, 0, 0, ${0.08 + (1 - hyperspaceProgressRef.current) * 0.15})`
    } else {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
    }
    ctx.fillRect(0, 0, width, height)
    
    // speed calc
    let speed = STAR_SPEED_NORMAL
    if (isHyperspace) {
      speed = STAR_SPEED_NORMAL + 
        (STAR_SPEED_HYPERSPACE - STAR_SPEED_NORMAL) * 
        Math.pow(hyperspaceProgressRef.current, 1.5)
    }
    
    for (const star of starsRef.current) {
      star.update(speed, MAX_DEPTH)
      star.draw(
        ctx,
        centerX,
        centerY,
        FOCAL_LENGTH,
        isHyperspace,
        hyperspaceProgressRef.current,
        MAX_DEPTH
      )
    }
    
    // Update hyperspace progress
    if (isHyperspace && hyperspaceProgressRef.current < 1) {
      hyperspaceProgressRef.current += 0.012
      
      // Trigger transition near the end
      if (hyperspaceProgressRef.current >= 0.9 && !transitionTriggeredRef.current) {
        transitionTriggeredRef.current = true
        setTimeout(() => {
          onHyperspaceComplete()
        }, 150)
      }
    }
    
    animationRef.current = requestAnimationFrame(animate)
  }, [isHyperspace, onHyperspaceComplete])
  
  // Setup canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      
      // Reinitialize stars on resize
      if (starsRef.current.length === 0) {
        initStars(canvas.width, canvas.height)
      }
    }
    
    resize()
    window.addEventListener('resize', resize)
    
    // first clear
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [initStars, animate])
  
  // Reset hyperspace state when transitioning
  useEffect(() => {
    if (isHyperspace) {
      hyperspaceProgressRef.current = 0
      transitionTriggeredRef.current = false
    }
  }, [isHyperspace])
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  )
}
