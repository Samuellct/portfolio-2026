'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import ContactSection from '@/components/sections/ContactSection'
import { useSite } from '@/context/SiteContext'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

gsap.registerPlugin(ScrollTrigger)

// Background colors for each section
const sectionColors: Record<string, string> = {
  hero: '#06060e',
  about: '#081828',
  projects: '#1c1008',
  contact: '#081c10'
}

export default function HomePageClient() {
  const { hasEnteredSite } = useSite()
  const prefersReducedMotion = useReducedMotion()

  // Setup bkg color transition. Deferred until the entrance is over so the
  // triggers are measured against a settled layout (no landing overlay, scroll
  // unlocked); creating them earlier leaves the body stuck on a wrong section
  // colour when the landing lifts.
  useEffect(() => {
    if (!hasEnteredSite) return

    const sections = [...document.querySelectorAll<HTMLElement>('.section')]
    const colorFor = (id: string) => sectionColors[id] || sectionColors.hero

    // Under reduced motion, keep a single static background (no scroll-driven
    // colour shifts).
    if (prefersReducedMotion) {
      gsap.set(document.body, { backgroundColor: sectionColors.hero })
      return
    }

    const triggers = sections.map((section) =>
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
          if (self.isActive) {
            gsap.to(document.body, {
              backgroundColor: colorFor(section.id),
              duration: 1.2,
              ease: 'power2.out',
              overwrite: 'auto',
            })
          }
        },
      })
    )

    // The layout can still be settling right after the landing lifts. Refresh
    // once on the next frame and snap the body to whichever section is actually
    // centred (hero at the top of the page), so it never stays on a stale colour.
    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      const active = sections.find((s) => {
        const r = s.getBoundingClientRect()
        return r.top <= window.innerHeight / 2 && r.bottom >= window.innerHeight / 2
      })
      gsap.set(document.body, { backgroundColor: colorFor(active?.id ?? 'hero') })
    })

    return () => {
      cancelAnimationFrame(raf)
      triggers.forEach((trigger) => trigger.kill())
    }
  }, [hasEnteredSite, prefersReducedMotion])
  
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </>
  )
}
