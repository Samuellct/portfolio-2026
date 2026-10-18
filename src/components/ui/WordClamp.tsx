'use client'

import { useLayoutEffect, useRef } from 'react'
import { cn } from '@/lib/cn'

interface WordClampProps {
  text: string
  className?: string
}

// Clamps a text to the lines its line-clamp class allows, but cuts between two words
// instead of inside one (V6-MOB-03). Without JavaScript the CSS clamp stays as fallback.
// The text node React rendered is edited in place, so React keeps tracking it.
export function WordClamp({ text, className }: WordClampProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    const node = el?.firstChild
    if (!el || !(node instanceof Text)) return

    const words = text.split(' ')
    const fits = (value: string) => {
      node.nodeValue = value
      return el.scrollHeight <= el.clientHeight + 1
    }
    const fit = () => {
      if (fits(text)) return
      let lo = 1
      let hi = words.length - 1
      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2)
        if (fits(`${words.slice(0, mid).join(' ')}…`)) lo = mid
        else hi = mid - 1
      }
      node.nodeValue = `${words.slice(0, lo).join(' ').replace(/[\s,;:.(-]+$/, '')}…`
    }

    let width = 0
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width === width) return
      width = entry.contentRect.width
      fit()
    })
    observer.observe(el)
    return () => {
      observer.disconnect()
      node.nodeValue = text
    }
  }, [text])

  return (
    <span ref={ref} className={cn('line-clamp-2', className)}>
      {text}
    </span>
  )
}
