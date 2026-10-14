import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onLenis } from './lenis'

// Registered once here: every module that animates on scroll imports gsap from
// this file, so the plugin is in place before its first ScrollTrigger.
gsap.registerPlugin(ScrollTrigger)

// Documented Lenis + GSAP integration, wired only where GSAP is loaded: keep
// ScrollTrigger in step with Lenis's scroll, without lag smoothing.
onLenis((lenis) => {
  const unsubscribe = lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.lagSmoothing(0)
  return () => {
    unsubscribe()
    gsap.ticker.lagSmoothing(500, 33)
  }
})

export { gsap, ScrollTrigger }
