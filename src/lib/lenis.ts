import type Lenis from 'lenis'

// The live Lenis instance, published by SmoothScrollContext. Modules that need
// it outside React (lib/gsap.ts) subscribe here, so the provider never has to
// import them and routes without GSAP do not load it (V6-COD-09).
type Listener = (lenis: Lenis) => (() => void) | void

let current: Lenis | null = null
const listeners = new Set<Listener>()
const cleanups = new Map<Listener, (() => void) | void>()

export function publishLenis(lenis: Lenis | null) {
  cleanups.forEach((cleanup) => cleanup?.())
  cleanups.clear()
  current = lenis
  if (lenis) listeners.forEach((listener) => cleanups.set(listener, listener(lenis)))
}

export function onLenis(listener: Listener) {
  listeners.add(listener)
  if (current) cleanups.set(listener, listener(current))
}
