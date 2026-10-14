import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Registered once here: every module that animates on scroll imports gsap from
// this file, so the plugin is in place before its first ScrollTrigger.
gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }
