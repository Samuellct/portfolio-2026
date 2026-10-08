'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { RISO } from '@/lib/theme'

// Pastel two-ink starfield behind the hero (Riso contract: sparse, soft, drifting
// slowly). One seeded tile is painted once, then scrolled; reduced motion keeps
// it as a static print.

const INKS = [RISO.pink, RISO.blue, RISO.yellow, RISO.paper].map((hex) => {
  const n = parseInt(hex.slice(1), 16)
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`
})

const DRIFT_PX_PER_S = 4

function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function paintTile(width: number, height: number, dpr: number) {
  const tile = document.createElement('canvas')
  tile.width = Math.round(width * dpr)
  tile.height = Math.round(height * dpr)
  const g = tile.getContext('2d')
  if (!g) return tile
  g.scale(dpr, dpr)
  const rand = seeded(42)

  // Soft halftone blooms, few and faint.
  for (let i = 0; i < 7; i++) {
    const ink = INKS[i % 3]
    const x = rand() * width
    const y = rand() * height
    const r = 60 + rand() * 120
    const grad = g.createRadialGradient(x, y, 0, x, y, r)
    grad.addColorStop(0, `rgba(${ink}, 0.12)`)
    grad.addColorStop(1, `rgba(${ink}, 0)`)
    g.fillStyle = grad
    g.fillRect(x - r, y - r, r * 2, r * 2)
  }

  // Dots: density scales with the area so wide screens stay sparse.
  const count = Math.round((width * height) / 4500)
  for (let i = 0; i < count; i++) {
    const ink = INKS[Math.floor(rand() * INKS.length)]
    const depth = rand()
    const r = depth < 0.92 ? 0.5 + depth * 1.1 : 1.6 + depth * 1.4
    g.fillStyle = `rgba(${ink}, ${0.2 + depth * 0.55})`
    g.beginPath()
    g.arc(rand() * width, rand() * height, r, 0, Math.PI * 2)
    g.fill()
  }
  return tile
}

export default function HeroStarfield({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let tile: HTMLCanvasElement | null = null
    let frame = 0
    let visible = true
    let start = 0

    const draw = (offset: number) => {
      if (!tile) return
      const y = Math.round(offset % tile.height)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(tile, 0, y - tile.height)
      ctx.drawImage(tile, 0, y)
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const { clientWidth: w, clientHeight: h } = canvas
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      tile = paintTile(w, h, dpr)
      draw(0)
    }

    const tick = (now: number) => {
      if (!start) start = now
      if (visible) draw(((now - start) / 1000) * DRIFT_PX_PER_S * (window.devicePixelRatio || 1))
      frame = requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize)
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    observer.observe(canvas)
    if (!prefersReducedMotion) frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [prefersReducedMotion])

  return <canvas ref={canvasRef} aria-hidden="true" className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} />
}
