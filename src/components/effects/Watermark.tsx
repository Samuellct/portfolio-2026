'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

type Parallax = {
  /** Axis the word drifts along, as a percentage of its own size. */
  axis: 'x' | 'y'
  from: number
  to: number
  scrub: number
}

type WatermarkProps = {
  word: string
  /** Placement of the wrapper inside its parent. */
  className: string
  /** Size and line behaviour of the word itself. */
  textClassName: string
  parallax: Parallax
}

/**
 * Decorative word behind a page or section, drifting while its parent scrolls
 * through the viewport. The parent is the ScrollTrigger, so the wrapper must
 * be one of its direct children. No parallax under reduced motion.
 */
export default function Watermark({ word, className, textClassName, parallax }: WatermarkProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const { axis, from, to, scrub } = parallax

  useEffect(() => {
    const el = ref.current
    if (!el?.parentElement || prefersReducedMotion) return

    const prop = axis === 'x' ? 'xPercent' : 'yPercent'
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { [prop]: from },
        {
          [prop]: to,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub,
          },
        }
      )
    })

    return () => ctx.revert()
  }, [prefersReducedMotion, axis, from, to, scrub])

  return (
    <div ref={ref} data-watermark aria-hidden="true" className={`pointer-events-none select-none ${className}`}>
      <span className={`font-display uppercase font-black text-riso-ink/[0.03] leading-none ${textClassName}`}>
        {word}
      </span>
    </div>
  )
}
